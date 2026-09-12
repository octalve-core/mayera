"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
  BoxIcon,
  FileTextIcon,
  HeartIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  MapPinIcon,
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
  roleLabel
}: {
  children: React.ReactNode;
  title: string;
  kicker: string;
  nav: readonly NavItem[];
  accent?: "olive" | "amber" | "espresso";
  footerLabel?: string;
  userName: string;
  roleLabel: string;
}) {
  const pathname = usePathname();
  const activeClass = accent === "amber" ? "bg-mayera-amber text-white" : accent === "espresso" ? "bg-mayera-espresso text-white" : "bg-mayera-olive text-white";

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea] lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="border-b border-mayera-line bg-mayera-paper lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-[82px] items-center justify-between px-5 lg:px-6"><Link href="/"><BrandLogo className="w-[142px]" /></Link><span className="rounded-full bg-mayera-cream px-3 py-1 text-[10px] uppercase tracking-[0.13em] text-mayera-olive lg:hidden">{kicker}</span></div>
        <div className="hidden px-6 lg:block"><p className="text-[10px] font-semibold uppercase tracking-luxury text-mayera-olive">{kicker}</p><h1 className="mt-2 font-serif text-2xl">{title}</h1></div>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-8 lg:block lg:space-y-1 lg:overflow-visible lg:px-4 lg:pb-0">
          {nav.map(({ href, label, icon }) => {
            const Icon = portalIcons[icon];
            const active = pathname === href || (href !== nav[0]?.href && pathname.startsWith(`${href}/`));
            return <Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${active ? activeClass : "text-mayera-espresso/62 hover:bg-mayera-cream hover:text-mayera-espresso"}`}><Icon className="h-[18px] w-[18px]" /><span>{label}</span></Link>;
          })}
        </nav>
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
        <div className="hidden absolute bottom-5 left-4 right-4 rounded-2xl border border-mayera-line bg-mayera-cream/55 p-4 lg:block"><p className="text-[10px] uppercase tracking-[0.14em] text-mayera-olive">{footerLabel}</p><p className="mt-2 truncate text-sm font-medium">{userName}</p><p className="mt-1 text-[11px] text-mayera-espresso/48">{roleLabel.replaceAll("_", " ")}</p><button type="button" onClick={signOut} className="mt-3 flex items-center gap-2 text-xs text-mayera-espresso/58"><LogOutIcon className="h-4 w-4" /> Sign out</button></div>
      </aside>
      <main className="min-w-0">
        <div className="mx-auto w-full max-w-[1480px] px-5 py-7 sm:px-6 lg:px-10 lg:py-9">{children}</div>
      </main>
    </div>
  );
}
