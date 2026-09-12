import { PortalPageHeading } from "@/components/portal/page-heading";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/server/auth/session";
import { createSupportTicket } from "../actions";

export default async function AccountSupportPage({ sent }: { sent: boolean }) {
  const session = await requireCustomer();
  const tickets = await prisma.supportTicket.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <>
      <PortalPageHeading eyebrow="Account" title="Support" description="Send Mayéra a private support request and follow its status from your account." />
      {sent ? <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Your request has been received.</p> : null}
      <div className="mt-7 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <form action={createSupportTicket} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-6">
          <h2 className="font-serif text-2xl">Create a request</h2>
          <label className="mt-5 block text-xs uppercase tracking-[.1em]">Subject<input name="subject" minLength={3} maxLength={160} required className="mt-2 h-11 w-full rounded-xl border border-mayera-line bg-white px-3 text-sm normal-case" /></label>
          <label className="mt-4 block text-xs uppercase tracking-[.1em]">How can we help?<textarea name="message" minLength={10} maxLength={5000} required rows={7} className="mt-2 w-full rounded-xl border border-mayera-line bg-white p-3 text-sm normal-case" /></label>
          <button className="mt-4 min-h-11 rounded-full bg-mayera-espresso px-6 text-sm text-white">Send securely</button>
        </form>
        <section>
          <h2 className="font-serif text-2xl">Your requests</h2>
          <div className="mt-4 space-y-4">
            {tickets.map((ticket) => <article key={ticket.id} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{ticket.subject}</p><p className="mt-1 font-mono text-xs text-mayera-espresso/45">{ticket.number}</p></div><span className="rounded-full bg-mayera-cream px-3 py-1 text-xs">{ticket.status.replaceAll("_", " ")}</span></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-mayera-espresso/60">{ticket.message}</p><time className="mt-3 block text-xs text-mayera-espresso/40">{new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(ticket.createdAt)}</time></article>)}
            {!tickets.length ? <p className="rounded-[1.5rem] border border-dashed border-mayera-line p-8 text-center text-sm text-mayera-espresso/50">You have no support requests.</p> : null}
          </div>
        </section>
      </div>
    </>
  );
}
