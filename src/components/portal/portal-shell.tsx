"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
  BoxIcon,
  CloseIcon,
  FileTextIcon,
  HeartIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  MapPinIcon,
  MoreIcon,
  PackageIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "@/components/ui/icons";

const portalIcons = {
  box: BoxIcon,
  fileText: FileTextIcon,
  heart: HeartIcon,
  home: HomeIcon,
  mail: MailIcon,
  mapPin: MapPinIcon,
  package: PackageIcon,
  settings: SettingsIcon,
  user: UserIcon,
  users: UsersIcon,
} as const;

type NavItem = { href: string; label: string; icon: keyof typeof portalIcons; permission?: string };

export function PortalShell({
  children,
  title,
  kicker,
  nav,
  accent = "olive",
  footerLabel = "Secure workspace",
  userName,
  roleLabel,
  mobileNavigation = "default"
}: {
  children: React.ReactNode;
  title: string;
  kicker: string;
  nav: readonly NavItem[];
  accent?: "olive" | "amber" | "espresso";
  footerLabel?: string;
  userName: string;
  roleLabel: string;
  mobileNavigation?: "default" | "customer";
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const activeClass = accent === "amber" ? "bg-mayera-amber text-white" : accent === "espresso" ? "bg-mayera-espresso text-white" : "bg-mayera-olive text-white";
  const customerMobile = mobileNavigation === "customer";
  const customerPrimaryNav = customerMobile ? nav.slice(0, 4) : [];
  const customerMoreNav = customerMobile ? nav.slice(4) : [];
  const moreActive = customerMoreNav.some(({ href }) => pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => {
    if (!moreOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [moreOpen]);

  async function signOut() {
    setMoreOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  return (
    <div className={`min-h-screen bg-[#f5f1ea] lg:grid lg:grid-cols-[270px_1fr] ${customerMobile ? "pb-24 lg:pb-0" : ""}`}>
      <aside className="border-b border-mayera-line bg-mayera-paper lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-[82px] items-center justify-between px-5 lg:px-6"><Link href="/"><BrandLogo className="w-[142px]" /></Link><span className="rounded-full bg-mayera-cream px-3 py-1 text-[10px] uppercase tracking-[0.13em] text-mayera-olive lg:hidden">{kicker}</span></div>
        <div className="hidden px-6 lg:block"><p className="text-[10px] font-semibold uppercase tracking-luxury text-mayera-olive">{kicker}</p><h1 className="mt-2 font-serif text-2xl">{title}</h1></div>
        <nav className={customerMobile ? "hidden lg:mt-8 lg:block lg:space-y-1 lg:px-4" : "no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-8 lg:block lg:space-y-1 lg:overflow-visible lg:px-4 lg:pb-0"}>
          {nav.map(({ href, label, icon }) => {
            const Icon = portalIcons[icon];
            const active = pathname === href || (href !== nav[0]?.href && pathname.startsWith(`${href}/`));
            return <Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${active ? activeClass : "text-mayera-espresso/62 hover:bg-mayera-cream hover:text-mayera-espresso"}`}><Icon className="h-[18px] w-[18px]" /><span>{label}</span></Link>;
          })}
        </nav>
        {!customerMobile ? (
          <div className="border-t border-mayera-line px-4 pb-4 pt-3 lg:hidden">
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-mayera-cream/55 p-4">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.14em] text-mayera-olive">Signed in as</p>
                <p className="mt-1 truncate text-sm font-medium">{userName}</p>
                <p className="mt-1 text-[11px] text-mayera-espresso/48">{roleLabel.replaceAll("_", " ")}</p>
              </div>
              <button type="button" onClick={signOut} className="flex shrink-0 items-center gap-2 rounded-full border border-mayera-line bg-mayera-paper px-4 py-2.5 text-xs text-mayera-espresso/70">
                <LogOutIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        ) : null}
        <div className="hidden absolute bottom-5 left-4 right-4 rounded-2xl border border-mayera-line bg-mayera-cream/55 p-4 lg:block"><p className="text-[10px] uppercase tracking-[0.14em] text-mayera-olive">{footerLabel}</p><p className="mt-2 truncate text-sm font-medium">{userName}</p><p className="mt-1 text-[11px] text-mayera-espresso/48">{roleLabel.replaceAll("_", " ")}</p><button type="button" onClick={signOut} className="mt-3 flex items-center gap-2 text-xs text-mayera-espresso/58"><LogOutIcon className="h-4 w-4" /> Sign out</button></div>
      </aside>
      <main className="min-w-0">
        <div className="mx-auto w-full max-w-[1480px] px-5 py-7 sm:px-6 lg:px-10 lg:py-9">{children}</div>
      </main>

      {customerMobile ? (
        <>
          <nav
            aria-label="Customer navigation"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-mayera-line bg-mayera-paper/95 shadow-[0_-10px_30px_rgba(47,37,29,0.08)] backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto grid max-w-lg grid-cols-5 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
              {customerPrimaryNav.map(({ href, label, icon }) => {
                const Icon = portalIcons[icon];
                const active = pathname === href || (href !== "/account" && pathname.startsWith(`${href}/`));
                const mobileLabel = href === "/account" ? "Home" : href === "/account/addresses" ? "Address" : label;

                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-medium transition ${active ? "text-mayera-olive" : "text-mayera-espresso/48"}`}
                  >
                    <span className={`grid h-8 w-10 place-items-center rounded-full transition ${active ? "bg-mayera-olive/10" : ""}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="max-w-full truncate">{mobileLabel}</span>
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={moreOpen}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-medium transition ${moreActive || moreOpen ? "text-mayera-olive" : "text-mayera-espresso/48"}`}
              >
                <span className={`grid h-8 w-10 place-items-center rounded-full transition ${moreActive || moreOpen ? "bg-mayera-olive/10" : ""}`}>
                  <MoreIcon className="h-5 w-5" />
                </span>
                <span>More</span>
              </button>
            </div>
          </nav>

          {moreOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close more menu"
                onClick={() => setMoreOpen(false)}
                className="absolute inset-0 bg-mayera-espresso/35 backdrop-blur-[2px]"
              />

              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="customer-more-title"
                className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-[2rem] border-t border-mayera-line bg-mayera-paper px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-2xl"
              >
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-mayera-line" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-luxury text-mayera-olive">My Mayéra</p>
                    <h2 id="customer-more-title" className="mt-1 font-serif text-3xl">More</h2>
                    <p className="mt-1 text-xs leading-5 text-mayera-espresso/48">Account, support and privacy tools.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMoreOpen(false)}
                    aria-label="Close more menu"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mayera-cream text-mayera-espresso/60"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {customerMoreNav.map(({ href, label, icon }) => {
                    const Icon = portalIcons[icon];
                    const active = pathname === href || pathname.startsWith(`${href}/`);
                    const description =
                      href === "/account/reviews"
                        ? "Your product experiences"
                        : href === "/account/support"
                          ? "Questions and assistance"
                          : href === "/account/profile"
                            ? "Personal details and preferences"
                            : "Privacy and active sessions";

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMoreOpen(false)}
                        className={`rounded-[1.35rem] border p-4 transition ${active ? "border-mayera-olive/35 bg-mayera-olive/5" : "border-mayera-line bg-mayera-cream/35"}`}
                      >
                        <span className={`grid h-10 w-10 place-items-center rounded-full ${active ? "bg-mayera-olive text-white" : "bg-mayera-paper text-mayera-olive"}`}>
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <p className="mt-4 text-sm font-semibold">{label}</p>
                        <p className="mt-1 text-[11px] leading-5 text-mayera-espresso/48">{description}</p>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[1.35rem] border border-mayera-line bg-mayera-cream/55 p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-mayera-olive">Signed in as</p>
                  <p className="mt-2 truncate text-sm font-medium">{userName}</p>
                  <p className="mt-1 text-[11px] text-mayera-espresso/48">{roleLabel.replaceAll("_", " ")}</p>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-[1.2rem] border border-red-200 bg-red-50 px-5 text-sm font-medium text-red-700"
                >
                  <LogOutIcon className="h-[18px] w-[18px]" />
                  Sign out
                </button>
              </section>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
