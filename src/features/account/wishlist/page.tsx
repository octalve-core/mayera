import Link from "next/link";
import { PortalPageHeading } from "@/components/portal/page-heading";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { ProductImage } from "@/components/commerce/product-image";
import { formatNaira } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/server/auth/session";
import { getStoreProducts } from "@/server/catalog/public";

export default async function AccountWishlistPage() {
  const session = await requireCustomer();
  const [saved, catalogue] = await Promise.all([
    prisma.wishlistItem.findMany({ where: { wishlist: { userId: session.user.id } }, orderBy: { createdAt: "desc" } }),
    getStoreProducts()
  ]);
  const byId = new Map(catalogue.map((product) => [product.id, product]));
  const products = saved.flatMap((item) => {
    const product = byId.get(item.productId);
    return product ? [{ item, product }] : [];
  });
  return <>
    <PortalPageHeading eyebrow="Account" title="Wishlist" description="A private shortlist for products you want to revisit." />
    {products.length ? <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{products.map(({ item, product }) => <article key={item.id} className="overflow-hidden rounded-[1.5rem] border border-mayera-line bg-mayera-paper"><ProductImage product={product} className="aspect-[4/3]" /><div className="p-5"><Link href={`/products/${product.slug}`} className="font-serif text-2xl">{product.name}</Link><p className="mt-2 text-sm">{product.priceAvailable ? formatNaira(product.price) : "Price to be announced"}</p><div className="mt-4 flex flex-wrap gap-2"><AddToCartButton product={product} /><WishlistButton productId={product.id} initial /></div></div></article>)}</div> : <div className="mt-7 rounded-[1.5rem] border border-dashed border-mayera-line p-10 text-center"><p className="font-serif text-3xl">Nothing saved yet.</p><Link href="/shop" className="mt-5 inline-flex rounded-full bg-mayera-espresso px-6 py-3 text-sm text-white">Explore products</Link></div>}
  </>;
}
