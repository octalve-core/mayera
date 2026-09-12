import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie, createSession } from "@/server/auth/session";
import { hashPassword, validatePasswordStrength } from "@/server/security/password";
import { assertSameOrigin, clientIp, errorResponse, HttpError } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(200),
  marketingEmailConsent: z.boolean().optional().default(false)
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const ipAddress = clientIp(request);
    enforceRateLimit(`register:${ipAddress}`, 5, 60 * 60 * 1000);
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) throw new HttpError(400, "Check the form and try again.");
    if (!validatePasswordStrength(parsed.data.password)) throw new HttpError(400, "Use at least 12 characters with upper-case, lower-case, number, and symbol.");
    const exists = await prisma.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
    if (exists) throw new HttpError(409, "An account already exists for this email address.");
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        passwordHash,
        marketingEmailConsent: parsed.data.marketingEmailConsent,
        customer: { create: {} },
        wishlist: { create: {} }
      }
    });
    const session = await createSession(user.id, user.role, { ipAddress, userAgent: request.headers.get("user-agent") ?? undefined });
    const response = NextResponse.json({ ok: true, redirectTo: "/account" }, { status: 201 });
    attachSessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
