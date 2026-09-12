"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  CommerceAvailability,
  OrderStatus,
  Prisma,
  ProductStatus,
  TicketStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isSuperRole, permissions } from "@/server/auth/permissions";
import { requirePermission } from "@/server/auth/session";
import { recordAudit } from "@/server/audit/events";
import { createPaystackRefund } from "@/server/payments/paystack";
import { applyRefundState } from "@/server/payments/refunds";

const imageLocation = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine(
    (value) => value.startsWith("/") || /^https:\/\//.test(value),
    "Use a local /path or secure HTTPS URL.",
  );

export async function createProduct(formData: FormData) {
  const session = await requirePermission(permissions.productsWrite);
  const parsed = z
    .object({
      name: z.string().trim().min(3).max(160),
      slug: z
        .string()
        .trim()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      description: z.string().trim().min(20).max(5000),
      sku: z.string().trim().min(3).max(80),
      label: z.string().trim().min(1).max(80),
      price: z.coerce.number().min(0),
      availability: z.nativeEnum(CommerceAvailability),
      imageUrl: imageLocation,
      categoryIds: z.array(z.string()).max(50),
      stock: z.coerce.number().int().min(0),
      lowStockThreshold: z.coerce.number().int().min(0),
    })
    .safeParse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      sku: formData.get("sku"),
      label: formData.get("label"),
      price: formData.get("price"),
      availability: formData.get("availability"),
      imageUrl: formData.get("imageUrl"),
      categoryIds: formData.getAll("categoryIds"),
      stock: formData.get("stock"),
      lowStockThreshold: formData.get("lowStockThreshold"),
    });
  if (
    !parsed.success ||
    (parsed.data.availability === "AVAILABLE" && parsed.data.price <= 0)
  )
    return;
  const product = await prisma.product.create({
    data: {
      slug: parsed.data.slug,
      name: parsed.data.name,
      shortName: parsed.data.name,
      description: parsed.data.description,
      availability: parsed.data.availability,
      benefits: [],
      ingredients: [],
      howToUse: [],
      imageKind: "uploaded",
      status: "DRAFT",
      claimStatus: "PENDING_COMPLIANCE_REVIEW",
      categories: { connect: parsed.data.categoryIds.map((id) => ({ id })) },
      images: {
        create: {
          url: parsed.data.imageUrl,
          alt: `${parsed.data.name} by Mayéra`,
        },
      },
      variants: {
        create: {
          sku: parsed.data.sku.toUpperCase(),
          label: parsed.data.label,
          priceKobo: Math.round(parsed.data.price * 100),
          inventory: {
            create: {
              available: parsed.data.stock,
              lowStockThreshold: parsed.data.lowStockThreshold,
              movements: {
                create: {
                  quantity: parsed.data.stock,
                  reason: "INITIAL_STOCK",
                  actorId: session.user.id,
                  note: "Initial product stock",
                },
              },
            },
          },
        },
      },
    },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "PRODUCT_CREATED",
    entityType: "Product",
    entityId: product.id,
    after: {
      name: product.name,
      slug: product.slug,
      status: product.status,
      availability: product.availability,
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateProduct(formData: FormData) {
  const session = await requirePermission(permissions.productsWrite);
  const parsed = z
    .object({
      id: z.string().min(1),
      price: z.coerce.number().min(0),
      status: z.nativeEnum(ProductStatus),
      availability: z.nativeEnum(CommerceAvailability),
    })
    .safeParse({
      id: formData.get("id"),
      price: formData.get("price"),
      status: formData.get("status"),
      availability: formData.get("availability"),
    });
  if (
    !parsed.success ||
    (parsed.data.availability === "AVAILABLE" && parsed.data.price <= 0)
  )
    return;
  const before = await prisma.product.findUnique({
    where: { id: parsed.data.id },
    include: { variants: { take: 1 }, images: { take: 1 } },
  });
  if (!before || !before.variants[0]) return;
  if (
    parsed.data.status === ProductStatus.PUBLISHED &&
    (before.claimStatus !== "APPROVED" || !before.images.length)
  )
    return;
  await prisma.$transaction([
    prisma.product.update({
      where: { id: before.id },
      data: {
        status: parsed.data.status,
        availability: parsed.data.availability,
        publishedAt:
          parsed.data.status === ProductStatus.PUBLISHED
            ? new Date()
            : before.publishedAt,
      },
    }),
    prisma.productVariant.update({
      where: { id: before.variants[0].id },
      data: { priceKobo: Math.round(parsed.data.price * 100) },
    }),
  ]);
  await recordAudit({
    actorId: session.user.id,
    action: "PRODUCT_UPDATED",
    entityType: "Product",
    entityId: before.id,
    before: {
      status: before.status,
      availability: before.availability,
      priceKobo: before.variants[0].priceKobo,
    },
    after: {
      status: parsed.data.status,
      availability: parsed.data.availability,
      priceKobo: Math.round(parsed.data.price * 100),
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/products/${before.slug}`);
}

export async function setProductCategories(formData: FormData) {
  const session = await requirePermission(permissions.productsWrite);
  const parsed = z
    .object({
      productId: z.string().min(1),
      categoryIds: z.array(z.string()).max(50),
    })
    .safeParse({
      productId: formData.get("productId"),
      categoryIds: formData.getAll("categoryIds"),
    });
  if (!parsed.success) return;
  const before = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    include: { categories: { select: { id: true, name: true } } },
  });
  if (!before) return;
  const valid = await prisma.category.findMany({
    where: { id: { in: parsed.data.categoryIds } },
    select: { id: true, name: true },
  });
  await prisma.product.update({
    where: { id: before.id },
    data: {
      categories: { set: valid.map((category) => ({ id: category.id })) },
    },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "PRODUCT_CATEGORIES_UPDATED",
    entityType: "Product",
    entityId: before.id,
    before: { categories: before.categories.map((category) => category.name) },
    after: { categories: valid.map((category) => category.name) },
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

async function categoryParentIsSafe(
  parentId: string | undefined,
  categoryId?: string,
) {
  if (!parentId) return true;
  const categories = await prisma.category.findMany({
    select: { id: true, parentId: true },
  });
  const parentById = new Map(
    categories.map((category) => [category.id, category.parentId]),
  );
  if (!parentById.has(parentId)) return false;
  const visited = new Set<string>();
  let current: string | null | undefined = parentId;
  while (current) {
    if (current === categoryId || visited.has(current)) return false;
    visited.add(current);
    current = parentById.get(current);
  }
  return true;
}

export async function createCategory(formData: FormData) {
  const session = await requirePermission(permissions.productsWrite);
  const parsed = z
    .object({
      name: z.string().trim().min(2).max(100),
      slug: z
        .string()
        .trim()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      parentId: z.string().optional(),
      sortOrder: z.coerce.number().int().min(0).max(10000),
    })
    .safeParse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      parentId: formData.get("parentId") || undefined,
      sortOrder: formData.get("sortOrder") || 0,
    });
  if (!parsed.success || !(await categoryParentIsSafe(parsed.data.parentId)))
    return;
  const category = await prisma.category.create({ data: parsed.data });
  await recordAudit({
    actorId: session.user.id,
    action: "CATEGORY_CREATED",
    entityType: "Category",
    entityId: category.id,
    after: {
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
    },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function updateCategory(formData: FormData) {
  const session = await requirePermission(permissions.productsWrite);
  const parsed = z
    .object({
      id: z.string().min(1),
      name: z.string().trim().min(2).max(100),
      parentId: z.string().optional(),
      sortOrder: z.coerce.number().int().min(0).max(10000),
      active: z.boolean(),
    })
    .safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      parentId: formData.get("parentId") || undefined,
      sortOrder: formData.get("sortOrder"),
      active: formData.get("active") === "on",
    });
  if (
    !parsed.success ||
    !(await categoryParentIsSafe(parsed.data.parentId, parsed.data.id))
  )
    return;
  const before = await prisma.category.findUnique({
    where: { id: parsed.data.id },
  });
  if (!before) return;
  const category = await prisma.category.update({
    where: { id: before.id },
    data: {
      name: parsed.data.name,
      parentId: parsed.data.parentId ?? null,
      sortOrder: parsed.data.sortOrder,
      active: parsed.data.active,
    },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "CATEGORY_UPDATED",
    entityType: "Category",
    entityId: category.id,
    before: {
      name: before.name,
      parentId: before.parentId,
      active: before.active,
      sortOrder: before.sortOrder,
    },
    after: {
      name: category.name,
      parentId: category.parentId,
      active: category.active,
      sortOrder: category.sortOrder,
    },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function approveProductClaims(formData: FormData) {
  const session = await requirePermission(permissions.productsWrite);
  if (!isSuperRole(session.user.role)) return;
  const id = z.string().min(1).safeParse(formData.get("id"));
  if (!id.success) return;
  const before = await prisma.product.findUnique({ where: { id: id.data } });
  if (!before || before.claimStatus === "APPROVED") return;
  await prisma.product.update({
    where: { id: before.id },
    data: { claimStatus: "APPROVED" },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "PRODUCT_CLAIMS_APPROVED",
    entityType: "Product",
    entityId: before.id,
    before: { claimStatus: before.claimStatus },
    after: { claimStatus: "APPROVED" },
  });
  revalidatePath("/admin/products");
}

export async function adjustInventory(formData: FormData) {
  const session = await requirePermission(permissions.inventoryWrite);
  const parsed = z
    .object({
      inventoryId: z.string().min(1),
      quantity: z.coerce.number().int().min(-100000).max(100000),
      reason: z.enum(["RESTOCK", "DAMAGE", "ADJUSTMENT", "RETURN"]),
      note: z.string().trim().min(3).max(500),
    })
    .safeParse({
      inventoryId: formData.get("inventoryId"),
      quantity: formData.get("quantity"),
      reason: formData.get("reason"),
      note: formData.get("note"),
    });
  if (!parsed.success || parsed.data.quantity === 0) return;
  const before = await prisma.inventory.findUnique({
    where: { id: parsed.data.inventoryId },
  });
  if (
    !before ||
    before.available + parsed.data.quantity < before.reserved ||
    before.available + parsed.data.quantity < 0
  )
    return;
  const after = await prisma.inventory.update({
    where: { id: before.id },
    data: {
      available: { increment: parsed.data.quantity },
      version: { increment: 1 },
      movements: {
        create: {
          quantity: parsed.data.quantity,
          reason: parsed.data.reason,
          actorId: session.user.id,
          note: parsed.data.note,
        },
      },
    },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "INVENTORY_ADJUSTED",
    entityType: "Inventory",
    entityId: before.id,
    before: { available: before.available, reserved: before.reserved },
    after: {
      available: after.available,
      reserved: after.reserved,
      reason: parsed.data.reason,
      note: parsed.data.note,
    },
  });
  revalidatePath("/admin/inventory");
}

const transitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [],
  PAID: [OrderStatus.PROCESSING],
  PROCESSING: [OrderStatus.PACKED],
  PACKED: [OrderStatus.SHIPPED],
  SHIPPED: [OrderStatus.DELIVERED],
  DELIVERED: [OrderStatus.RETURNED],
  CANCELLED: [],
  RETURNED: [],
  REFUNDED: [],
};
export async function updateOrderStatus(formData: FormData) {
  const session = await requirePermission(permissions.ordersWrite);
  const parsed = z
    .object({
      id: z.string().min(1),
      status: z.nativeEnum(OrderStatus),
      note: z.string().trim().max(500).optional(),
      trackingCode: z.string().trim().max(120).optional(),
    })
    .safeParse({
      id: formData.get("id"),
      status: formData.get("status"),
      note: formData.get("note") || undefined,
      trackingCode: formData.get("trackingCode") || undefined,
    });
  if (!parsed.success) return;
  const order = await prisma.order.findUnique({
    where: { id: parsed.data.id },
  });
  if (!order || !transitions[order.status].includes(parsed.data.status)) return;
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: parsed.data.status,
        statusHistory: {
          create: {
            status: parsed.data.status,
            note: parsed.data.note,
            actorId: session.user.id,
          },
        },
      },
    });
    if (parsed.data.status === OrderStatus.SHIPPED)
      await tx.shipment.create({
        data: {
          orderId: order.id,
          provider: "manual",
          trackingCode: parsed.data.trackingCode || null,
          status: "IN_TRANSIT",
          events: {
            create: {
              status: "IN_TRANSIT",
              note: parsed.data.note || "Order dispatched",
            },
          },
        },
      });
  });
  await recordAudit({
    actorId: session.user.id,
    action: "ORDER_STATUS_UPDATED",
    entityType: "Order",
    entityId: order.id,
    before: { status: order.status },
    after: { status: parsed.data.status, note: parsed.data.note ?? null },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${order.number}`);
}

export async function requestOrderRefund(formData: FormData) {
  const session = await requirePermission(permissions.refundsWrite);
  const parsed = z
    .object({
      orderId: z.string().min(1),
      amount: z.coerce.number().positive(),
      reason: z.string().trim().min(5).max(500),
    })
    .safeParse({
      orderId: formData.get("orderId"),
      amount: formData.get("amount"),
      reason: formData.get("reason"),
    });
  if (!parsed.success) return;
  const amountKobo = Math.round(parsed.data.amount * 100);

  const refund = await prisma.$transaction(
    async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: parsed.data.orderId },
        include: { payments: true, refunds: true },
      });
      const payment = order?.payments.find(
        (entry) => entry.status === "SUCCESS",
      );
      if (!order || !payment) return null;
      const committed = order.refunds
        .filter((entry) => entry.status !== "FAILED")
        .reduce((sum, entry) => sum + entry.amountKobo, 0);
      if (amountKobo > payment.amountKobo - committed) return null;
      return tx.refund.create({
        data: {
          orderId: order.id,
          paymentId: payment.id,
          amountKobo,
          reason: parsed.data.reason,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
  if (!refund) return;

  await recordAudit({
    actorId: session.user.id,
    action: "REFUND_REQUESTED",
    entityType: "Refund",
    entityId: refund.id,
    after: { orderId: refund.orderId, amountKobo, reason: parsed.data.reason },
  });
  try {
    const payment = await prisma.payment.findUniqueOrThrow({
      where: { id: refund.paymentId! },
    });
    const provider = await createPaystackRefund({
      transaction: payment.reference,
      amountKobo,
      customerNote: parsed.data.reason,
      merchantNote: `Mayéra refund ${refund.id}`,
    });
    const updated = await applyRefundState(refund.id, provider);
    await recordAudit({
      actorId: session.user.id,
      action: "REFUND_SUBMITTED_TO_PAYSTACK",
      entityType: "Refund",
      entityId: refund.id,
      before: { status: refund.status },
      after: { status: updated.status, providerRef: updated.providerRef },
    });
  } catch (error) {
    await prisma.refund.update({
      where: { id: refund.id },
      data: { status: "FAILED" },
    });
    await recordAudit({
      actorId: session.user.id,
      action: "REFUND_PROVIDER_FAILED",
      entityType: "Refund",
      entityId: refund.id,
      after: {
        error:
          error instanceof Error
            ? error.message.slice(0, 500)
            : "Unknown provider error",
      },
    });
  }
  revalidatePath("/admin/orders");
  revalidatePath("/super-admin/payments");
}

export async function createDiscount(formData: FormData) {
  const session = await requirePermission(permissions.discountsWrite);
  const parsed = z
    .object({
      name: z.string().trim().min(2).max(100),
      code: z.string().trim().min(3).max(40),
      type: z.enum(["FIXED_AMOUNT", "PERCENTAGE", "FREE_DELIVERY"]),
      amount: z.coerce.number().min(0),
      minimum: z.coerce.number().min(0).optional(),
      maxRedemptions: z.coerce.number().int().positive().optional(),
    })
    .safeParse({
      name: formData.get("name"),
      code: formData.get("code"),
      type: formData.get("type"),
      amount: formData.get("amount"),
      minimum: formData.get("minimum") || undefined,
      maxRedemptions: formData.get("maxRedemptions") || undefined,
    });
  if (!parsed.success) return;
  const discount = await prisma.discount.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      amount:
        parsed.data.type === "PERCENTAGE"
          ? Math.round(parsed.data.amount)
          : Math.round(parsed.data.amount * 100),
      minimumKobo: parsed.data.minimum
        ? Math.round(parsed.data.minimum * 100)
        : null,
      maxRedemptions: parsed.data.maxRedemptions,
      coupons: { create: { code: parsed.data.code.toUpperCase() } },
    },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "DISCOUNT_CREATED",
    entityType: "Discount",
    entityId: discount.id,
    after: { name: discount.name, type: discount.type },
  });
  revalidatePath("/admin/discounts");
}

export async function moderateReview(formData: FormData) {
  const session = await requirePermission(permissions.reviewsModerate);
  const parsed = z
    .object({
      id: z.string().min(1),
      status: z.enum(["PUBLISHED", "REJECTED"]),
    })
    .safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return;
  const before = await prisma.review.findUnique({
    where: { id: parsed.data.id },
  });
  if (!before) return;
  await prisma.review.update({
    where: { id: before.id },
    data: { status: parsed.data.status, moderatedAt: new Date() },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "REVIEW_MODERATED",
    entityType: "Review",
    entityId: before.id,
    before: { status: before.status },
    after: { status: parsed.data.status },
  });
  revalidatePath("/admin/reviews");
}

export async function saveContent(formData: FormData) {
  const session = await requirePermission(permissions.contentWrite);
  const parsed = z
    .object({
      key: z
        .string()
        .trim()
        .regex(/^[a-z0-9.-]+$/),
      content: z.string().trim().min(1).max(20000),
      publish: z.boolean(),
    })
    .safeParse({
      key: formData.get("key"),
      content: formData.get("content"),
      publish: formData.get("publish") === "on",
    });
  if (!parsed.success) return;
  const value = { content: parsed.data.content };
  const before = await prisma.pageContent.findUnique({
    where: { key: parsed.data.key },
  });
  const record = await prisma.pageContent.upsert({
    where: { key: parsed.data.key },
    create: {
      key: parsed.data.key,
      draft: value,
      published: parsed.data.publish ? value : undefined,
      status: parsed.data.publish ? "PUBLISHED" : "DRAFT",
      publishedAt: parsed.data.publish ? new Date() : null,
    },
    update: {
      draft: value,
      ...(parsed.data.publish
        ? {
            published: value,
            status: "PUBLISHED" as const,
            publishedAt: new Date(),
          }
        : { status: "DRAFT" as const }),
    },
  });
  await recordAudit({
    actorId: session.user.id,
    action: parsed.data.publish ? "CONTENT_PUBLISHED" : "CONTENT_DRAFT_UPDATED",
    entityType: "PageContent",
    entityId: record.id,
    before: before?.draft as Prisma.InputJsonValue | undefined,
    after: value,
  });
  revalidatePath("/admin/content");
  revalidatePath("/", "layout");
}

export async function registerMedia(formData: FormData) {
  const session = await requirePermission(permissions.mediaWrite);
  const parsed = z
    .object({
      url: z.string().trim().url(),
      alt: z.string().trim().min(3).max(250),
      folder: z.string().trim().max(80).optional(),
      mimeType: z.string().trim().max(100).optional(),
    })
    .safeParse({
      url: formData.get("url"),
      alt: formData.get("alt"),
      folder: formData.get("folder") || undefined,
      mimeType: formData.get("mimeType") || undefined,
    });
  if (!parsed.success) return;
  const media = await prisma.mediaAsset.create({ data: parsed.data });
  await recordAudit({
    actorId: session.user.id,
    action: "MEDIA_REGISTERED",
    entityType: "MediaAsset",
    entityId: media.id,
    after: { url: media.url, alt: media.alt },
  });
  revalidatePath("/admin/media");
}

export async function createArticle(formData: FormData) {
  const session = await requirePermission(permissions.journalWrite);
  const parsed = z
    .object({
      title: z.string().trim().min(5).max(200),
      slug: z
        .string()
        .trim()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      excerpt: z.string().trim().min(10).max(500),
      body: z.string().trim().min(50).max(50000),
      category: z.string().trim().min(2).max(100),
      publish: z.boolean(),
    })
    .safeParse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      body: formData.get("body"),
      category: formData.get("category"),
      publish: formData.get("publish") === "on",
    });
  if (!parsed.success) return;
  const categorySlug = parsed.data.category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const article = await prisma.article.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      body: { type: "doc", paragraphs: parsed.data.body.split(/\n\n+/) },
      status: parsed.data.publish ? "PUBLISHED" : "DRAFT",
      publishedAt: parsed.data.publish ? new Date() : null,
      category: {
        connectOrCreate: {
          where: { slug: categorySlug },
          create: { slug: categorySlug, name: parsed.data.category },
        },
      },
    },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "ARTICLE_CREATED",
    entityType: "Article",
    entityId: article.id,
    after: { title: article.title, status: article.status },
  });
  revalidatePath("/admin/journal");
  revalidatePath("/hair-journal");
}

