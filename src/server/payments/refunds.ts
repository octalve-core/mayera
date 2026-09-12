import { OrderStatus, PaymentStatus, Prisma, RefundStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PaystackRefundData } from "./paystack";

function localStatus(providerStatus: string | undefined) {
  if (providerStatus === "processed" || providerStatus === "success") return RefundStatus.SUCCESS;
  if (providerStatus === "failed") return RefundStatus.FAILED;
  return RefundStatus.PROCESSING;
}

export async function applyRefundState(refundId: string, data: PaystackRefundData) {
  return prisma.$transaction(async (tx) => {
    const refund = await tx.refund.findUnique({ where: { id: refundId }, include: { payment: true } });
    if (!refund) throw new Error("Refund record was not found.");
    const status = localStatus(data.status);
    if (refund.status === RefundStatus.SUCCESS && status === RefundStatus.SUCCESS) return refund;
    const updated = await tx.refund.update({
      where: { id: refund.id },
      data: { providerRef: data.id ? String(data.id) : refund.providerRef, status }
    });
    if (status === RefundStatus.SUCCESS && refund.payment) {
      const totals = await tx.refund.aggregate({
        where: { paymentId: refund.payment.id, status: RefundStatus.SUCCESS },
        _sum: { amountKobo: true }
      });
      if ((totals._sum.amountKobo ?? 0) >= refund.payment.amountKobo) {
        await tx.payment.update({ where: { id: refund.payment.id }, data: { status: PaymentStatus.REFUNDED } });
        await tx.order.update({
          where: { id: refund.orderId },
          data: { status: OrderStatus.REFUNDED, statusHistory: { create: { status: OrderStatus.REFUNDED, note: "Paystack confirmed the full refund." } } }
        });
      }
    }
    return updated;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function reconcilePaystackRefundEvent(data: PaystackRefundData) {
  const providerRef = data.id ? String(data.id) : undefined;
  if (!providerRef) throw new Error("Paystack refund event did not include a refund identifier.");
  const refund = await prisma.refund.findFirst({ where: { providerRef } });
  if (!refund) throw new Error("Paystack refund event does not match a Mayéra refund.");
  return applyRefundState(refund.id, data);
}
