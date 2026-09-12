import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-mayera-paper lg:grid-cols-[0.86fr_1.14fr]">
      <section className="flex min-h-screen flex-col px-5 py-7 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Mayéra home">
          <BrandLogo className="w-[150px]" />
        </Link>
        <div className="mx-auto my-auto w-full max-w-[470px] py-16">
          <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl tracking-[-0.03em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-mayera-espresso/60">
            {description}
          </p>
          <div className="mt-9">{children}</div>
        </div>
        <p className="text-xs text-mayera-espresso/45">
          © {new Date().getFullYear()} MAYERA LTD
        </p>
      </section>
      <aside className="relative hidden overflow-hidden bg-mayera-espresso lg:block">
        <div className="absolute inset-0 mayera-grid opacity-30" />
        <div className="relative flex h-full flex-col justify-end p-14 text-white xl:p-20">
          <p className="text-xs uppercase tracking-luxury text-white/55">
            Nourish · Protect · Retain
          </p>
          <p className="mt-5 max-w-xl font-serif text-5xl leading-[1.03] xl:text-6xl">
            A quieter space for your Mayéra ritual.
          </p>
        </div>
      </aside>
    </main>
  );
}
