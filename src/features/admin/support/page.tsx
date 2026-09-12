import { PortalPageHeading } from "@/components/portal/page-heading";
import { prisma } from "@/lib/prisma";
import { permissions } from "@/server/auth/permissions";
import { requirePagePermission, sessionHasPermission } from "@/server/auth/session";
import { updateContactMessage, updateSupportTicket } from "../actions";

const ticketStatuses = ["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER", "RESOLVED", "CLOSED"] as const;

export default async function AdminSupportPage() {
  const session = await requirePagePermission(permissions.customersRead);
  const canEdit = sessionHasPermission(session, permissions.customersWrite);
  const [tickets, messages] = await Promise.all([
    prisma.supportTicket.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.contactMessage.findMany({ orderBy: [{ resolved: "asc" }, { createdAt: "desc" }], take: 200 })
  ]);
  return <>
    <PortalPageHeading eyebrow="Customer care" title="Support" description="Account tickets and public contact enquiries are kept together for an authorised support team." />
    <section className="mt-7"><h2 className="font-serif text-2xl">Account tickets</h2><div className="mt-4 space-y-4">{tickets.map((ticket) => <article key={ticket.id} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5"><div className="grid gap-4 md:grid-cols-[1fr_auto]"><div><p className="font-medium">{ticket.subject}</p><p className="mt-1 font-mono text-xs text-mayera-espresso/45">{ticket.number} · {ticket.email}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-mayera-espresso/65">{ticket.message}</p></div>{canEdit ? <form action={updateSupportTicket}><input type="hidden" name="id" value={ticket.id} /><select name="status" defaultValue={ticket.status} className="h-10 rounded-lg border border-mayera-line bg-white px-3 text-xs">{ticketStatuses.map((status) => <option key={status}>{status}</option>)}</select><button className="ml-2 rounded-full bg-mayera-espresso px-4 py-2 text-xs text-white">Save</button></form> : <span className="text-xs">{ticket.status}</span>}</div></article>)}{!tickets.length ? <p className="rounded-[1.5rem] border border-dashed border-mayera-line p-8 text-center text-sm text-mayera-espresso/50">No account tickets.</p> : null}</div></section>
    <section className="mt-10"><h2 className="font-serif text-2xl">Contact enquiries</h2><div className="mt-4 grid gap-4 lg:grid-cols-2">{messages.map((message) => <article key={message.id} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{message.subject || "General enquiry"}</p><p className="mt-1 text-xs text-mayera-espresso/45">{message.name} · {message.email}</p></div><span className="rounded-full bg-mayera-cream px-3 py-1 text-xs">{message.resolved ? "Resolved" : "Open"}</span></div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-mayera-espresso/65">{message.message}</p>{canEdit ? <form action={updateContactMessage} className="mt-4"><input type="hidden" name="id" value={message.id} /><button className="text-xs underline underline-offset-4">{message.resolved ? "Reopen" : "Mark resolved"}</button></form> : null}</article>)}{!messages.length ? <p className="rounded-[1.5rem] border border-dashed border-mayera-line p-8 text-center text-sm text-mayera-espresso/50 lg:col-span-2">No contact enquiries.</p> : null}</div></section>
  </>;
}
