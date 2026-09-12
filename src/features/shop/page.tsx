import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ShopHero } from "./components/hero";
import { ProductGrid } from "./components/product-grid";
import { getStoreCategories, getStoreProducts } from "@/server/catalog/public";

export default async function ShopPage({ category }: { category?: string }) {
  const [products, categories] = await Promise.all([getStoreProducts(category), getStoreCategories()]);
  const selected = categories.find((entry) => entry.slug === category);
  return <>
    <ShopHero />
    <section className="border-b border-mayera-line bg-mayera-paper py-8"><Container><div className="flex items-center justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Shop by category</p><p className="mt-2 text-sm text-mayera-espresso/55">Built to grow with every future Mayéra range.</p></div>{selected ? <Link href="/shop" className="shrink-0 text-xs underline underline-offset-4">Clear filter</Link> : null}</div><nav aria-label="Product categories" className="mt-6 flex flex-wrap gap-2"><Link href="/shop" className={`rounded-full border px-4 py-2 text-xs transition ${!selected ? "border-mayera-espresso bg-mayera-espresso text-white" : "border-mayera-line hover:border-mayera-espresso"}`}>All products</Link>{categories.map((entry) => <Link key={entry.slug} href={`/shop?category=${encodeURIComponent(entry.slug)}`} className={`rounded-full border px-4 py-2 text-xs transition ${selected?.slug === entry.slug ? "border-mayera-olive bg-mayera-olive text-white" : entry.parentSlug ? "border-mayera-line text-mayera-espresso/60 hover:border-mayera-olive" : "border-mayera-espresso/25 font-medium hover:border-mayera-espresso"}`}>{entry.name}</Link>)}</nav></Container></section>
    <Section className="bg-mayera-paper"><Container><div className="mb-10 flex items-center justify-between border-b border-mayera-line pb-5"><p className="text-sm text-mayera-espresso/58">{products.length} {selected ? selected.name : "Mayéra"} product{products.length === 1 ? "" : "s"}</p><p className="text-xs uppercase tracking-[0.15em] text-mayera-olive">Nigeria · NGN</p></div><ProductGrid products={products} /></Container></Section>
  </>;
}
