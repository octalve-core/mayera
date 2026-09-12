import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/commerce/product-card";
import { getStoreProducts } from "@/server/catalog/public";

export async function HairProducts() {
  const products = await getStoreProducts();
  return (
    <Section className="bg-mayera-cream">
      <Container>
        <SectionHeading eyebrow="The collection" title="A small range with a clear job." description="Mayéra stays intentionally focused: a small collection with a clear role in the routine, designed to make consistency easier." />
        <div className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Container>
    </Section>
  );
}
