"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { useCart } from "@/features/cart/cart-provider";

type State = "checking" | "paid" | "failed";
export function CheckoutSuccessClient({ reference }: { reference?: string }) {
  const [state, setState] = useState<State>(reference ? "checking" : "failed");
  const [orderNumber, setOrderNumber] = useState("");
  const { clearCart } = useCart();
  useEffect(() => {
    if (!reference) return;
    let active = true;
    fetch(
      `/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`,
      { cache: "no-store" },
    )
      .then(async (response) => {
        const data = (await response.json()) as {
          paid?: boolean;
          orderNumber?: string;
        };
        if (!active) return;
        if (response.ok && data.paid) {
          setOrderNumber(data.orderNumber ?? "");
          setState("paid");
          clearCart();
        } else setState("failed");
      })
      .catch(() => active && setState("failed"));
    return () => {
      active = false;
    };
  }, [reference, clearCart]);
  return (
    <main className="mx-auto grid min-h-[calc(100vh-82px)] max-w-[760px] place-items-center px-5 py-14 text-center sm:px-6">
      <div>
        <div
          className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${state === "failed" ? "bg-red-100 text-red-700" : "bg-mayera-olive text-white"}`}
        >
          {state === "checking" ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
          ) : (
            <CheckIcon className="h-8 w-8" />
          )}
        </div>
        <p className="mt-7 text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
          {state === "checking"
            ? "Confirming payment"
            : state === "paid"
              ? "Order received"
              : "Payment not confirmed"}
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-[-0.04em]">
          {state === "paid"
            ? "Thank you."
            : state === "checking"
              ? "One moment."
              : "Please check again."}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-mayera-espresso/60">
          {state === "paid"
            ? "Your payment has been verified directly with Paystack. Mayéra can now prepare and fulfil your purchase."
            : state === "checking"
              ? "Mayéra is verifying the payment reference with Paystack before confirming the order."
              : "We could not verify this payment. If you were charged, keep the reference below and contact Mayéra support; do not pay twice."}
        </p>
        {orderNumber ? (
          <div className="mx-auto mt-7 max-w-md rounded-2xl bg-mayera-cream p-5 text-left text-sm">
            <span className="text-mayera-espresso/50">Order</span>
            <p className="mt-1 font-medium">{orderNumber}</p>
          </div>
        ) : null}
        <div className="mx-auto mt-4 max-w-md rounded-2xl border border-mayera-line bg-white p-5 text-left text-sm">
          <span className="text-mayera-espresso/50">Payment reference</span>
          <p className="mt-1 break-all font-medium">
            {reference ?? "No reference supplied"}
          </p>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="rounded-full bg-mayera-espresso px-7 py-3 text-sm text-white"
          >
            Continue shopping
          </Link>
          <Link
            href={state === "paid" ? "/account/orders" : "/track-order"}
            className="rounded-full border border-mayera-line px-7 py-3 text-sm"
          >
            {state === "paid" ? "View My Mayéra" : "Track an order"}
          </Link>
        </div>
      </div>
    </main>
  );
}
