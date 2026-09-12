import { PortalShell } from "@/components/portal/portal-shell";
import { superAdminNav } from "@/features/super-admin/components/nav";
import { requireSuperAdmin } from "@/server/auth/session";
export default async function Layout({ children }: { children: React.ReactNode }) { const session=await requireSuperAdmin(); const name=[session.user.firstName,session.user.lastName].filter(Boolean).join(" ")||session.user.email; return <PortalShell title="Mayéra Control" kicker="Super admin" nav={superAdminNav} accent="amber" footerLabel="Octalve/system layer · MFA" userName={name} roleLabel={session.user.role}>{children}</PortalShell>; }
