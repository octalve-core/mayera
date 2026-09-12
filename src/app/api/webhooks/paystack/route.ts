import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPaystackWebhookSignature, type PaystackRefundData, type PaystackTransactionData } from "@/server/payments/paystack";
import { reconcilePaystackPayment } from "@/server/payments/reconcile";
import { reconcilePaystackRefundEvent } from "@/server/payments/refunds";

type PaystackEvent = { event?: string; data?: PaystackTransactionData | PaystackRefundData };

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  try {
    if (!verifyPaystackWebhookSignature(raw, signature)) return Response.json({ ok: false }, { status: 401 });
    const event = JSON.parse(raw) as PaystackEvent;
    if (!event.event || !event.data) return Response.json({ ok: false }, { status: 400 });
    const reference = "reference" in event.data ? event.data.reference : undefined;
    const providerEventId = event.data.id ? String(event.data.id) : reference;
    if (!providerEventId) return Response.json({ ok: false }, { status: 400 });
    const externalId = `${event.event}:${providerEventId}`;
    let record;
    try {
      record = await prisma.webhookEvent.create({ data: { provider: "paystack", externalId, eventType: event.event, signature, payload: event as Prisma.InputJsonValue, attempts: 1 } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const existing = await prisma.webhookEvent.findUnique({ where: { provider_externalId: { provider: "paystack", externalId } } });
        if (!existing) throw error;
        if (existing.processed) return Response.json({ ok: true, duplicate: true });
        record = await prisma.webhookEvent.update({ where: { id: existing.id }, data: { attempts: { increment: 1 }, signature, error: null } });
      } else throw error;
    }
    try {
      if (event.event === "charge.success" && "reference" in event.data && event.data.reference) await reconcilePaystackPayment(event.data.reference, event.data, event.event);
      if (["refund.pending", "refund.processing", "refund.processed", "refund.failed"].includes(event.event)) await reconcilePaystackRefundEvent(event.data as PaystackRefundData);
      await prisma.webhookEvent.update({ where: { id: record.id }, data: { processed: true, processedAt: new Date() } });
      return Response.json({ ok: true });
    } catch (error) {
      await prisma.webhookEvent.update({ where: { id: record.id }, data: { error: error instanceof Error ? error.message.slice(0, 1000) : "Unknown webhook error" } });
      throw error;
    }
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
