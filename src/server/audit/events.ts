import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AuditEvent = {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
};

export async function recordAudit(event: AuditEvent) {
  return prisma.auditLog.create({
    data: {
      actorId: event.actorId,
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId,
      before: event.before,
      after: event.after,
      ipAddress: event.ipAddress?.slice(0, 100),
      userAgent: event.userAgent?.slice(0, 500),
      requestId: event.requestId
    }
  });
}
