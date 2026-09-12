import { PortalPageHeading } from "@/components/portal/page-heading";
import { prisma } from "@/lib/prisma";
import { permissions } from "@/server/auth/permissions";
import { requirePagePermission, sessionHasPermission } from "@/server/auth/session";
import { createCategory, updateCategory } from "../actions";

export default async function AdminCategoriesPage() {
  const session = await requirePagePermission(permissions.productsRead);
  const canEdit = sessionHasPermission(session, permissions.productsWrite);
  const categories = await prisma.category.findMany({ include: { parent: true, _count: { select: { products: true, children: true } } }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return <>
    <PortalPageHeading eyebrow="Catalogue architecture" title="Categories" description="A future-ready hierarchy for Hair, Skincare, Body Care, concerns, promotions and the additional product families Mayéra introduces over time." />
    <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{categories.map((category) => {const excluded = descendantIds(category.id, categories);return <article key={category.id} className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-serif text-xl">{category.name}</p><p className="mt-1 text-xs text-mayera-espresso/45">/{category.slug}{category.parent ? ` · under ${category.parent.name}` : " · top level"}</p></div><span className={`rounded-full px-3 py-1 text-xs ${category.active ? "bg-emerald-50 text-emerald-800" : "bg-mayera-cream"}`}>{category.active ? "Active" : "Hidden"}</span></div><p className="mt-4 text-xs text-mayera-espresso/50">{category._count.products} product(s) · {category._count.children} child category(s)</p>{canEdit ? <details className="mt-4 border-t border-mayera-line pt-4"><summary className="cursor-pointer text-xs underline underline-offset-4">Edit category</summary><form action={updateCategory} className="mt-4 grid gap-3"><input type="hidden" name="id" value={category.id} /><Field name="name" label="Name" defaultValue={category.name} required /><label className="text-[10px] uppercase tracking-[.1em]">Parent<select name="parentId" defaultValue={category.parentId ?? ""} className="mt-2 h-10 w-full rounded-lg border border-mayera-line bg-white px-3 text-xs"><option value="">Top level</option>{categories.filter((option) => !excluded.has(option.id)).map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label><Field name="sortOrder" label="Sort order" type="number" min="0" defaultValue={category.sortOrder} required /><label className="flex gap-2 text-xs"><input type="checkbox" name="active" defaultChecked={category.active} />Visible in shop navigation</label><button className="rounded-full bg-mayera-espresso px-4 py-2.5 text-xs text-white">Save category</button></form></details> : null}</article>})}</div>
    {canEdit ? <details className="mt-6 rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-6"><summary className="cursor-pointer font-serif text-2xl">Add a future category</summary><form action={createCategory} className="mt-5 grid gap-4 md:grid-cols-2"><Field name="name" label="Category name" required /><Field name="slug" label="URL slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><label className="text-xs uppercase tracking-[.1em]">Parent<select name="parentId" defaultValue="" className="mt-2 h-11 w-full rounded-xl border border-mayera-line bg-white px-3 text-sm"><option value="">Top level</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><Field name="sortOrder" label="Sort order" type="number" min="0" defaultValue="0" required /><button className="min-h-11 rounded-full bg-mayera-espresso px-6 text-sm text-white md:w-fit">Create category</button></form></details> : null}
  </>;
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="text-[10px] uppercase tracking-[.1em]">{label}<input className="mt-2 h-10 w-full rounded-lg border border-mayera-line bg-white px-3 text-sm normal-case" {...props} /></label>;
}

function descendantIds(categoryId: string, categories: Array<{ id: string; parentId: string | null }>) {
  const result = new Set([categoryId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentId && result.has(category.parentId) && !result.has(category.id)) {
        result.add(category.id);
        changed = true;
      }
    }
  }
  return result;
}
