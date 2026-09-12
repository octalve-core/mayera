"use client";

import Link from "next/link";
import { ProductImage } from "@/components/commerce/product-image";
import { formatNaira } from "@/lib/money";
import { useCart } from "../cart-provider";

export function CartLines() {
  const { lines, updateQuantity, removeItem } = useCart();

  if (!lines.length) {
    return (
      <div className="rounded-[2rem] border border-mayera-line bg-white/50 px-6 py-16 text-center sm:px-10">
        <p className="font-serif text-4xl">Your bag is quiet.</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-mayera-espresso/60">
          Begin with Mayéra&apos;s deliberately small founding hair-wellness
          collection.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex min-h-12 items-center rounded-full bg-mayera-espresso px-7 text-sm font-medium text-white"
        >
          Shop Mayéra
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-mayera-line border-y border-mayera-line">
      {lines.map((line) => (
        <div
          key={line.product.id}
          className="grid gap-5 py-7 sm:grid-cols-[150px_1fr] sm:items-center"
        >
          <ProductImage
            product={line.product}
            className="h-[165px] rounded-[1.5rem]"
            sizes="150px"
          />
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-mayera-olive">
                {line.product.size}
              </p>
              <Link
                href={`/products/${line.product.slug}`}
                className="mt-2 block font-serif text-2xl hover:text-mayera-amber"
              >
                {line.product.name}
              </Link>
              <p className="mt-2 text-sm text-mayera-espresso/55">
                {line.product.subtitle}
              </p>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-full border border-mayera-line px-3 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(line.product.id, line.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                    className="w-5"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-xs font-semibold">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(line.product.id, line.quantity + 1)
                    }
                    aria-label="Increase quantity"
                    className="w-5"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(line.product.id)}
                  className="text-xs text-mayera-espresso/48 underline underline-offset-4"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="text-lg font-medium">
              {formatNaira(line.product.price * line.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
