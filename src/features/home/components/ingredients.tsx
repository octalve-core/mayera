import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { products } from "@/data/products";
import { getPublishedText } from "@/server/content/public";

export async function Ingredients() {
  const ingredients = products[0].ingredients;
  const introduction = await getPublishedText("ingredients.introduction", "We would rather explain why an ingredient is present than overwhelm the label with a long list of fashionable botanicals.");
  return (
    <Section className="bg-mayera-cream">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Inside Mayéra"
              title={<>Selected with purpose.<br /><span className="text-mayera-amber">Used with restraint.</span></>}
              description={introduction}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {ingredients.map((ingredient) => (
                <div key={ingredient.name} className="border-t border-mayera-espresso/15 pt-5">
                  <h3 className="font-serif text-2xl text-mayera-espresso">{ingredient.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-mayera-espresso/62">{ingredient.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#ddd3c5]">
            <Image src="/images/ingredients/ingredients-lab.jpg" alt="Botanical oil development still life" fill className="object-cover" sizes="(min-width:1024px) 45vw,100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-mayera-espresso/35 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 rounded-[1.5rem] border border-white/20 bg-white/88 p-5 backdrop-blur sm:inset-x-8 sm:bottom-8 sm:p-6">
              <p className="text-xs uppercase tracking-luxury text-mayera-olive">Formulation principle</p>
              <p className="mt-3 font-serif text-2xl leading-tight text-mayera-espresso">Performance, texture and consistency before ingredient theatre.</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
