import { serverEnv } from "@/lib/env";
import { CheckoutForm } from "./components/checkout-form";
import { CheckoutOrderSummary } from "./components/order-summary";

export default function CheckoutPage() {
  const env = serverEnv();
  const checkoutUnavailableReason = !env.DATABASE_URL
    ? "Checkout preview is visible, but orders cannot be accepted until the production database is connected."
    : !env.PAYSTACK_SECRET_KEY
      ? "Checkout preview is visible, but payment is disabled until the Paystack server key is configured."
      : undefined;

  return (
    <main className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-16 lg:px-8 lg:py-14">
      <div>
        <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
          Checkout
        </p>
        <h1 className="mt-4 font-serif text-4xl tracking-[-0.035em] sm:text-5xl">
          Almost yours.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-mayera-espresso/58">
          Only the information needed to verify payment and deliver your order.
        </p>
        <div className="mt-9">
          <CheckoutForm
            standardDeliveryKobo={env.MAYERA_STANDARD_DELIVERY_KOBO}
            checkoutUnavailableReason={checkoutUnavailableReason}
          />
        </div>
      </div>
      <CheckoutOrderSummary
        standardDeliveryKobo={env.MAYERA_STANDARD_DELIVERY_KOBO}
      />
    </main>
  );
}
