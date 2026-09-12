import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: Array<[string, string]> }) {
  return <><section className="bg-mayera-cream py-14 sm:py-16"><Container><p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Mayéra policy</p><h1 className="mt-5 font-serif text-5xl tracking-[-0.04em] sm:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-mayera-espresso/62">{intro}</p></Container></section><Section><Container><div className="mx-auto max-w-[820px] space-y-10">{sections.map(([heading, text]) => <section key={heading}><h2 className="font-serif text-3xl">{heading}</h2><p className="mt-3 text-sm leading-7 text-mayera-espresso/64">{text}</p></section>)}</div></Container></Section></>;
}
