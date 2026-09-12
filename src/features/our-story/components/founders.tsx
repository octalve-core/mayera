import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function Founders() {
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
              Founders
            </p>
            <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
              Built together.
            </h2>
          </div>
          <div>
            <p className="max-w-3xl text-base leading-8 text-mayera-espresso/64">
              Mayéra is co-founded by two partners with a shared ambition: build
              a beauty company that can begin small, earn trust through product
              experience and grow without losing its standard.
            </p>
            <div className="mt-8 grid gap-px overflow-hidden rounded-[1.75rem] bg-mayera-line sm:grid-cols-2">
              <div className="bg-mayera-cream p-8">
                <p className="text-xs uppercase tracking-luxury text-mayera-olive">
                  Co-Founder & Director
                </p>
                <h3 className="mt-4 font-serif text-3xl">
                  Ismail Aminullahi Olamide
                </h3>
              </div>
              <div className="bg-mayera-cream p-8">
                <p className="text-xs uppercase tracking-luxury text-mayera-olive">
                  Co-Founder & Director
                </p>
                <h3 className="mt-4 font-serif text-3xl">
                  Abdulazeez Maryam Omotoyosi
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
