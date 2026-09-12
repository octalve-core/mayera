import { Container } from "@/components/ui/container";
import Image from "next/image";

export function HairHero() {
  return (
    <section className="overflow-hidden bg-[#e9e1d6]">
      <Container className="py-10 lg:py-14">
        <div className="grid overflow-hidden rounded-[2.25rem] bg-mayera-paper lg:grid-cols-[1fr_0.9fr]">
          <div className="flex items-center px-7 py-14 sm:px-10 lg:px-14 xl:px-16">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Mayéra Hair</p>
              <h1 className="mt-5 font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Care for the scalp.<br /><span className="text-mayera-amber">Keep the strand.</span></h1>
              <p className="mt-6 text-base leading-8 text-mayera-espresso/66">Our first collection is built around a simple idea: visible hair progress depends on what happens to the strand after it grows.</p>
            </div>
          </div>
          <div className="relative min-h-[560px] bg-white"><Image src="/images/products/hair-bundle.png" alt="Mayéra Hair Oil, Hair Butter and Hair Mask bundle" fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-contain" /></div>
        </div>
      </Container>
    </section>
  );
}
