import { OrderStatus } from "@prisma/client";
import { PortalPageHeading } from "@/components/portal/page-heading";
import { formatKobo } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { permissions } from "@/server/auth/permissions";
import { requirePagePermission, sessionHasPermission } from "@/server/auth/session";
import { requestOrderRefund, updateOrderStatus } from "../actions";

const next: Partial<Record<OrderStatus, OrderStatus>> = {
  PAID: OrderStatus.PROCESSING,
  PROCESSING: OrderStatus.PACKED,
  PACKED: OrderStatus.SHIPPED,
  SHIPPED: OrderStatus.DELIVERED,
  DELIVERED: OrderStatus.RETURNED
};

export default async function AdminOrdersPage() {
  const session = await requirePagePermission(permissions.ordersRead);
  const canRefund = sessionHasPermission(session, permissions.refundsWrite);
  const orders = await prisma.order.findMany({
    include: { payments: true, items: true, shipments: true, refunds: true },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  return <>
    <PortalPageHeading eyebrow="Operations" title="Orders" description="Payment, fulfilment and refund states are independent, explicit and auditable." />
    <div className="mt-7 space-y-4">
      {orders.map((order) => {
        const nextStatus = next[order.status];
        const payment = order.payments.find((entry) => entry.status === "SUCCESS");
        const committedRefunds = order.refunds.filter((entry) => entry.status !== "FAILED").reduce((sum, entry) => sum + entry.amountKobo, 0);
        const refundableKobo = payment ? Math.max(0, payment.amountKobo - committedRefunds) : 0;
        return <article key={order.id} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto]">
            <div><p className="font-medium">{order.number}</p><p className="mt-1 text-xs text-mayera-espresso/45">{order.shippingName} · {order.shippingState} · {order.items.length} line{order.items.length === 1 ? "" : "s"}</p></div>
            <span className="h-fit rounded-full bg-mayera-cream px-3 py-1 text-xs">{order.status}</span>
            <span className={`text-sm ${payment ? "text-mayera-olive" : "text-mayera-amber"}`}>{order.payments[0]?.status ?? "NO PAYMENT"}</span>
            <p className="font-medium">{formatKobo(order.totalKobo)}</p>
          </div>
          {order.refunds.length ? <div className="mt-4 flex flex-wrap gap-2 border-t border-mayera-line pt-4">{order.refunds.map((refund) => <span key={refund.id} className="rounded-full bg-mayera-cream px-3 py-1 text-xs">Refund {formatKobo(refund.amountKobo)} · {refund.status}</span>)}</div> : null}
          {nextStatus ? <form action={updateOrderStatus} className="mt-4 grid gap-3 border-t border-mayera-line pt-4 sm:grid-cols-[auto_1fr_1fr_auto]"><input type="hidden" name="id" value={order.id} /><input type="hidden" name="status" value={nextStatus} /><span className="self-center text-xs">Next: {nextStatus}</span><input name="note" placeholder="Status note" className="h-10 rounded-lg border border-mayera-line px-3 text-sm" />{nextStatus === OrderStatus.SHIPPED ? <input name="trackingCode" required placeholder="Tracking code" className="h-10 rounded-lg border border-mayera-line px-3 text-sm" /> : <span />}<button className="rounded-full bg-mayera-espresso px-4 py-2 text-xs text-white">Advance status</button></form> : null}
          {canRefund && refundableKobo > 0 ? <details className="mt-4 border-t border-mayera-line pt-4"><summary className="cursor-pointer text-xs text-red-800 underline underline-offset-4">Issue a controlled refund</summary><form action={requestOrderRefund} className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr_auto]"><input type="hidden" name="orderId" value={order.id} /><label className="text-[10px] uppercase tracking-[.1em]">Amount (₦)<input name="amount" type="number" min="0.01" max={refundableKobo / 100} step="0.01" defaultValue={refundableKobo / 100} required className="mt-2 h-10 w-full rounded-lg border border-mayera-line bg-white px-3 text-sm normal-case" /></label><label className="text-[10px] uppercase tracking-[.1em]">Reason<input name="reason" minLength={5} maxLength={500} required className="mt-2 h-10 w-full rounded-lg border border-mayera-line bg-white px-3 text-sm normal-case" /></label><button className="self-end rounded-full bg-red-800 px-4 py-2.5 text-xs text-white">Submit to Paystack</button></form></details> : null}
        </article>;
      })}
      {!orders.length ? <p className="rounded-[1.5rem] border border-dashed border-mayera-line p-10 text-center text-sm text-mayera-espresso/50">No orders yet.</p> : null}
    </div>
  </>;
}
