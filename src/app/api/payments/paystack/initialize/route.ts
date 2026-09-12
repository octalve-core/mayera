import { NextRequest } from "next/server";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import { getCurrentSession } from "@/server/auth/session";
import { cancelPendingCheckout, createPendingCheckout } from "@/server/checkout/service";
import { initializePaystackTransaction } from "@/server/payments/paystack";
import { assertSameOrigin, clientIp, errorResponse, HttpError } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";

const schema = z.object({
  idempotencyKey: z.string().uuid(),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7).max(30),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  address: z.string().trim().min(5).max(250),
  landmark: z.string().trim().max(250).optional(),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  couponCode: z.string().trim().max(40).optional(),
  note: z.string().trim().max(500).optional(),
  lines: z.array(z.object({ sku: z.string().trim().min(3).max(80), quantity: z.number().int().min(1).max(10) })).min(1).max(20)
});

export async function POST(request: NextRequest) {
  let pendingOrderId: string | undefined;
  try {
    assertSameOrigin(request);
    enforceRateLimit(`checkout:${clientIp(request)}`, 12, 15 * 60 * 1000);
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) throw new HttpError(400, "Check your contact, delivery and bag details, then try again.");
    const session = await getCurrentSession();
    const pending = await createPendingCheckout(parsed.data, session?.user.id);
    pendingOrderId = pending.orderId;
    const callback = new URL(serverEnv().PAYSTACK_CALLBACK_URL ?? "/checkout/success", request.nextUrl.origin);
    callback.searchParams.set("reference", pending.reference);
    const paystack = await initializePaystackTransaction({
      email: pending.email,
      amountKobo: pending.totalKobo,
      reference: pending.reference,
      callbackUrl: callback.toString(),
      orderId: pending.orderId,
      orderNumber: pending.orderNumber
    });
    return Response.json({ ok: true, authorizationUrl: paystack.authorizationUrl, reference: paystack.reference, orderNumber: pending.orderNumber, totalKobo: pending.totalKobo });
  } catch (error) {
    if (pendingOrderId) await cancelPendingCheckout(pendingOrderId, "Payment initialization failed; stock reservation released.").catch(() => undefined);
    return errorResponse(error);
  }
}
