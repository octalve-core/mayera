import { ProductImage } from "@/components/commerce/product-image";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/types/commerce";
import { CheckIcon } from "@/components/ui/icons";
import { WishlistButton } from "@/components/commerce/wishlist-button";

export function ProductMain({ product }: { product: Product }) {
  return (
    <section className="bg-mayera-paper py-10 lg:py-14">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        <ProductImage product={product} priority className="min-h-[520px] rounded-[2rem] sm:min-h-[700px]" sizes="(min-width: 1024px) 52vw, 100vw" />

        <div className="lg:py-8">
          {product.badge ? <span className="rounded-full bg-mayera-cream px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-mayera-olive">{product.badge}</span> : null}
          <p className="mt-5 text-xs uppercase tracking-luxury text-mayera-olive">Mayéra Hair</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">{product.name}</h1>
          <p className="mt-5 text-sm leading-7 text-mayera-espresso/58">{product.subtitle}</p>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-xl font-semibold">{product.priceAvailable ? formatNaira(product.price) : "Price to be announced"}</span>
            {product.compareAt ? <span className="text-sm text-mayera-espresso/42 line-through">{formatNaira(product.compareAt)}</span> : null}
            <span className="text-xs text-mayera-espresso/45">{product.size}</span>
          </div>
          <p className="mt-7 text-base leading-8 text-mayera-espresso/68">{product.description}</p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm text-mayera-espresso/70"><span className="grid h-7 w-7 place-items-center rounded-full bg-mayera-cream text-mayera-olive"><CheckIcon className="h-4 w-4" /></span>{benefit}</li>
            ))}
          </ul>
          <div className="mt-8"><AddToCartButton product={product} /><div className="mt-3"><WishlistButton productId={product.id}/></div></div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-mayera-line border-y border-mayera-line py-4 text-center text-[10px] uppercase tracking-[0.11em] text-mayera-espresso/54">
            <span>Nationwide delivery</span><span>Secure checkout</span><span>Nigeria-first care</span>
          </div>
        </div>
      </div>
    </section>
  );
}
