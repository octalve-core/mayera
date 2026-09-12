"use client";

import { ProductImage } from "@/components/commerce/product-image";
import { formatNaira } from "@/lib/money";
import { useCart } from "@/features/cart/cart-provider";

export function CheckoutOrderSummary({
  standardDeliveryKobo,
}: {
  standardDeliveryKobo: number;
}) {
  const { lines, subtotal } = useCart();
  const shipping = standardDeliveryKobo / 100;
  return (
    <aside className="rounded-[2rem] bg-mayera-cream p-6 lg:sticky lg:top-8 lg:p-7">
      <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
        Your order
      </p>
      <div className="mt-6 space-y-5">
        {lines.map((line) => (
          <div
            key={line.product.id}
            className="grid grid-cols-[66px_1fr_auto] items-center gap-3"
          >
            <ProductImage
              product={line.product}
              className="h-[66px] rounded-xl"
              sizes="66px"
            />
            <div>
              <p className="text-sm font-medium">{line.product.shortName}</p>
              <p className="mt-1 text-[11px] text-mayera-espresso/45">
                Qty {line.quantity} · {line.product.size}
              </p>
            </div>
            <p className="text-xs font-medium">
              {formatNaira(line.product.price * line.quantity)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3 border-t border-mayera-line pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-mayera-espresso/55">Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mayera-espresso/55">Standard delivery</span>
          <span>{formatNaira(shipping)}</span>
        </div>
        <div className="flex justify-between border-t border-mayera-line pt-4 text-base font-semibold">
          <span>Estimated total</span>
          <span>{formatNaira(subtotal + shipping)}</span>
        </div>
      </div>
      <p className="mt-5 text-[11px] leading-5 text-mayera-espresso/45">
        Prices, availability, discounts and delivery are revalidated before
        payment.
      </p>
    </aside>
  );
}
