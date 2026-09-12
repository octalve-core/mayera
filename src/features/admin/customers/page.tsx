import { PortalPageHeading } from "@/components/portal/page-heading";
import { formatKobo } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { permissions } from "@/server/auth/permissions";
import { requirePagePermission, sessionHasPermission } from "@/server/auth/session";
import { updateCustomerRecord } from "../actions";

export default async function AdminCustomersPage() {
  const session = await requirePagePermission(permissions.customersRead);
  const canEdit = sessionHasPermission(session, permissions.customersWrite);
  const customers = await prisma.user.findMany({ where: { role: "CUSTOMER" }, include: { customer: true, _count: { select: { orders: true, supportTickets: true } } }, orderBy: { createdAt: "desc" }, take: 500 });
  return <>
    <PortalPageHeading eyebrow="CRM" title="Customers" description="Only data needed for commerce, support, consent and the legitimate customer relationship is shown." />
    <div className="mt-7 grid gap-4">{customers.map((customer) => <article key={customer.id} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5"><div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center"><div><p className="font-medium">{[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Customer"}</p><p className="mt-1 text-xs text-mayera-espresso/45">{customer.email}</p></div><span className="rounded-full bg-mayera-cream px-3 py-1 text-xs">{customer.status}</span><Metric label="Orders" value={String(customer._count.orders)} /><Metric label="Support" value={String(customer._count.supportTickets)} /><Metric label="Lifetime" value={formatKobo(customer.customer?.totalSpentKobo ?? 0)} /></div>{customer.customer?.tags.length ? <p className="mt-4 text-xs text-mayera-olive">{customer.customer.tags.join(" · ")}</p> : null}{canEdit ? <details className="mt-4 border-t border-mayera-line pt-4"><summary className="cursor-pointer text-xs underline underline-offset-4">Customer notes and tags</summary><form action={updateCustomerRecord} className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto]"><input type="hidden" name="userId" value={customer.id} /><label className="text-[10px] uppercase tracking-[.1em]">Internal notes<textarea name="notes" rows={3} maxLength={5000} defaultValue={customer.customer?.notes ?? ""} className="mt-2 w-full rounded-xl border border-mayera-line bg-white p-3 text-sm normal-case" /></label><label className="text-[10px] uppercase tracking-[.1em]">Tags, comma-separated<input name="tags" maxLength={1000} defaultValue={customer.customer?.tags.join(", ") ?? ""} className="mt-2 h-11 w-full rounded-xl border border-mayera-line bg-white px-3 text-sm normal-case" /></label><button className="self-end rounded-full bg-mayera-espresso px-5 py-3 text-xs text-white">Save record</button></form></details> : null}</article>)}{!customers.length ? <p className="rounded-[1.5rem] border border-dashed border-mayera-line p-10 text-center text-sm text-mayera-espresso/50">No registered customers yet.</p> : null}</div>
  </>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] uppercase tracking-[.12em] text-mayera-espresso/42">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>;
}
