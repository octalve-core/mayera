import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ttlMinutes = Math.max(
  5,
  Number.parseInt(process.env.PENDING_ORDER_TTL_MINUTES || "30", 10),
);
const cutoff = new Date(Date.now() - ttlMinutes * 60 * 1000);

async function release(orderId) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { variant: { include: { inventory: true } } } },
      },
    });
    if (!order || order.status !== "PENDING" || order.createdAt > cutoff)
      return false;

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        statusHistory: {
          create: {
            status: "CANCELLED",
            note: "Unpaid checkout expired; reserved inventory released automatically.",
          },
        },
      },
    });
    await tx.payment.updateMany({
      where: { orderId: order.id, status: "PENDING" },
      data: { status: "FAILED" },
    });
    for (const item of order.items) {
      const inventory = item.variant.inventory;
      if (!inventory) continue;
      const releaseQuantity = Math.min(item.quantity, inventory.reserved);
      if (!releaseQuantity) continue;
      await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          reserved: { decrement: releaseQuantity },
          version: { increment: 1 },
          movements: {
            create: {
              quantity: -releaseQuantity,
              reason: "RESERVATION_RELEASE",
              orderId: order.id,
              note: "Expired unpaid checkout",
            },
          },
        },
      });
    }
    if (order.discountCode) {
      const coupon = await tx.coupon.findUnique({
        where: { code: order.discountCode },
      });
      if (coupon)
        await tx.discount.updateMany({
          where: { id: coupon.discountId, redemptions: { gt: 0 } },
          data: { redemptions: { decrement: 1 } },
        });
    }
    return true;
  });
}

async function main() {
  const expired = await prisma.order.findMany({
    where: { status: "PENDING", createdAt: { lte: cutoff } },
    select: { id: true },
  });
  let released = 0;
  for (const order of expired) if (await release(order.id)) released += 1;
  console.log(`Released ${released} expired Mayéra order reservation(s).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
