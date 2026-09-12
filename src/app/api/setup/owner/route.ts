import { timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { initializeLiveMayéraStore } from "@/server/setup/launch-data";
import { encryptField } from "@/server/security/encryption";
import { hashPassword, validatePasswordStrength } from "@/server/security/password";
import { assertSameOrigin, clientIp, errorResponse, HttpError } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { generateTotpSecret, totpUri, verifyTotp } from "@/server/security/totp";

export const runtime = "nodejs";
export const maxDuration = 60;

const identityFields = {
  setupToken: z.string().trim().min(1).max(300),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(200),
  confirmPassword: z.string().min(12).max(200)
};

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("start"), ...identityFields }),
  z.object({
    action: z.literal("complete"),
    ...identityFields,
    totpSecret: z.string().trim().toUpperCase().regex(/^[A-Z2-7]{16,64}$/),
    totpCode: z.string().trim().regex(/^\d{6}$/)
  })
]);

function assertSetupToken(submitted: string) {
  const expected = serverEnv().MAYERA_SETUP_TOKEN;
  if (!expected) throw new HttpError(503, "First-owner setup is not enabled. Add MAYERA_SETUP_TOKEN in Vercel, then redeploy.");
  const expectedBuffer = Buffer.from(expected);
  const submittedBuffer = Buffer.from(submitted);
  if (expectedBuffer.length !== submittedBuffer.length || !timingSafeEqual(expectedBuffer, submittedBuffer)) {
    throw new HttpError(401, "The one-time setup token is incorrect.");
  }
}

function assertOwnerDetails(details: { password: string; confirmPassword: string }) {
  if (details.password !== details.confirmPassword) throw new HttpError(400, "The two password entries do not match.");
  if (!validatePasswordStrength(details.password)) {
    throw new HttpError(400, "Use at least 12 characters with upper-case, lower-case, number and symbol characters.");
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(`owner-setup:${clientIp(request)}`, 10, 15 * 60 * 1000);
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) throw new HttpError(400, "Check every setup field and try again.");
    assertOwnerDetails(parsed.data);
    assertSetupToken(parsed.data.setupToken);

    const privilegedCount = await prisma.user.count({ where: { role: { not: UserRole.CUSTOMER } } });
    if (privilegedCount > 0) throw new HttpError(409, "First-owner setup is already complete. Sign in through /admin.");

    if (parsed.data.action === "start") {
      const secret = generateTotpSecret();
      return Response.json(
        { ok: true, totpSecret: secret, totpUri: totpUri(secret, parsed.data.email) },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (!verifyTotp(parsed.data.totpSecret, parsed.data.totpCode)) {
      throw new HttpError(400, "The authenticator code is incorrect or expired. Enter the current six-digit code.");
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const encryptedTotp = encryptField(parsed.data.totpSecret);
    const env = serverEnv();
    const owner = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw<Array<{ lock_value: string }>>`
        SELECT pg_advisory_xact_lock(687235911)::text AS lock_value
      `;
      const existingPrivileged = await tx.user.count({ where: { role: { not: UserRole.CUSTOMER } } });
      if (existingPrivileged > 0) throw new HttpError(409, "First-owner setup is already complete. Sign in through /admin.");
      const existingEmail = await tx.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
      if (existingEmail) throw new HttpError(409, "That email already belongs to an account. Use a different private owner email.");

      await initializeLiveMayéraStore(tx, env.MAYERA_STANDARD_DELIVERY_KOBO);
      const created = await tx.user.create({
        data: {
          email: parsed.data.email,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          role: UserRole.OWNER,
          status: UserStatus.ACTIVE,
          passwordHash,
          mfaEnabled: true,
          mfaSecretEncrypted: encryptedTotp,
          emailVerifiedAt: new Date(),
          adminUser: { create: { mfaEnforced: true, activatedAt: new Date() } }
        }
      });
      await tx.systemSetting.upsert({
        where: { key: "owner-bootstrap-complete" },
        create: { key: "owner-bootstrap-complete", value: { completedAt: new Date().toISOString(), ownerEmail: created.email } },
        update: { value: { completedAt: new Date().toISOString(), ownerEmail: created.email } }
      });
      await tx.auditLog.create({
        data: {
          actorId: created.id,
          action: "FIRST_OWNER_CREATED",
          entityType: "User",
          entityId: created.id,
          after: { email: created.email, role: created.role, mfaEnabled: true },
          ipAddress: clientIp(request).slice(0, 100),
          userAgent: request.headers.get("user-agent")?.slice(0, 500)
        }
      });
      return created;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 10_000, timeout: 50_000 });

    return Response.json(
      { ok: true, redirectTo: "/admin", ownerEmail: owner.email },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
