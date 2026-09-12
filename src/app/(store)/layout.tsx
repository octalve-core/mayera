import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { BrandLogo } from "@/components/layout/brand-logo";
import { isMaintenanceMode } from "@/server/content/public";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  if (await isMaintenanceMode()) {
    return <main className="flex min-h-screen items-center justify-center bg-mayera-cream px-5"><section className="w-full max-w-xl rounded-[2rem] border border-mayera-line bg-mayera-paper p-8 text-center shadow-sm sm:p-12"><BrandLogo className="mx-auto w-44" /><p className="mt-10 text-xs font-semibold uppercase tracking-luxury text-mayera-olive">A short pause</p><h1 className="mt-4 font-serif text-4xl tracking-[-.04em] sm:text-5xl">Mayéra is being carefully refreshed.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-mayera-espresso/60">The store will return shortly. Existing checkout confirmations and secure account areas remain available.</p></section></main>;
  }
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
