import { PortalPageHeading } from "@/components/portal/page-heading";
import { formatKobo } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { isSuperRole, permissions } from "@/server/auth/permissions";
import { requirePagePermission } from "@/server/auth/session";
import { approveProductClaims, createProduct, setProductCategories, updateProduct } from "../actions";

export default async function AdminProductsPage() {
  const session = await requirePagePermission(permissions.productsRead);
  const canApproveClaims = isSuperRole(session.user.role);
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { variants: { take: 1, include: { inventory: true } }, categories: true, images: { take: 1, orderBy: { sortOrder: "asc" } } }, orderBy: { createdAt: "asc" } }),
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
  ]);

  return <>
    <PortalPageHeading eyebrow="Catalogue" title="Products" description="Manage price, SKU, availability, compliance state and inventory without changing the public design." />
    <div className="mt-7 overflow-x-auto rounded-[1.5rem] border border-mayera-line bg-mayera-paper">
      <table className="w-full min-w-[1240px] text-left text-sm">
        <thead className="border-b border-mayera-line bg-mayera-cream/60 text-[10px] uppercase tracking-[.13em] text-mayera-espresso/48"><tr>{["Product", "SKU", "Price", "Stock", "Availability", "Categories", "Claims", "Publish", "Save"].map((heading) => <th key={heading} className="px-5 py-4">{heading}</th>)}</tr></thead>
        <tbody>{products.map((product) => {
          const variant = product.variants[0];
          if (!variant) return null;
          return <tr key={product.id} className="border-b border-mayera-line last:border-0">
            <td className="px-5 py-5"><p className="font-medium">{product.name}</p><p className="mt-1 text-xs text-mayera-espresso/45">/{product.slug}</p></td>
            <td className="px-5 py-5">{variant.sku}</td>
            <td className="px-5 py-5"><form id={`product-${product.id}`} action={updateProduct}><input type="hidden" name="id" value={product.id} /><input aria-label={`${product.name} price in naira`} name="price" type="number" min="0" step="1" defaultValue={variant.priceKobo / 100} className="h-10 w-28 rounded-lg border border-mayera-line bg-white px-3" /></form><p className="mt-1 text-xs text-mayera-espresso/40">{variant.priceKobo > 0 ? formatKobo(variant.priceKobo) : "Not announced"}</p></td>
            <td className="px-5 py-5">{variant.inventory ? variant.inventory.available - variant.inventory.reserved : "—"}</td>
            <td className="px-5 py-5"><select form={`product-${product.id}`} name="availability" defaultValue={product.availability} className="h-10 rounded-lg border border-mayera-line bg-white px-3"><option>AVAILABLE</option><option>COMING_SOON</option><option>HIDDEN</option></select></td>
            <td className="px-5 py-5"><p className="max-w-48 text-xs leading-5 text-mayera-espresso/55">{product.categories.map((category) => category.name).join(" · ") || "Uncategorised"}</p><details className="mt-2"><summary className="cursor-pointer text-xs underline underline-offset-4">Assign</summary><form action={setProductCategories} className="mt-3 grid max-h-48 min-w-56 gap-2 overflow-y-auto rounded-xl border border-mayera-line bg-white p-3"><input type="hidden" name="productId" value={product.id} />{categories.map((category) => <label key={category.id} className="flex gap-2 text-xs"><input type="checkbox" name="categoryIds" value={category.id} defaultChecked={product.categories.some((assigned) => assigned.id === category.id)} />{category.name}</label>)}<button className="mt-2 rounded-full bg-mayera-espresso px-3 py-2 text-xs text-white">Save categories</button></form></details></td>
            <td className="px-5 py-5"><span className="rounded-full bg-mayera-cream px-3 py-1 text-xs">{product.claimStatus}</span>{canApproveClaims && product.claimStatus !== "APPROVED" ? <form action={approveProductClaims} className="mt-3"><input type="hidden" name="id" value={product.id} /><button className="text-xs text-mayera-olive underline underline-offset-4">Approve claims</button></form> : null}</td>
            <td className="px-5 py-5"><select form={`product-${product.id}`} name="status" defaultValue={product.status} className="h-10 rounded-lg border border-mayera-line bg-white px-3"><option>DRAFT</option><option>PENDING_REVIEW</option><option disabled={product.claimStatus !== "APPROVED"}>PUBLISHED</option><option>ARCHIVED</option></select></td>
            <td className="px-5 py-5"><button form={`product-${product.id}`} className="rounded-full bg-mayera-espresso px-4 py-2 text-xs text-white">Save</button></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
    <details className="mt-6 rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-6">
      <summary className="cursor-pointer font-serif text-2xl">Create product draft</summary>
      <form action={createProduct} className="mt-6 grid gap-4 md:grid-cols-2">
        <Field name="name" label="Product name" required /><Field name="slug" label="URL slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><Field name="sku" label="SKU" required /><Field name="label" label="Variant label / size" defaultValue="Standard" required /><Field name="price" label="Price (₦; 0 = not announced)" type="number" min="0" defaultValue="0" required /><label className="text-xs uppercase tracking-[.1em]">Availability<select name="availability" defaultValue="COMING_SOON" className="mt-2 h-11 w-full rounded-xl border border-mayera-line bg-white px-3 text-sm"><option>AVAILABLE</option><option>COMING_SOON</option><option>HIDDEN</option></select></label><Field name="imageUrl" label="Product image / object-storage URL" required /><Field name="stock" label="Initial stock" type="number" min="0" defaultValue="0" required /><Field name="lowStockThreshold" label="Low-stock threshold" type="number" min="0" defaultValue="10" required />
        <label className="md:col-span-2 text-xs uppercase tracking-[.1em]">Description<textarea name="description" required minLength={20} rows={4} className="mt-2 w-full rounded-xl border border-mayera-line bg-white p-3 text-sm normal-case" /></label>
        <fieldset className="md:col-span-2"><legend className="text-xs uppercase tracking-[.1em]">Categories</legend><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category) => <label key={category.id} className="flex gap-2 text-xs"><input type="checkbox" name="categoryIds" value={category.id} />{category.name}</label>)}</div></fieldset>
        <button className="min-h-11 rounded-full bg-mayera-espresso px-6 text-sm text-white md:w-fit">Create draft</button>
      </form>
    </details>
  </>;
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="text-xs uppercase tracking-[.1em]">{label}<input className="mt-2 h-11 w-full rounded-xl border border-mayera-line bg-white px-3 text-sm normal-case" {...props} /></label>;
}
