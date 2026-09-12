import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { Product } from "@/types/commerce";

export function ProductDetails({ product }: { product: Product }) {
  return (
    <Section className="bg-mayera-cream">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">How to use</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">Make consistency easier.</h2>
            <ol className="mt-8 divide-y divide-mayera-line border-y border-mayera-line">
              {product.howToUse.map((step, index) => (
                <li key={step} className="grid grid-cols-[42px_1fr] gap-4 py-5 text-sm leading-7 text-mayera-espresso/66"><span className="text-xs tracking-luxury text-mayera-olive">0{index + 1}</span><span>{step}</span></li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Inside the formula</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">Ingredients with a job.</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {product.ingredients.map((ingredient) => (
                <div key={ingredient.name} className="rounded-[1.5rem] bg-mayera-paper p-6"><h3 className="font-serif text-2xl">{ingredient.name}</h3><p className="mt-2 text-sm leading-6 text-mayera-espresso/58">{ingredient.detail}</p></div>
              ))}
              {!product.ingredients.length ? <p className="rounded-[1.5rem] border border-dashed border-mayera-line bg-mayera-paper p-6 text-sm leading-6 text-mayera-espresso/58 sm:col-span-2">The complete ingredient list will be published after formulation and compliance review are final.</p> : null}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
