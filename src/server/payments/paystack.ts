import { createHmac, timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/lib/env";

export type PaystackInitializeInput = { email: string; amountKobo: number; reference: string; callbackUrl: string; orderId: string; orderNumber: string };

function secretKey() {
  const secret = serverEnv().PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured. Add a Paystack test or live secret key on the server.");
  return secret;
}

export async function initializePaystackTransaction(input: PaystackInitializeInput) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json" }, body: JSON.stringify({ email: input.email, amount: input.amountKobo, currency: "NGN", reference: input.reference, callback_url: input.callbackUrl, metadata: { brand: "Mayéra", source: "web", orderId: input.orderId, orderNumber: input.orderNumber } }), cache: "no-store" });
  const result = await response.json() as { status?: boolean; message?: string; data?: { authorization_url?: string; reference?: string } };
  if (!response.ok || !result.status || !result.data?.authorization_url) throw new Error(result.message ?? "Paystack initialization failed");
  return { reference: result.data.reference ?? input.reference, authorizationUrl: result.data.authorization_url };
}

export type PaystackTransactionData = { id?: number; status?: string; reference?: string; amount?: number; currency?: string; paid_at?: string; channel?: string; customer?: { email?: string }; metadata?: Record<string, unknown> };

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${secretKey()}` }, cache: "no-store" });
  const result = await response.json() as { status?: boolean; message?: string; data?: PaystackTransactionData };
  if (!response.ok || !result.status || !result.data) throw new Error(result.message ?? "Paystack verification failed");
  return result.data;
}

export type PaystackRefundData = {
  id?: number;
  status?: string;
  amount?: number;
  currency?: string;
  transaction?: number | { id?: number; reference?: string };
};

export async function createPaystackRefund(input: { transaction: string; amountKobo: number; customerNote: string; merchantNote: string }) {
  const response = await fetch("https://api.paystack.co/refund", {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ transaction: input.transaction, amount: input.amountKobo, currency: "NGN", customer_note: input.customerNote, merchant_note: input.merchantNote }),
    cache: "no-store"
  });
  const result = await response.json() as { status?: boolean; message?: string; data?: PaystackRefundData };
  if (!response.ok || !result.status || !result.data) throw new Error(result.message ?? "Paystack refund request failed");
  return result.data;
}

export function verifyPaystackWebhookSignature(rawBody: string, signature: string) {
  const expected = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  if (!signature || signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
