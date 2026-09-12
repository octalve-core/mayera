import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/server/audit/events";
import { permissions } from "@/server/auth/permissions";
import { requirePermission } from "@/server/auth/session";
import { clientIp, assertSameOrigin, errorResponse, HttpError } from "@/server/security/request";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { uploadMediaObject } from "@/server/storage/s3";

const allowed = new Map([["image/png", "png"], ["image/jpeg", "jpg"], ["image/webp", "webp"], ["image/avif", "avif"]]);

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(`media-upload:${clientIp(request)}`, 30, 60 * 60 * 1000);
    const session = await requirePermission(permissions.mediaWrite);
    const form = await request.formData();
    const file = form.get("file");
    const alt = String(form.get("alt") ?? "").trim();
    const folder = String(form.get("folder") ?? "products").trim();
    if (!(file instanceof File)) throw new HttpError(400, "Choose an image to upload.");
    const extension = allowed.get(file.type);
    if (!extension) throw new HttpError(400, "Use a PNG, JPEG, WebP or AVIF image.");
    if (!alt || alt.length > 250) throw new HttpError(400, "Add concise accessible alt text.");
    if (file.size <= 0 || file.size > 10 * 1024 * 1024) throw new HttpError(400, "Images must be no larger than 10 MB.");
    const bytes = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadMediaObject({ bytes, mimeType: file.type, extension, folder });
    const media = await prisma.mediaAsset.create({ data: { key: uploaded.key, url: uploaded.publicUrl, alt, folder, mimeType: file.type, bytes: file.size } });
    await recordAudit({ actorId: session.user.id, action: "MEDIA_UPLOADED", entityType: "MediaAsset", entityId: media.id, after: { key: uploaded.key, mimeType: file.type, bytes: file.size } });
    return Response.json({ ok: true, media }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
