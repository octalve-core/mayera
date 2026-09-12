import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const values = [
  ["Quality", "Thoughtful formulation, product experience and consistency."],
  ["Integrity", "Claims we can stand behind and communication that respects customers."],
  ["Simplicity", "Fewer products with clearer roles in the routine."],
  ["Long-term thinking", "Building an institution rather than chasing a short-lived beauty trend."]
];

export function StoryPhilosophy() {
  return (
    <Section className="bg-[#e8dfd3]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Brand philosophy</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">Thoughtful beauty.<br /><span className="text-mayera-amber">Built to last.</span></h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[1.75rem] bg-mayera-line sm:grid-cols-2">
            {values.map(([title, text]) => (
              <div key={title} className="bg-mayera-paper p-7 sm:p-8"><h3 className="font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-7 text-mayera-espresso/60">{text}</p></div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
