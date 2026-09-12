import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export function BrandStory() {
  return (
    <Section className="bg-[#e7ded2]">
      <Container>
        <div className="grid overflow-hidden rounded-[2.25rem] bg-mayera-paper lg:grid-cols-2">
          <div className="relative min-h-[520px] lg:min-h-[650px]">
            <Image src="/images/story/story-woman.jpg" alt="Textured hair beauty portrait" fill className="object-cover object-center" sizes="(min-width:1024px) 50vw,100vw" />
          </div>
          <div className="flex items-center px-7 py-12 sm:px-10 lg:px-14 xl:px-16">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Made with intention</p>
              <h2 className="mt-5 font-serif text-4xl leading-[1.02] tracking-[-0.035em] text-mayera-espresso sm:text-5xl lg:text-6xl">
                We did not start to build<br /><span className="text-mayera-amber">a single product.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-mayera-espresso/66">
                Mayéra began with a shared ambition between two founders to build something meaningful together. Hair wellness is the first chapter in a broader beauty company — but the customer only sees what we are ready to deliver well today.
              </p>
              <ButtonLink href="/our-story" variant="outline" className="mt-8">Read our story</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
