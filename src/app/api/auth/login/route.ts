import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie, createSession } from "@/server/auth/session";
import { isPrivilegedRole } from "@/server/auth/permissions";
import { decryptField } from "@/server/security/encryption";
import { verifyPassword } from "@/server/security/password";
import { verifyTotp } from "@/server/security/totp";
import { assertSameOrigin, clientIp, errorResponse, HttpError } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { recordAudit } from "@/server/audit/events";

const schema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(200),
  mfaCode: z.string().trim().max(12).optional(),
  next: z.string().max(300).optional()
});

function safeNext(value: string | undefined, privileged: boolean) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return privileged ? "/admin" : "/account";
  if (!privileged && (value.startsWith("/admin") || value.startsWith("/super-admin"))) return "/account";
  return value;
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const ipAddress = clientIp(request);
    enforceRateLimit(`login:${ipAddress}`, 10, 15 * 60 * 1000);
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) throw new HttpError(400, "Enter a valid email address and password.");

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    const now = new Date();
    if (!user || !user.passwordHash || user.status !== UserStatus.ACTIVE || (user.lockedUntil && user.lockedUntil > now)) {
      throw new HttpError(401, "The email, password, or verification code is incorrect.");
    }

    const passwordValid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!passwordValid) {
      const attempts = user.failedLoginAttempts + 1;
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts, lockedUntil: attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null }
      });
      throw new HttpError(401, "The email, password, or verification code is incorrect.");
    }

    const privileged = isPrivilegedRole(user.role);
    if (privileged) {
      if (!user.mfaEnabled || !user.mfaSecretEncrypted) throw new HttpError(403, "This privileged account must complete MFA setup before it can sign in.");
      if (!parsed.data.mfaCode || !verifyTotp(decryptField(user.mfaSecretEncrypted), parsed.data.mfaCode)) {
        throw new HttpError(401, "The email, password, or verification code is incorrect.");
      }
    }

    const userAgent = request.headers.get("user-agent") ?? undefined;
    const session = await createSession(user.id, user.role, { ipAddress, userAgent });
    await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: now } });
    await recordAudit({ actorId: user.id, action: "AUTH_LOGIN_SUCCEEDED", entityType: "User", entityId: user.id, ipAddress, userAgent });
    const response = NextResponse.json({ ok: true, redirectTo: safeNext(parsed.data.next, privileged) });
    attachSessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