export async function createShippingRate(formData: FormData) {
  const session = await requirePermission(permissions.settingsWrite);
  const parsed = z
    .object({
      name: z.string().trim().min(2).max(100),
      states: z.string().trim().max(1000),
      amount: z.coerce.number().min(0),
      minimum: z.coerce.number().min(0).optional(),
    })
    .safeParse({
      name: formData.get("name"),
      states: formData.get("states") ?? "",
      amount: formData.get("amount"),
      minimum: formData.get("minimum") || undefined,
    });
  if (!parsed.success) return;
  const rate = await prisma.shippingRate.create({
    data: {
      name: parsed.data.name,
      states: parsed.data.states
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      amountKobo: Math.round(parsed.data.amount * 100),
      minimumKobo: parsed.data.minimum
        ? Math.round(parsed.data.minimum * 100)
        : null,
    },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "SHIPPING_RATE_CREATED",
    entityType: "ShippingRate",
    entityId: rate.id,
    after: { name: rate.name, amountKobo: rate.amountKobo },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
}

export async function updateCustomerRecord(formData: FormData) {
  const session = await requirePermission(permissions.customersWrite);
  const parsed = z
    .object({
      userId: z.string().min(1),
      notes: z.string().trim().max(5000).optional(),
      tags: z.string().trim().max(1000),
    })
    .safeParse({
      userId: formData.get("userId"),
      notes: formData.get("notes") || undefined,
      tags: formData.get("tags") ?? "",
    });
  if (!parsed.success) return;
  const tags = [
    ...new Set(
      parsed.data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ].slice(0, 50);
  const customer = await prisma.customer.upsert({
    where: { userId: parsed.data.userId },
    create: { userId: parsed.data.userId, notes: parsed.data.notes, tags },
    update: { notes: parsed.data.notes, tags },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "CUSTOMER_RECORD_UPDATED",
    entityType: "Customer",
    entityId: customer.id,
    after: { tags, hasNotes: Boolean(parsed.data.notes) },
  });
  revalidatePath("/admin/customers");
}

export async function updateSupportTicket(formData: FormData) {
  const session = await requirePermission(permissions.customersWrite);
  const parsed = z
    .object({ id: z.string().min(1), status: z.nativeEnum(TicketStatus) })
    .safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return;
  const before = await prisma.supportTicket.findUnique({
    where: { id: parsed.data.id },
  });
  if (!before) return;
  await prisma.supportTicket.update({
    where: { id: before.id },
    data: { status: parsed.data.status },
  });
  await recordAudit({
    actorId: session.user.id,
    action: "SUPPORT_TICKET_UPDATED",
    entityType: "SupportTicket",
    entityId: before.id,
    before: { status: before.status },
    after: { status: parsed.data.status },
  });
  revalidatePath("/admin/support");
  revalidatePath("/account/support");
}

export async function updateContactMessage(formData: FormData) {
  const session = await requirePermission(permissions.customersWrite);
  const id = z.string().min(1).safeParse(formData.get("id"));
  if (!id.success) return;
  const before = await prisma.contactMessage.findUnique({
    where: { id: id.data },
  });
  if (!before) return;
  await prisma.contactMessage.update({
    where: { id: before.id },
    data: { resolved: !before.resolved },
  });
  await recordAudit({
    actorId: session.user.id,
    action: before.resolved
      ? "CONTACT_MESSAGE_REOPENED"
      : "CONTACT_MESSAGE_RESOLVED",
    entityType: "ContactMessage",
    entityId: before.id,
    before: { resolved: before.resolved },
    after: { resolved: !before.resolved },
  });
  revalidatePath("/admin/support");
}
