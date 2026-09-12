import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { DropIcon, SparklesIcon, LeafIcon } from "@/components/ui/icons";
import { getPublishedText } from "@/server/content/public";

const items = [
  { icon: DropIcon, title: "Nourish", text: "Keep scalp care simple, light and consistent." },
  { icon: SparklesIcon, title: "Protect", text: "Support softness and manageability through the strand." },
  { icon: LeafIcon, title: "Retain", text: "Reduce avoidable breakage so more of your length remains visible." }
];

export async function HairPhilosophy() {
  const introduction = await getPublishedText("hair.philosophy", "Three words guide the first Mayéra ritual.");
  return (
    <Section>
      <Container>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">The philosophy</p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">{introduction}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="rounded-[1.75rem] border border-mayera-line bg-white/55 p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-mayera-cream text-mayera-olive"><Icon className="h-5 w-5" /></div>
                <span className="text-xs tracking-luxury text-mayera-olive">0{i + 1}</span>
              </div>
              <h3 className="mt-8 font-serif text-3xl text-mayera-espresso">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-mayera-espresso/62">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
