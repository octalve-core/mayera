import { Container } from "@/components/ui/container";

export function JournalHero() {
  return (
    <section className="bg-mayera-cream py-14 sm:py-16 lg:py-20">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Hair Journal</p>
        <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Care, explained <span className="text-mayera-amber">without the noise.</span></h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-mayera-espresso/64">Hair education, ingredient notes and routine guidance written to make the next decision simpler — not to make beauty sound mysterious.</p>
      </Container>
    </section>
  );
}
