import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/commerce/product-card";
import { getStoreProducts } from "@/server/catalog/public";

export async function RelatedProducts({ currentId }: { currentId: string }) {
  const related = (await getStoreProducts()).filter((item) => item.id !== currentId).slice(0, 2);
  return (
    <Section className="bg-[#e9e1d6]">
      <Container>
        <SectionHeading eyebrow="Complete the ritual" title="Pair it with what comes next." />
        <div className="mt-10 grid max-w-4xl gap-7 md:grid-cols-2">{related.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </Container>
    </Section>
  );
}
