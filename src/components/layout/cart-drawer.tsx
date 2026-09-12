"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { ProductImage } from "@/components/commerce/product-image";
import { formatNaira } from "@/lib/money";
import { useCart } from "@/features/cart/cart-provider";

export function CartDrawer() {
  const { lines, isOpen, closeCart, subtotal, updateQuantity, removeItem } =
    useCart();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeCart, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        className="absolute inset-0 bg-mayera-espresso/35 backdrop-blur-[2px]"
        onClick={closeCart}
        aria-label="Close cart overlay"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="absolute inset-y-0 right-0 flex w-full max-w-[470px] flex-col bg-mayera-paper shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-mayera-line px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-luxury text-mayera-olive">
              Your bag
            </p>
            <h2 className="mt-1 font-serif text-3xl text-mayera-espresso">
              A simpler ritual.
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-mayera-cream"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {lines.length === 0 ? (
            <div className="grid min-h-[420px] place-items-center text-center">
              <div>
                <p className="font-serif text-3xl text-mayera-espresso">
                  Your bag is quiet.
                </p>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-mayera-espresso/60">
                  Begin with Mayéra&apos;s founding hair wellness collection.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-6 inline-flex rounded-full bg-mayera-espresso px-6 py-3 text-sm font-medium text-white"
                >
                  Shop hair
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {lines.map((line) => (
                <div
                  key={line.product.id}
                  className="grid grid-cols-[88px_1fr] gap-4 border-b border-mayera-line pb-6"
                >
                  <ProductImage
                    product={line.product}
                    className="h-[88px] rounded-2xl"
                    sizes="88px"
                  />
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-mayera-espresso">
                          {line.product.shortName}
                        </p>
                        <p className="mt-1 text-xs text-mayera-espresso/50">
                          {line.product.size}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatNaira(line.product.price * line.quantity)}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-mayera-line px-3 py-1.5">
                        <button
                          onClick={() =>
                            updateQuantity(line.product.id, line.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-xs font-medium">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(line.product.id, line.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(line.product.id)}
                        className="text-xs text-mayera-espresso/45 underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 ? (
          <div className="border-t border-mayera-line bg-white/55 px-6 py-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-mayera-espresso/60">Subtotal</span>
              <span className="text-lg font-medium text-mayera-espresso">
                {formatNaira(subtotal)}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-mayera-espresso/48">
              Delivery is calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-mayera-espresso px-6 text-sm font-medium text-white"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="mt-3 block text-center text-xs text-mayera-espresso/60 underline underline-offset-4"
            >
              View full bag
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
