import { PortalShell } from "@/components/portal/portal-shell";
import { adminNav } from "@/features/admin/components/nav";
import { requireAdmin, sessionHasPermission } from "@/server/auth/session";
import type { PermissionKey } from "@/server/auth/permissions";
export default async function Layout({ children }: { children: React.ReactNode }) { const session=await requireAdmin(); const name=[session.user.firstName,session.user.lastName].filter(Boolean).join(" ")||session.user.email; const nav=adminNav.filter(item=>sessionHasPermission(session,item.permission as PermissionKey)); return <PortalShell title="Mayéra Admin" kicker="Client admin" nav={nav} accent="espresso" footerLabel="MFA-protected" userName={name} roleLabel={session.user.role}>{children}</PortalShell>; }
