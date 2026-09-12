import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ContactForm } from "./components/contact-form";
import { MailIcon, MapPinIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site";
import { getPublishedText } from "@/server/content/public";

const faqs = [
  ["Where does Mayéra deliver?", "Mayéra is launching with nationwide delivery across Nigeria. Delivery timing and fees are shown during checkout."],
  ["How do I use the Scalp + Length Nourishing Oil?", "Apply a small amount along accessible scalp sections, massage gently, and smooth a few drops over dry ends when needed."],
  ["Can I use Mayéra with protective styles?", "Yes. The oil is designed to fit naturally into textured-hair and protective-style routines without requiring a complicated regimen."],
  ["How do returns work?", "If your order arrives damaged or incorrect, contact Mayéra with your order number and supporting photos so the team can help promptly."]
];

export default async function ContactPage() {
  const savedFaq = await getPublishedText("contact.faq", "");
  const publishedFaqs = savedFaq.split("\n").map((line) => line.split("|").map((part) => part.trim())).filter((entry): entry is [string, string] => entry.length >= 2 && Boolean(entry[0] && entry[1]));
  const displayedFaqs = publishedFaqs.length ? publishedFaqs : faqs;
  return (
    <>
      <section className="bg-mayera-cream py-14 sm:py-16 lg:py-20"><Container><p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Contact</p><h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Questions should feel <span className="text-mayera-amber">easy to ask.</span></h1></Container></section>
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="space-y-5">
              {siteConfig.email ? <Info icon={MailIcon} title="Email" text={siteConfig.email} /> : null}
              <Info icon={MapPinIcon} title="Base" text="Nigeria · Nationwide delivery" />
              <div id="delivery" className="mt-8 rounded-[1.5rem] bg-mayera-cream p-6"><h2 className="font-serif text-2xl">Delivery</h2><p className="mt-2 text-sm leading-7 text-mayera-espresso/60">Orders are prepared carefully and delivered across Nigeria through Mayéra&apos;s fulfilment partners.</p></div>
              <div id="returns" className="rounded-[1.5rem] bg-mayera-cream p-6"><h2 className="font-serif text-2xl">Returns</h2><p className="mt-2 text-sm leading-7 text-mayera-espresso/60">For damaged or incorrect orders, contact us promptly with your order number and supporting images so we can assist.</p></div>
            </div>
            <div className="rounded-[2rem] border border-mayera-line bg-white/55 p-7 sm:p-9"><h2 className="font-serif text-3xl">Send Mayéra a message</h2><p className="mt-3 text-sm leading-7 text-mayera-espresso/60">Product, order or partnership question? Send us a note and the right person will respond.</p><div className="mt-7"><ContactForm /></div></div>
          </div>
        </Container>
      </Section>
      <Section id="faq" className="bg-mayera-cream">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div><p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">FAQs</p><h2 className="mt-5 font-serif text-4xl sm:text-5xl">A few useful answers.</h2></div>
            <div className="divide-y divide-mayera-line border-y border-mayera-line">{displayedFaqs.map(([q,a])=><div key={q} className="py-6"><h3 className="font-serif text-xl">{q}</h3><p className="mt-3 text-sm leading-7 text-mayera-espresso/60">{a}</p></div>)}</div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Info({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <div className="flex gap-4 border-b border-mayera-line pb-5"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mayera-cream text-mayera-olive"><Icon className="h-5 w-5" /></div><div><p className="text-xs uppercase tracking-[0.14em] text-mayera-olive">{title}</p><p className="mt-1 text-sm text-mayera-espresso/68">{text}</p></div></div>;
}
