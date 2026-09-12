import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { Prisma, SessionScope, UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env";
import { PermissionKey, isPrivilegedRole, isSuperRole, roleHasPermission } from "./permissions";
import { HttpError } from "@/server/security/request";
import { SESSION_COOKIE } from "./constants";

export { SESSION_COOKIE } from "./constants";

const sessionInclude = Prisma.validator<Prisma.CustomerSessionInclude>()({
  user: {
    include: {
      adminRole: { include: { permissions: { include: { permission: true } } } },
      adminUser: true,
      customer: true
    }
  }
});

export type AuthSession = Prisma.CustomerSessionGetPayload<{ include: typeof sessionInclude }>;

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function scopeForRole(role: UserRole) {
  if (isSuperRole(role)) return SessionScope.SUPER_ADMIN;
  if (isPrivilegedRole(role)) return SessionScope.ADMIN;
  return SessionScope.CUSTOMER;
}

export async function createSession(userId: string, role: UserRole, context: { userAgent?: string; ipAddress?: string }) {
  const token = randomBytes(32).toString("base64url");
  const ttl = serverEnv().SESSION_TTL_HOURS;
  const expiresAt = new Date(Date.now() + ttl * 60 * 60 * 1000);
  await prisma.customerSession.create({
    data: {
      userId,
      tokenHash: tokenHash(token),
      scope: scopeForRole(role),
      userAgent: context.userAgent?.slice(0, 500),
      ipAddress: context.ipAddress?.slice(0, 100),
      expiresAt
    }
  });
  return { token, expiresAt };
}

export function attachSessionCookie(response: NextResponse, token: string, expiresAt: Date) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function revokeSessionToken(token: string | undefined) {
  if (!token) return;
  await prisma.customerSession.updateMany({ where: { tokenHash: tokenHash(token), revokedAt: null }, data: { revokedAt: new Date() } });
}

export const getCurrentSession = cache(async (): Promise<AuthSession | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.customerSession.findUnique({ where: { tokenHash: tokenHash(token) }, include: sessionInclude });
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.status !== UserStatus.ACTIVE) return null;
  return session;
});

export async function requireCustomer() {
  const session = await getCurrentSession();
  if (!session) redirect("/sign-in?next=/account");
  if (session.user.role !== UserRole.CUSTOMER) redirect(isSuperRole(session.user.role) ? "/super-admin" : "/admin");
  return session;
}

export async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session || !isPrivilegedRole(session.user.role)) redirect("/sign-in?mode=admin&next=/admin");
  if (!session.user.mfaEnabled) redirect("/security/mfa-required");
  return session;
}

export async function requireSuperAdmin() {
  const session = await getCurrentSession();
  if (!session || !isSuperRole(session.user.role)) redirect("/sign-in?mode=admin&next=/super-admin");
  if (!session.user.mfaEnabled) redirect("/security/mfa-required");
  return session;
}

export function sessionHasPermission(session: AuthSession, permission: PermissionKey) {
  if (roleHasPermission(session.user.role, permission)) return true;
  return session.user.adminRole?.permissions.some((entry) => entry.permission.key === permission) ?? false;
}

export async function requirePermission(permission: PermissionKey) {
  const session = await getCurrentSession();
  if (!session || !isPrivilegedRole(session.user.role)) throw new HttpError(401, "Sign in with an authorised admin account.");
  if (!session.user.mfaEnabled) throw new HttpError(403, "MFA is required for privileged accounts.");
  if (!sessionHasPermission(session, permission)) throw new HttpError(403, "You do not have permission to perform this action.");
  return session;
}

export async function requirePagePermission(permission: PermissionKey) {
  const session = await requireAdmin();
  if (!sessionHasPermission(session, permission)) redirect("/admin?denied=1");
  return session;
}
