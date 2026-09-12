import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CartLines } from "./components/cart-lines";
import { CartSummary } from "./components/cart-summary";

export default function CartPage() {
  return (
    <>
      <section className="border-b border-mayera-line bg-mayera-cream py-12 sm:py-14 lg:py-16">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
            Your bag
          </p>
          <h1 className="mt-4 font-serif text-5xl tracking-[-0.04em] sm:text-6xl">
            A simpler ritual.
          </h1>
        </Container>
      </section>
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
            <CartLines />
            <CartSummary />
          </div>
        </Container>
      </Section>
    </>
  );
}
