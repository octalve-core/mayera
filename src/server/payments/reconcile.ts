import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/server/email/resend";
import type { PaystackTransactionData } from "./paystack";

export async function reconcilePaystackPayment(reference: string, data: PaystackTransactionData, eventType = "transaction.verify") {
  const payment = await prisma.payment.findUnique({ where: { reference }, include: { order: true } });
  if (!payment) throw new Error("Payment reference does not match a Mayéra order.");
  if (data.status !== "success") return { paid: false, orderNumber: payment.order.number, status: data.status ?? "unknown" };
  if (data.amount !== payment.amountKobo || (data.currency && data.currency !== payment.currency)) throw new Error("Verified payment amount or currency does not match the order.");
  if (payment.status === PaymentStatus.SUCCESS) return { paid: true, orderNumber: payment.order.number, status: "success" };

  const reconciled = await prisma.$transaction(async (tx) => {
    const fresh = await tx.payment.findUnique({ where: { reference }, include: { order: { include: { items: { include: { variant: { include: { inventory: true } } } } } } } });
    if (!fresh || fresh.status === PaymentStatus.SUCCESS) return false;
    await tx.payment.update({ where: { id: fresh.id }, data: { status: PaymentStatus.SUCCESS, paidAt: data.paid_at ? new Date(data.paid_at) : new Date(), rawMeta: data as Prisma.InputJsonValue, events: { create: { externalId: data.id ? String(data.id) : `${eventType}:${reference}`, eventType, payload: data as Prisma.InputJsonValue, occurredAt: data.paid_at ? new Date(data.paid_at) : new Date() } } } });
    await tx.order.update({ where: { id: fresh.orderId }, data: { status: OrderStatus.PAID, statusHistory: { create: { status: OrderStatus.PAID, note: "Payment verified server-side with Paystack." } } } });
    for (const item of fresh.order.items) {
      const inventory = item.variant.inventory;
      if (!inventory) throw new Error(`Inventory record missing for ${item.sku}`);
      const updated = await tx.inventory.updateMany({ where: { id: inventory.id, available: { gte: item.quantity }, reserved: { gte: item.quantity } }, data: { available: { decrement: item.quantity }, reserved: { decrement: item.quantity }, version: { increment: 1 } } });
      if (updated.count !== 1) throw new Error(`Inventory reconciliation failed for ${item.sku}`);
      await tx.inventoryMovement.create({ data: { inventoryId: inventory.id, quantity: -item.quantity, reason: "SALE", orderId: fresh.orderId, note: `Paid order ${fresh.order.number}` } });
    }
    if (fresh.order.userId) await tx.customer.update({ where: { userId: fresh.order.userId }, data: { totalOrders: { increment: 1 }, totalSpentKobo: { increment: fresh.order.totalKobo } } });
    return true;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  if (reconciled) {
    const total = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(payment.order.totalKobo / 100);
    await sendEmail({
      dedupeKey: `order-confirmation:${payment.orderId}`,
      to: payment.order.email,
      template: "order-confirmation",
      subject: `Mayéra order ${payment.order.number} confirmed`,
      html: `<p>Thank you for your Mayéra order.</p><p><strong>${payment.order.number}</strong> has been paid and is now awaiting fulfilment.</p><p>Total: ${total}</p>`,
      payload: { orderId: payment.orderId, orderNumber: payment.order.number, totalKobo: payment.order.totalKobo }
    }).catch(() => undefined);
  }
  return { paid: true, orderNumber: payment.order.number, status: "success" };
}
