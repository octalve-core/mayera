import { UserRole } from "@prisma/client";
import { PortalPageHeading } from "@/components/portal/page-heading";
import { prisma } from "@/lib/prisma";
import { permissionsForRole, type PermissionKey } from "@/server/auth/permissions";
import { requireSuperAdmin } from "@/server/auth/session";

export default async function SuperAdminPermissionsPage() {
  await requireSuperAdmin();
  const [records, customRoles] = await Promise.all([
    prisma.permission.findMany({ orderBy: { key: "asc" } }),
    prisma.adminRole.findMany({ include: { permissions: { include: { permission: true } } }, orderBy: { name: "asc" } })
  ]);
  const roles = Object.values(UserRole).filter((role) => role !== UserRole.CUSTOMER);
  return <>
    <PortalPageHeading eyebrow="Access control" title="Permissions" description="The effective built-in role matrix and custom permission assignments are visible here for security review." />
    <section className="mt-7 overflow-x-auto rounded-[1.5rem] border border-mayera-line bg-mayera-paper"><table className="w-full min-w-[1100px] text-left text-xs"><thead className="border-b border-mayera-line bg-mayera-cream/60"><tr><th className="px-4 py-4">Permission</th>{roles.map((role) => <th key={role} className="px-3 py-4 font-mono text-[10px]">{role}</th>)}</tr></thead><tbody>{records.map((permission) => <tr key={permission.id} className="border-b border-mayera-line last:border-0"><td className="px-4 py-3 font-mono">{permission.key}</td>{roles.map((role) => { const allowed = permissionsForRole(role).includes(permission.key as PermissionKey); return <td key={role} className="px-3 py-3 text-center"><span className={allowed ? "text-emerald-700" : "text-mayera-espresso/20"} aria-label={allowed ? "Allowed" : "Not allowed"}>{allowed ? "●" : "—"}</span></td>; })}</tr>)}</tbody></table></section>
    {customRoles.length ? <section className="mt-8"><h2 className="font-serif text-2xl">Custom assignments</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{customRoles.map((role) => <article key={role.id} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5"><p className="font-medium">{role.name} <span className="font-mono text-xs text-mayera-espresso/45">{role.key}</span></p><p className="mt-3 text-xs leading-6 text-mayera-espresso/60">{role.permissions.map((entry) => entry.permission.key).join(" · ") || "No permissions assigned"}</p></article>)}</div></section> : null}
  </>;
}
