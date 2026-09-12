"use client";

import Link from "next/link";
import { ProductImage } from "./product-image";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/types/commerce";
import { useCart } from "@/features/cart/cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const purchasable = product.availability === "available" && product.priceAvailable && product.price > 0;

  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-[2rem] bg-white transition duration-300 group-hover:-translate-y-1 group-hover:shadow-soft"
      >
        {product.badge ? (
          <span className="absolute left-5 top-5 z-10 rounded-full border border-mayera-espresso/10 bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-mayera-espresso backdrop-blur">
            {product.badge}
          </span>
        ) : null}
        <ProductImage product={product} className="aspect-[4/3] w-full" imageClassName="transition duration-500 group-hover:scale-[1.02]" />
      </Link>
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-mayera-olive">{product.size}</p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-2 font-serif text-2xl leading-tight text-mayera-espresso hover:text-mayera-amber">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-6 text-mayera-espresso/62">{product.subtitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="max-w-[9rem] text-sm font-medium text-mayera-espresso">{product.priceAvailable ? formatNaira(product.price) : "Price to be announced"}</p>
          {product.compareAt ? (
            <p className="mt-1 text-xs text-mayera-espresso/45 line-through">{formatNaira(product.compareAt)}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        disabled={!purchasable}
        onClick={() => purchasable && addItem(product)}
        className="mt-5 w-full rounded-full border border-mayera-espresso/20 px-5 py-3 text-sm font-medium text-mayera-espresso transition hover:border-mayera-espresso hover:bg-mayera-espresso hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
      >
        {product.availability === "coming-soon" ? "Coming soon" : product.priceAvailable ? "Add to bag" : "Price to be announced"}
      </button>
    </article>
  );
}
