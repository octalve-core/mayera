import { NextRequest } from "next/server";
import { verifyPaystackTransaction } from "@/server/payments/paystack";
import { reconcilePaystackPayment } from "@/server/payments/reconcile";
import { clientIp, errorResponse, HttpError } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";

export async function GET(request: NextRequest) {
  try {
    enforceRateLimit(`verify:${clientIp(request)}`, 30, 15 * 60 * 1000);
    const reference = request.nextUrl.searchParams.get("reference")?.trim();
    if (!reference || reference.length > 120) throw new HttpError(400, "A valid payment reference is required.");
    const data = await verifyPaystackTransaction(reference);
    return Response.json(await reconcilePaystackPayment(reference, data));
  } catch (error) {
    return errorResponse(error);
  }
}
