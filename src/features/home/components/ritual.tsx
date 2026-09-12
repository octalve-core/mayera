import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

const steps = [
  { number: "01", action: "Nourish", title: "Scalp + Length Oil", description: "Direct scalp nourishment with a light enough finish for regular routines and protective styles.", href: "/products/scalp-length-nourishing-oil", image: "/images/products/hair-oil.png", alt: "Mayéra Scalp + Length Nourishing Oil" },
  { number: "02", action: "Protect", title: "Moisture + Strength Butter", description: "A rich layer for softness, moisture sealing and everyday strand protection.", href: "/products/moisture-strength-hair-butter", image: "/images/products/hair-butter.png", alt: "Mayéra Moisture + Strength Hair Butter" },
  { number: "03", action: "Restore", title: "Moisture + Repair Mask", description: "The planned wash-day conditioning step for a complete Mayéra hair ritual.", href: "/products/moisture-repair-hair-mask", image: "/images/products/hair-mask.png", alt: "Mayéra Moisture + Repair Hair Mask" }
];

export function Ritual() {
  return <Section className="bg-[#eae2d7]"><Container>
    <SectionHeading eyebrow="The Mayéra ritual" title={<>A simpler routine.<br /><span className="text-mayera-amber">Three intentional steps.</span></>} description="Mayéra's hair system separates scalp care, daily strand protection and wash-day conditioning into clear, considered steps." />
    <div className="mt-12 grid gap-6 lg:grid-cols-3">{steps.map((step) => <article key={step.number} className="overflow-hidden rounded-[2rem] bg-mayera-paper"><div className="relative aspect-[4/3] bg-white"><Image src={step.image} alt={step.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-contain" /></div><div className="p-7 sm:p-8"><span className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">{step.number} · {step.action}</span><h3 className="mt-4 font-serif text-3xl text-mayera-espresso">{step.title}</h3><p className="mt-4 text-sm leading-7 text-mayera-espresso/64">{step.description}</p><ButtonLink href={step.href} variant="ghost" className="mt-5 px-0">View product →</ButtonLink></div></article>)}</div>
    <div className="mt-8 flex justify-center"><ButtonLink href="/products/hair-care-bundle" variant="outline">View the complete hair bundle</ButtonLink></div>
  </Container></Section>;
}
