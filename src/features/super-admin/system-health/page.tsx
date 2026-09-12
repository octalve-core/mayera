import { PortalPageHeading } from "@/components/portal/page-heading";
import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env";
import { requireSuperAdmin } from "@/server/auth/session";

export default async function SuperAdminSystemHealthPage() {
  await requireSuperAdmin();
  await prisma.$queryRaw`SELECT 1`;
  const env = serverEnv();
  const [queuedEmailCount, failedWebhookCount] = await Promise.all([
    prisma.emailMessage.count({ where: { status: "QUEUED" } }),
    prisma.webhookEvent.count({ where: { processedAt: null, attempts: { gt: 0 } } })
  ]);
  const storageConfigured = Boolean(
    env.OBJECT_STORAGE_ENDPOINT &&
    env.OBJECT_STORAGE_BUCKET &&
    env.OBJECT_STORAGE_ACCESS_KEY_ID &&
    env.OBJECT_STORAGE_SECRET_ACCESS_KEY &&
    env.OBJECT_STORAGE_PUBLIC_URL
  );
  const checks = [
    { name: "PostgreSQL", ok: true, detail: "Connected · query succeeded" },
    { name: "Authentication secret", ok: Boolean(env.AUTH_SECRET), detail: env.AUTH_SECRET ? "Configured" : "Missing" },
    { name: "Field encryption", ok: Boolean(env.FIELD_ENCRYPTION_KEY), detail: env.FIELD_ENCRYPTION_KEY ? "Configured" : "Missing" },
    { name: "Paystack", ok: Boolean(env.PAYSTACK_SECRET_KEY), detail: env.PAYSTACK_SECRET_KEY ? "Configured" : "Checkout disabled until configured" },
    { name: "Transactional email", ok: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL), detail: env.RESEND_API_KEY && env.RESEND_FROM_EMAIL ? `Configured · ${queuedEmailCount} queued` : `${queuedEmailCount} message(s) queued until configured` },
    { name: "Object storage", ok: storageConfigured, detail: storageConfigured ? "S3/R2-compatible uploads configured" : "Direct media uploads disabled until all storage values are configured" },
    { name: "Webhook processing", ok: failedWebhookCount === 0, detail: failedWebhookCount === 0 ? "No unprocessed failed events" : `${failedWebhookCount} event(s) require inspection` }
  ];
  return <>
    <PortalPageHeading eyebrow="Operations" title="System health" description="A live configuration and database check. Provider dashboards remain the source for external uptime." />
    <div className="mt-7 grid gap-4 md:grid-cols-2">{checks.map((check) => <article key={check.name} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-xl">{check.name}</h2><span className={`h-3 w-3 rounded-full ${check.ok ? "bg-emerald-500" : "bg-red-500"}`} aria-label={check.ok ? "Healthy" : "Attention"} /></div><p className="mt-3 text-sm text-mayera-espresso/55">{check.detail}</p></article>)}</div>
  </>;
}
