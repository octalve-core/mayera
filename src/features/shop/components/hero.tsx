import { Container } from "@/components/ui/container";

export function ShopHero() {
  return (
    <section className="border-b border-mayera-line bg-mayera-cream py-14 sm:py-16 lg:py-20">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Shop Mayéra</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.6fr] lg:items-end">
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.045em] text-mayera-espresso sm:text-6xl lg:text-7xl">
            Hair care, kept <span className="text-mayera-amber">intentional.</span>
          </h1>
          <p className="max-w-lg text-sm leading-7 text-mayera-espresso/64 lg:justify-self-end">
            Begin with the four-product hair collection, then browse Mayéra&apos;s category system as skincare, body care, spa and other carefully reviewed ranges are introduced.
          </p>
        </div>
      </Container>
    </section>
  );
}
