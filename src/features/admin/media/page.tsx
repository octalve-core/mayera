import { PortalPageHeading } from "@/components/portal/page-heading";
import { prisma } from "@/lib/prisma";
import { permissions } from "@/server/auth/permissions";
import { requirePagePermission, sessionHasPermission } from "@/server/auth/session";
import { registerMedia } from "../actions";
import { MediaUploadForm } from "./upload-form";

export default async function AdminMediaPage() {
  const session = await requirePagePermission(permissions.mediaRead);
  const canWrite = sessionHasPermission(session, permissions.mediaWrite);
  const storageReady = Boolean(process.env.OBJECT_STORAGE_ENDPOINT && process.env.OBJECT_STORAGE_BUCKET && process.env.OBJECT_STORAGE_ACCESS_KEY_ID && process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY && process.env.OBJECT_STORAGE_PUBLIC_URL);
  const media = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return <>
    <PortalPageHeading eyebrow="CMS" title="Media" description="Upload approved product and content images to the configured S3/R2-compatible object store, or register an existing secure asset URL." />
    {canWrite && storageReady ? <MediaUploadForm /> : canWrite ? <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Object storage is not configured yet. Add the OBJECT_STORAGE_* variables to enable direct uploads; existing HTTPS assets can still be registered below.</p> : null}
    {canWrite ? <details className="mt-6 rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-6"><summary className="cursor-pointer font-serif text-xl">Register an existing asset URL</summary><form action={registerMedia} className="mt-5 grid gap-4 md:grid-cols-2"><Field name="url" label="Public asset URL" type="url" required /><Field name="alt" label="Accessible alt text" required /><Field name="folder" label="Folder" /><Field name="mimeType" label="MIME type" placeholder="image/webp" /><button className="min-h-11 rounded-full bg-mayera-espresso px-6 text-sm text-white md:w-fit">Register asset</button></form></details> : null}
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{media.map((item) => <article key={item.id} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5"><p className="truncate text-sm font-medium">{item.alt}</p><a href={item.url} target="_blank" rel="noreferrer" className="mt-2 block truncate text-xs text-mayera-espresso/45 underline underline-offset-4">{item.url}</a><p className="mt-3 text-xs text-mayera-olive">{item.folder ?? "Unfiled"} · {item.mimeType ?? "Unknown type"}{item.bytes ? ` · ${Math.ceil(item.bytes / 1024)} KB` : ""}</p></article>)}{!media.length ? <p className="rounded-[1.5rem] border border-dashed border-mayera-line p-8 text-center text-sm text-mayera-espresso/50 md:col-span-2 xl:col-span-3">No media assets registered.</p> : null}</div>
  </>;
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="text-xs uppercase tracking-[.1em]">{label}<input className="mt-2 h-11 w-full rounded-xl border border-mayera-line bg-white px-3 text-sm normal-case" {...props} /></label>;
}
