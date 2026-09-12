import { randomBytes } from "node:crypto";
import { DiscountType, OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { quoteShipping } from "@/server/shipping/provider";
import { HttpError } from "@/server/security/request";

export type CheckoutInput = {
  idempotencyKey: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  couponCode?: string;
  note?: string;
  lines: Array<{ sku: string; quantity: number }>;
};

function orderNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `MYR-${stamp}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function paymentReference() {
  return `MYR-${Date.now()}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function calculateDiscount(type: DiscountType, amount: number, subtotalKobo: number, maximum?: number | null) {
  if (type === DiscountType.FIXED_AMOUNT) return Math.min(subtotalKobo, amount);
  if (type === DiscountType.PERCENTAGE) {
    const calculated = Math.round(subtotalKobo * Math.min(100, amount) / 100);
    return Math.min(calculated, maximum ?? calculated);
  }
  return 0;
}

export async function createPendingCheckout(input: CheckoutInput, userId?: string) {
  const existing = await prisma.order.findUnique({ where: { idempotencyKey: input.idempotencyKey }, include: { payments: true } });
  if (existing) {
    const payment = existing.payments[0];
    if (!payment) throw new HttpError(409, "This checkout attempt could not be resumed.");
    return { orderId: existing.id, orderNumber: existing.number, totalKobo: existing.totalKobo, reference: payment.reference, email: existing.email };
  }

  const quantityBySku = new Map<string, number>();
  for (const line of input.lines) {
    const quantity = (quantityBySku.get(line.sku) ?? 0) + line.quantity;
    if (quantity > 10) throw new HttpError(400, "A product quantity cannot exceed 10 per checkout.");
    quantityBySku.set(line.sku, quantity);
  }
  const skus = [...quantityBySku.keys()];

  return prisma.$transaction(async (tx) => {
    const variants = await tx.productVariant.findMany({ where: { sku: { in: skus }, active: true, priceKobo: { gt: 0 }, product: { status: "PUBLISHED", claimStatus: "APPROVED", availability: "AVAILABLE" } }, include: { product: true, inventory: true } });
    if (variants.length !== skus.length) throw new HttpError(400, "One or more products are not available for checkout.");
    let subtotalKobo = 0;
    for (const variant of variants) {
      const quantity = quantityBySku.get(variant.sku) ?? 0;
      if (!variant.inventory || variant.inventory.available - variant.inventory.reserved < quantity) throw new HttpError(409, `${variant.product.name} does not have enough available stock.`);
      subtotalKobo += variant.priceKobo * quantity;
    }

    let discountKobo = 0;
    let shippingDiscount = false;
    let couponCode: string | undefined;
    let discountId: string | undefined;
    if (input.couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: input.couponCode.trim().toUpperCase() }, include: { discount: true } });
      const now = new Date();
      const valid = coupon?.active && coupon.discount.active && (!coupon.discount.startsAt || coupon.discount.startsAt <= now) && (!coupon.discount.endsAt || coupon.discount.endsAt >= now) && (!coupon.discount.minimumKobo || subtotalKobo >= coupon.discount.minimumKobo) && (!coupon.discount.maxRedemptions || coupon.discount.redemptions < coupon.discount.maxRedemptions);
      if (!valid || !coupon) throw new HttpError(400, "This discount code is invalid, expired, or does not meet the order minimum.");
      shippingDiscount = coupon.discount.type === DiscountType.FREE_DELIVERY;
      discountKobo = calculateDiscount(coupon.discount.type, coupon.discount.amount, subtotalKobo, coupon.discount.maxDiscountKobo);
      couponCode = coupon.code;
      discountId = coupon.discount.id;
    }

    const shippingQuote = await quoteShipping(tx, { city: input.city, state: input.state, country: "Nigeria" }, subtotalKobo);
    const shippingKobo = shippingDiscount ? 0 : shippingQuote.amountKobo;
    const totalKobo = subtotalKobo + shippingKobo - discountKobo;
    if (totalKobo <= 0) throw new HttpError(400, "The checkout total must be greater than zero for Paystack payment.");
    const reference = paymentReference();
    const order = await tx.order.create({ data: {
      number: orderNumber(), idempotencyKey: input.idempotencyKey, userId, email: input.email, phone: input.phone,
      subtotalKobo, shippingKobo, discountKobo, totalKobo, discountCode: couponCode,
      shippingName: `${input.firstName} ${input.lastName}`.trim(), shippingLine1: input.address, shippingLine2: input.landmark || null,
      shippingCity: input.city, shippingState: input.state, customerNote: input.note || null,
      items: { create: variants.map((variant) => ({ productId: variant.productId, variantId: variant.id, name: variant.product.name, sku: variant.sku, quantity: quantityBySku.get(variant.sku) ?? 1, unitKobo: variant.priceKobo, totalKobo: variant.priceKobo * (quantityBySku.get(variant.sku) ?? 1) })) },
      payments: { create: { provider: "paystack", reference, amountKobo: totalKobo } },
      statusHistory: { create: { status: OrderStatus.PENDING, note: "Checkout created; awaiting verified payment." } }
    } });

    for (const variant of variants) {
      const quantity = quantityBySku.get(variant.sku) ?? 0;
      await tx.inventory.update({ where: { id: variant.inventory!.id }, data: { reserved: { increment: quantity }, version: { increment: 1 }, movements: { create: { quantity, reason: "RESERVATION", orderId: order.id, note: `Reserved for ${order.number}` } } } });
    }
    if (discountId) await tx.discount.update({ where: { id: discountId }, data: { redemptions: { increment: 1 } } });
    return { orderId: order.id, orderNumber: order.number, totalKobo, reference, email: order.email };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function cancelPendingCheckout(orderId: string, reason: string) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: { include: { variant: { include: { inventory: true } } } }, payments: true } });
    if (!order || order.status !== OrderStatus.PENDING) return;
    await tx.order.update({ where: { id: order.id }, data: { status: OrderStatus.CANCELLED, cancelledAt: new Date(), statusHistory: { create: { status: OrderStatus.CANCELLED, note: reason.slice(0, 500) } } } });
    await tx.payment.updateMany({ where: { orderId: order.id, status: PaymentStatus.PENDING }, data: { status: PaymentStatus.FAILED } });
    for (const item of order.items) {
      if (!item.variant.inventory) continue;
      await tx.inventory.update({ where: { id: item.variant.inventory.id }, data: { reserved: { decrement: item.quantity }, version: { increment: 1 }, movements: { create: { quantity: -item.quantity, reason: "RESERVATION_RELEASE", orderId: order.id, note: reason.slice(0, 500) } } } });
    }
    if (order.discountCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: order.discountCode } });
      if (coupon) await tx.discount.updateMany({ where: { id: coupon.discountId, redemptions: { gt: 0 } }, data: { redemptions: { decrement: 1 } } });
    }
  });
}
