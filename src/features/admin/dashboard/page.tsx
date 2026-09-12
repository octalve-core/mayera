import Link from "next/link";
import { PortalPageHeading } from "@/components/portal/page-heading";
import { StatCard } from "@/components/portal/stat-card";
import { formatKobo } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { permissions } from "@/server/auth/permissions";
import { requirePagePermission } from "@/server/auth/session";

export default async function AdminDashboardPage() {
  await requirePagePermission(permissions.dashboardView);
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);
  const [revenue, orders, allInventory, recent] = await Promise.all([
    prisma.payment.aggregate({ where: { status: "SUCCESS", paidAt: { gte: since } }, _sum: { amountKobo: true } }),
    prisma.order.count({ where: { createdAt: { gte: since } } }),
    prisma.inventory.findMany(),
    prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" } })
  ]);
  const low = allInventory.filter((item) => item.available - item.reserved <= item.lowStockThreshold).length;
  const revenueKobo = revenue._sum.amountKobo ?? 0;
  return <>
    <PortalPageHeading eyebrow="Mayéra Admin" title="Commerce overview" description="Live values from orders, verified payments and inventory." />
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Verified revenue · 30 days" value={formatKobo(revenueKobo)} detail="Paystack-confirmed payments" />
      <StatCard label="Orders · 30 days" value={String(orders)} detail="All checkout states" />
      <StatCard label="Average verified order" value={orders ? formatKobo(Math.round(revenueKobo / orders)) : formatKobo(0)} detail="Revenue divided by orders" />
      <StatCard label="Low stock" value={String(low).padStart(2, "0")} detail="At or below threshold" />
    </div>
    <section className="mt-8 rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-6">
      <div className="flex items-center justify-between"><h2 className="font-serif text-2xl">Recent orders</h2><Link href="/admin/orders" className="text-xs underline underline-offset-4">View all</Link></div>
      {recent.length ? <div className="mt-5 divide-y divide-mayera-line">{recent.map((order) => <div key={order.id} className="grid grid-cols-[1fr_auto] gap-4 py-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center"><p className="text-sm font-medium">{order.number}</p><p className="hidden text-sm text-mayera-espresso/52 sm:block">{order.shippingName}</p><span className="hidden rounded-full bg-mayera-cream px-3 py-1 text-xs sm:inline-block">{order.status}</span><p className="text-sm font-medium">{formatKobo(order.totalKobo)}</p></div>)}</div> : <p className="mt-6 text-sm text-mayera-espresso/50">No orders yet.</p>}
    </section>
  </>;
}
