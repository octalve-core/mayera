import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/section-heading";
import { ProductImage } from "@/components/commerce/product-image";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { formatNaira } from "@/lib/money";
import { CheckIcon } from "@/components/ui/icons";
import { getStoreProducts } from "@/server/catalog/public";
import { getPublishedText } from "@/server/content/public";

export async function FeaturedProduct() {
  const products = await getStoreProducts();
  const product = products.find((entry) => entry.featured) ?? products.find((entry) => entry.availability === "available");
  if (!product) return null;
  const description = await getPublishedText("homepage.featured-product", product.description);
  return (
    <Section className="bg-mayera-paper">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-white lg:min-h-[650px]">
            <div className="absolute right-5 top-5 rounded-full border border-mayera-espresso/10 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-mayera-espresso backdrop-blur">
              Founding product
            </div>
            <ProductImage product={product} priority className="min-h-[650px]" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="max-w-xl">
            <Eyebrow>Mayéra Hair · 01</Eyebrow>
            <h2 className="font-serif text-4xl leading-[1.02] tracking-[-0.035em] text-mayera-espresso sm:text-5xl lg:text-6xl">
              Scalp + Length<br /><span className="text-mayera-amber">Nourishing Oil</span>
            </h2>
            <div className="mt-6 flex items-baseline gap-4">
              <p className="text-xl font-medium text-mayera-espresso">{product.priceAvailable ? formatNaira(product.price) : "Price to be announced"}</p>
              <span className="text-sm text-mayera-espresso/45">100ml</span>
            </div>
            <p className="mt-6 text-base leading-7 text-mayera-espresso/68 md:text-lg md:leading-8">
              {description}
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-mayera-espresso/72">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-mayera-cream text-mayera-olive">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
            <p className="mt-4 text-xs leading-5 text-mayera-espresso/46">Delivery is calculated at checkout. Use as directed and store in a cool, dry place.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
