"use client";

import Link from "next/link";
import { formatNaira } from "@/lib/money";
import { useCart } from "../cart-provider";

export function CartSummary() {
  const { lines, subtotal } = useCart();
  if (!lines.length) return null;

  const freeDeliveryTarget = 25000;
  const remaining = Math.max(0, freeDeliveryTarget - subtotal);
  const progress = Math.min(
    100,
    Math.round((subtotal / freeDeliveryTarget) * 100),
  );

  return (
    <aside className="rounded-[2rem] border border-mayera-line bg-mayera-cream p-6 lg:sticky lg:top-32 lg:p-7">
      <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
        Order summary
      </p>
      <div className="mt-6 space-y-4 border-b border-mayera-line pb-5 text-sm">
        <div className="flex justify-between">
          <span className="text-mayera-espresso/58">Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mayera-espresso/58">Delivery</span>
          <span className="text-mayera-espresso/50">At checkout</span>
        </div>
      </div>
      <div className="mt-5 flex justify-between text-base font-medium">
        <span>Estimated total</span>
        <span>{formatNaira(subtotal)}</span>
      </div>

      <div className="mt-7 rounded-2xl bg-white/60 p-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-mayera-sand">
          <div
            className="h-full rounded-full bg-mayera-olive"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs leading-5 text-mayera-espresso/58">
          {remaining > 0
            ? `${formatNaira(remaining)} away from the planned free-delivery threshold.`
            : "You reached the planned free-delivery threshold."}
        </p>
      </div>

      <Link
        href="/checkout"
        className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-mayera-espresso px-6 text-sm font-medium text-white hover:bg-mayera-amber"
      >
        Continue to checkout
      </Link>
      <Link
        href="/shop"
        className="mt-3 block text-center text-xs text-mayera-espresso/56 underline underline-offset-4"
      >
        Continue shopping
      </Link>
    </aside>
  );
}
