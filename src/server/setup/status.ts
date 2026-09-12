import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function hasPrivilegedAccount() {
  return (await prisma.user.count({ where: { role: { not: UserRole.CUSTOMER } } })) > 0;
}
