"use client";

import { useState } from "react";
import type { Product } from "@/types/commerce";
import { useCart } from "@/features/cart/cart-provider";

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const purchasable = product.availability === "available" && product.priceAvailable && product.price > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {purchasable ? (
        <div className="flex h-12 items-center justify-between rounded-full border border-mayera-espresso/20 px-4 sm:w-[132px]">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="h-8 w-8 text-xl text-mayera-espresso/70">−</button>
          <span className="text-sm font-medium">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} aria-label="Increase quantity" className="h-8 w-8 text-xl text-mayera-espresso/70">+</button>
        </div>
      ) : null}
      <button
        type="button"
        disabled={!purchasable}
        onClick={() => addItem(product, quantity)}
        className="min-h-12 flex-1 rounded-full bg-mayera-espresso px-7 text-sm font-medium text-white transition hover:bg-[#342c27] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {product.availability === "coming-soon" ? "Coming soon" : product.priceAvailable ? "Add to bag" : "Price to be announced"}
      </button>
    </div>
  );
}
