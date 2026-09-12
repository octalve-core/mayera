import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export function HairCta() {
  return (
    <section className="bg-mayera-espresso py-16 text-white lg:py-20">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-luxury text-white/55">Build your ritual</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">Start with what your routine actually needs.</h2>
          </div>
          <ButtonLink href="/shop" variant="outline" className="border-white/35 text-white hover:bg-white hover:text-mayera-espresso">Shop Mayéra Hair</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
