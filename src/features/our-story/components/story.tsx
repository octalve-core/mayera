import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function StoryBody() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div><p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Why Mayéra exists</p></div>
          <div className="max-w-3xl space-y-6 font-serif text-2xl leading-[1.55] text-mayera-espresso/88 sm:text-3xl">
            <p>We wanted a beauty brand that could feel considered without feeling distant — modern without losing its African point of view.</p>
            <p>Hair wellness is our first chapter because textured hair makes the need obvious: people are often asked to choose between heavy formulas, complicated routines and exaggerated promises.</p>
            <p className="text-mayera-amber">Mayéra is our decision to build differently: smaller promises, better experiences, and a company that grows only when the customer experience is ready for the next chapter.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
