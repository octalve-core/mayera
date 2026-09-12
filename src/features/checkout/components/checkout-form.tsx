"use client";

import { FormEvent, useRef, useState } from "react";
import { useCart } from "@/features/cart/cart-provider";
import { formatNaira } from "@/lib/money";

const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export function CheckoutForm({
  standardDeliveryKobo,
  checkoutUnavailableReason,
}: {
  standardDeliveryKobo: number;
  checkoutUnavailableReason?: string;
}) {
  const { lines, subtotal } = useCart();
  const idempotencyKey = useRef(crypto.randomUUID());
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const estimatedTotal = subtotal + standardDeliveryKobo / 100;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length) return;
    setStatus("loading");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: idempotencyKey.current,
          email: form.get("email"),
          phone: form.get("phone"),
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          address: form.get("address"),
          landmark: form.get("landmark") || undefined,
          city: form.get("city"),
          state: form.get("state"),
          couponCode: form.get("couponCode") || undefined,
          note: form.get("note") || undefined,
          lines: lines.map((line) => ({
            sku: line.product.sku,
            quantity: line.quantity,
          })),
        }),
      });
      const result = (await response.json()) as {
        authorizationUrl?: string;
        message?: string;
      };
      if (!response.ok || !result.authorizationUrl)
        throw new Error(
          result.message ?? "Could not initialize secure payment.",
        );
      window.location.assign(result.authorizationUrl);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not initialize secure payment.",
      );
      setStatus("error");
      idempotencyKey.current = crypto.randomUUID();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-10" noValidate>
      <Block title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
          />
          <Field
            name="phone"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            required
          />
        </div>
      </Block>
      <Block title="Delivery address">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="firstName"
            label="First name"
            autoComplete="given-name"
            required
          />
          <Field
            name="lastName"
            label="Last name"
            autoComplete="family-name"
            required
          />
        </div>
        <Field
          name="address"
          label="Street address"
          autoComplete="address-line1"
          required
        />
        <Field
          name="landmark"
          label="Landmark / additional details"
          autoComplete="address-line2"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="city"
            label="City / town"
            autoComplete="address-level2"
            required
          />
          <label className="block">
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-mayera-espresso/55">
              State
            </span>
            <select
              name="state"
              required
              autoComplete="address-level1"
              defaultValue=""
              className="h-12 w-full rounded-full border border-mayera-line bg-white/70 px-4 text-sm outline-none focus:border-mayera-olive"
            >
              <option value="" disabled>
                Select state
              </option>
              {nigeriaStates.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="rounded-2xl border border-mayera-line bg-mayera-cream/45 px-4 py-3 text-xs text-mayera-espresso/58">
          Country: Nigeria · The launch checkout currently serves Nigerian
          delivery addresses.
        </div>
      </Block>
      <Block title="Order notes & discount">
        <Field
          name="couponCode"
          label="Discount code (optional)"
          autoComplete="off"
        />
        <label className="block">
          <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-mayera-espresso/55">
            Delivery note (optional)
          </span>
          <textarea
            name="note"
            maxLength={500}
            rows={3}
            className="w-full rounded-2xl border border-mayera-line bg-white/70 px-4 py-3 text-sm outline-none focus:border-mayera-olive"
          />
        </label>
      </Block>
      <Block title="Payment">
        <div className="rounded-[1.5rem] border border-mayera-olive/40 bg-mayera-cream p-5">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 grid h-5 w-5 place-items-center rounded-full border border-mayera-olive"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-mayera-olive" />
            </span>
            <div>
              <p className="text-sm font-medium">Paystack secure checkout</p>
              <p className="mt-1 text-xs leading-5 text-mayera-espresso/52">
                Pay with Card, Transfer, USSD, Bank Account or Bank Transfer.
                Paystack is a secure and trusted payment processor in Nigeria.
              </p>
            </div>
          </div>
        </div>
      </Block>
      {checkoutUnavailableReason ? (
        <p
          role="status"
          className="rounded-xl border border-mayera-amber/35 bg-mayera-cream px-4 py-3 text-sm leading-6 text-mayera-espresso/70"
        >
          {checkoutUnavailableReason}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={
          !lines.length ||
          status === "loading" ||
          Boolean(checkoutUnavailableReason)
        }
        className="min-h-14 w-full rounded-full bg-mayera-espresso px-7 text-sm font-semibold text-white transition hover:bg-mayera-amber disabled:cursor-not-allowed disabled:opacity-45"
      >
        {status === "loading"
          ? "Preparing secure checkout…"
          : `Continue to pay · ${formatNaira(estimatedTotal)}`}
      </button>
      <p className="text-center text-xs leading-5 text-mayera-espresso/48">
        Displayed total uses the standard delivery rate. Any valid discount or
        configured state rate is applied server-side and shown by Paystack
        before payment.
      </p>
      {!lines.length ? (
        <p className="text-sm text-mayera-espresso/55">
          Your bag is empty. Return to the shop before checking out.
        </p>
      ) : null}
    </form>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}
function Field({
  name,
  label,
  ...props
}: {
  name: string;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-mayera-espresso/55">
        {label}
      </span>
      <input
        name={name}
        className="h-12 w-full rounded-full border border-mayera-line bg-white/70 px-4 text-sm outline-none focus:border-mayera-olive"
        {...props}
      />
    </label>
  );
}
