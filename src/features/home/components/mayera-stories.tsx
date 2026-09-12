import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export function MayeraStories() {
  return (
    <Section className="bg-mayera-paper">
      <Container>
        <SectionHeading
          eyebrow="Your Mayéra stories"
          title="Proof should come from real routines."
          description="This section is intentionally waiting for verified Mayéra customers. We will publish real reviews and result stories only after launch — never invented testimonials."
        />
        <div className="mt-10 rounded-[2rem] border border-dashed border-mayera-olive/35 bg-mayera-cream/60 p-8 text-center sm:p-12">
          <p className="font-serif text-3xl text-mayera-espresso">Customer stories will live here.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-mayera-espresso/58">Review infrastructure is part of the platform, but the public section stays honest until genuine purchases and experiences exist.</p>
        </div>
      </Container>
    </Section>
  );
}
