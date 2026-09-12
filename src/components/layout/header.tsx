"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "./brand-logo";
import {
  BagIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/icons";
import { useCart } from "@/features/cart/cart-provider";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/hair", label: "Hair" },
  { href: "/our-story", label: "Our Story" },
  { href: "/hair-journal", label: "Hair Journal" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-mayera-line/70 bg-mayera-paper/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[86px] w-full max-w-[1280px] items-center justify-between px-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center lg:hidden"
            aria-label="Open navigation"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <Link href="/" aria-label="Mayéra home" className="shrink-0">
            <BrandLogo className="w-[144px] sm:w-[160px]" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium uppercase tracking-[0.1em] text-mayera-espresso/72 transition hover:text-mayera-espresso"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              aria-label="Search Mayéra"
              className="hidden h-10 w-10 place-items-center rounded-full hover:bg-mayera-cream sm:grid"
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/account"
              aria-label="My Mayéra account"
              className="hidden h-10 w-10 place-items-center rounded-full hover:bg-mayera-cream sm:grid"
            >
              <UserIcon className="h-[18px] w-[18px]" />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart with ${itemCount} items`}
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-mayera-cream"
            >
              <BagIcon className="h-[19px] w-[19px]" />
              {itemCount > 0 ? (
                <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-mayera-olive px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-mayera-espresso/35"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="absolute inset-y-0 left-0 w-[88%] max-w-[390px] overflow-y-auto bg-mayera-paper p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <BrandLogo className="w-[140px]" />
              <button
                onClick={() => setMobileOpen(false)}
                className="grid h-10 w-10 place-items-center"
                aria-label="Close navigation"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-12 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-mayera-line py-5 font-serif text-3xl text-mayera-espresso"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 grid grid-cols-3 gap-2 text-[11px] sm:text-xs">
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-full border border-mayera-espresso/20 px-2 py-2.5 text-center"
              >
                Search
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-full border border-mayera-espresso/20 px-2 py-2.5 text-center"
              >
                My Mayéra
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-full bg-mayera-espresso px-2 py-2.5 text-center text-white"
              >
                View Bag
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
