import Image from "next/image";
import { Container } from "@/components/ui/container";
import { getPublishedText } from "@/server/content/public";

export async function StoryHero() {
  const introduction = await getPublishedText("our-story.introduction", "Mayéra began as an idea to create better hair care. The idea became larger when we decided to build a company rather than a single product.");
  return (
    <section className="bg-mayera-cream py-10 lg:py-14">
      <Container>
        <div className="grid overflow-hidden rounded-[2.25rem] bg-mayera-paper lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-center px-7 py-14 sm:px-10 lg:px-14 xl:px-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Our story</p>
              <h1 className="mt-5 font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Two founders.<br /><span className="text-mayera-amber">One long view.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-mayera-espresso/66">{introduction}</p>
            </div>
          </div>
          <div className="relative min-h-[560px] lg:min-h-[690px]"><Image src="/images/story/story-woman.jpg" alt="Mayéra beauty portrait" fill className="object-cover" sizes="(min-width:1024px) 55vw,100vw" /></div>
        </div>
      </Container>
    </section>
  );
}
