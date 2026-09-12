import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { DropIcon, LeafIcon, SparklesIcon } from "@/components/ui/icons";

const steps = [
  { number: "01", icon: DropIcon, title: "Nourish the scalp", copy: "A consistent, lightweight scalp routine that feels considered rather than heavy." },
  { number: "02", icon: SparklesIcon, title: "Protect the strand", copy: "Support softness, manageability and less unnecessary breakage during manipulation." },
  { number: "03", icon: LeafIcon, title: "Retain your length", copy: "Visible progress depends on keeping more of the length your hair is already growing." }
];

export function LengthRetention() {
  return (
    <Section className="bg-mayera-paper">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Our hair philosophy</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.02] tracking-[-0.035em] text-mayera-espresso sm:text-5xl lg:text-6xl">
              Growth is only<br /><span className="text-mayera-amber">half the story.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-mayera-espresso/66">
              Textured hair can grow while still losing visible length through dryness, manipulation and breakage. Mayéra is designed around the routine that happens after growth begins.
            </p>
          </div>
          <div className="divide-y divide-mayera-line border-y border-mayera-line">
            {steps.map(({ number, icon: Icon, title, copy }) => (
              <div key={number} className="grid gap-6 py-8 sm:grid-cols-[72px_1fr] sm:py-10">
                <div className="flex items-center gap-4 sm:block">
                  <span className="text-xs font-semibold tracking-luxury text-mayera-olive">{number}</span>
                  <div className="mt-0 grid h-12 w-12 place-items-center rounded-full bg-mayera-cream text-mayera-olive sm:mt-5">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-3xl text-mayera-espresso">{title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-mayera-espresso/62">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
