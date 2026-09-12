import { ProductCard } from "@/components/commerce/product-card";
import type { Product } from "@/types/commerce";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
      {!products.length ? <div className="rounded-[1.5rem] border border-dashed border-mayera-line p-10 text-center md:col-span-2 xl:col-span-4"><p className="font-serif text-3xl">Nothing is published here yet.</p><p className="mt-3 text-sm text-mayera-espresso/55">This category is ready for future Mayéra products.</p></div> : null}
    </div>
  );
}
