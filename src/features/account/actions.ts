"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/server/auth/session";

const addressSchema = z.object({
  label: z.string().trim().max(50).optional(),
  recipient: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).optional(),
  line1: z.string().trim().min(5).max(250),
  line2: z.string().trim().max(250).optional(),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  isDefault: z.boolean().default(false),
});

export async function addAddress(formData: FormData) {
  const session = await requireCustomer();
  const parsed = addressSchema.safeParse({
    label: formData.get("label") || undefined,
    recipient: formData.get("recipient"),
    phone: formData.get("phone") || undefined,
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    isDefault: formData.get("isDefault") === "on",
  });
  if (!parsed.success) return;
  await prisma.$transaction(async (tx) => {
    const count = await tx.address.count({
      where: { userId: session.user.id },
    });
    const makeDefault = parsed.data.isDefault || count === 0;
    if (makeDefault)
      await tx.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    await tx.address.create({
      data: { userId: session.user.id, ...parsed.data, isDefault: makeDefault },
    });
  });
  revalidatePath("/account/addresses");
}

export async function deleteAddress(formData: FormData) {
  const session = await requireCustomer();
  const id = String(formData.get("id") ?? "");
  const address = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!address) return;
  await prisma.address.delete({ where: { id: address.id } });
  if (address.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    if (next)
      await prisma.address.update({
        where: { id: next.id },
        data: { isDefault: true },
      });
  }
  revalidatePath("/account/addresses");
}

export async function updateProfile(formData: FormData) {
  const session = await requireCustomer();
  const schema = z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    phone: z.string().trim().max(30).optional(),
    marketingEmailConsent: z.boolean(),
    marketingWhatsappConsent: z.boolean(),
  });
  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone") || undefined,
    marketingEmailConsent: formData.get("marketingEmailConsent") === "on",
    marketingWhatsappConsent: formData.get("marketingWhatsappConsent") === "on",
  });
  if (!parsed.success) return;
  await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
  });
  revalidatePath("/account/profile");
}

export async function submitReview(formData: FormData) {
  const session = await requireCustomer();
  const parsed = z
    .object({
      orderItemId: z.string().min(1),
      rating: z.coerce.number().int().min(1).max(5),
      title: z.string().trim().max(100).optional(),
      body: z.string().trim().min(10).max(2000),
    })
    .safeParse({
      orderItemId: formData.get("orderItemId"),
      rating: formData.get("rating"),
      title: formData.get("title") || undefined,
      body: formData.get("body"),
    });
  if (!parsed.success) return;
  const item = await prisma.orderItem.findFirst({
    where: {
      id: parsed.data.orderItemId,
      order: { userId: session.user.id, status: OrderStatus.DELIVERED },
    },
    select: { id: true, productId: true },
  });
  if (!item) return;
  await prisma.review.upsert({
    where: { orderItemId: item.id },
    create: {
      userId: session.user.id,
      productId: item.productId,
      orderItemId: item.id,
      rating: parsed.data.rating,
      title: parsed.data.title,
      body: parsed.data.body,
      verified: true,
    },
    update: {
      rating: parsed.data.rating,
      title: parsed.data.title,
      body: parsed.data.body,
      status: "PENDING",
      moderatedAt: null,
    },
  });
  revalidatePath("/account/reviews");
}

export async function createSupportTicket(formData: FormData) {
  const session = await requireCustomer();
  const parsed = z
    .object({
      subject: z.string().trim().min(3).max(160),
      message: z.string().trim().min(10).max(5000),
    })
    .safeParse({
      subject: formData.get("subject"),
      message: formData.get("message"),
    });
  if (!parsed.success) return;
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  await prisma.supportTicket.create({
    data: {
      number: `SUP-${stamp}-${randomBytes(3).toString("hex").toUpperCase()}`,
      userId: session.user.id,
      email: session.user.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });
  revalidatePath("/account/support");
  redirect("/account/support?sent=1");
}

export async function revokeOtherSessions() {
  const session = await requireCustomer();
  await prisma.customerSession.updateMany({
    where: {
      userId: session.user.id,
      id: { not: session.id },
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
  revalidatePath("/account/privacy");
}

export async function requestAccountDeletion() {
  const session = await requireCustomer();
  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { status: "DELETION_REQUESTED", deletionRequestedAt: new Date() },
    }),
    prisma.customerSession.updateMany({
      where: { userId: session.user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
  redirect("/");
}
