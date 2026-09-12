import { prisma } from "@/lib/prisma";
import { activateBundledPublicFallback, shouldReadPublicDatabase } from "@/server/database/public-read";

export async function getPublishedText(key: string, fallback: string) {
  if (!shouldReadPublicDatabase()) return fallback;

  try {
    const record = await prisma.pageContent.findUnique({
      where: { key },
      select: { published: true, status: true }
    });

    if (record?.status !== "PUBLISHED" || !record.published || Array.isArray(record.published)) {
      return fallback;
    }

    const content = (record.published as { content?: unknown }).content;
    return typeof content === "string" && content.trim() ? content : fallback;
  } catch (error) {
    activateBundledPublicFallback(error);
    return fallback;
  }
}

export async function isMaintenanceMode() {
  if (!shouldReadPublicDatabase()) return false;
  try {
    const setting = await prisma.systemSetting.findUnique({ where: { key: "maintenance-mode" }, select: { value: true } });
    return Boolean((setting?.value as { enabled?: unknown } | undefined)?.enabled);
  } catch (error) {
    activateBundledPublicFallback(error);
    return false;
  }
}
