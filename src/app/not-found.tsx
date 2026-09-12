import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-mayera-cream px-5 text-center">
      <div>
        <BrandLogo className="mx-auto w-[170px]" />
        <p className="mt-10 text-xs uppercase tracking-luxury text-mayera-olive">
          404
        </p>
        <h1 className="mt-4 font-serif text-5xl">This page has moved on.</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-mayera-espresso/58">
          Return to Mayéra and continue with the collection, journal or your
          account.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-full bg-mayera-espresso px-7 py-3 text-sm text-white"
        >
          Back to Mayéra
        </Link>
      </div>
    </main>
  );
}
