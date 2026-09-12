import { PortalShell } from "@/components/portal/portal-shell";
import { accountNav } from "@/features/account/components/nav";
import { requireCustomer } from "@/server/auth/session";
export default async function Layout({ children }: { children: React.ReactNode }) { const session=await requireCustomer(); const name=[session.user.firstName,session.user.lastName].filter(Boolean).join(" ")||session.user.email; return <PortalShell title="My Mayéra" kicker="Customer account" nav={accountNav} mobileNavigation="customer" footerLabel="Signed in" userName={name} roleLabel={session.user.role}>{children}</PortalShell>; }
