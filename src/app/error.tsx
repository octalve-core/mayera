"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-mayera-cream px-5 py-20 text-center">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
          Something interrupted the ritual
        </p>
        <h1 className="mt-5 font-serif text-5xl tracking-[-.04em] text-mayera-espresso">
          This page could not be prepared.
        </h1>
        <p className="mt-5 text-sm leading-7 text-mayera-espresso/60">
          Your bag and account data have not been changed. Try the request
          again, or return to the shop.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="min-h-12 rounded-full bg-mayera-espresso px-7 text-sm font-medium text-white"
          >
            Try again
          </button>
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center rounded-full border border-mayera-espresso px-7 text-sm font-medium"
          >
            Return to shop
          </Link>
        </div>
      </div>
    </main>
  );
}
