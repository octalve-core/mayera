// import { Container } from "@/components/ui/container";
// import { Section } from "@/components/ui/section";

// export function Founders() {
//   return (
//     <Section>
//       <Container>
//         <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
//               Founders
//             </p>
//             <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
//               Built together.
//             </h2>
//           </div>
//           <div>
//             <p className="max-w-3xl text-base leading-8 text-mayera-espresso/64">
//               Mayéra is co-founded by two partners with a shared ambition: build
//               a beauty company that can begin small, earn trust through product
//               experience and grow without losing its standard.
//             </p>
//             <div className="mt-8 grid gap-px overflow-hidden rounded-[1.75rem] bg-mayera-line sm:grid-cols-2">
//               <div className="bg-mayera-cream p-8">
//                 <p className="text-xs uppercase tracking-luxury text-mayera-olive">
//                   Co-Founder & Director
//                 </p>
//                 <h3 className="mt-4 font-serif text-3xl">
//                   Ismail Aminullahi Olamide
//                 </h3>
//               </div>
//               <div className="bg-mayera-cream p-8">
//                 <p className="text-xs uppercase tracking-luxury text-mayera-olive">
//                   Co-Founder & Director
//                 </p>
//                 <h3 className="mt-4 font-serif text-3xl">
//                   Abdulazeez Maryam Omotoyosi
//                 </h3>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Container>
//     </Section>
//   );
// }

import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const founders = [
  {
    name: "Ismail Aminullahi Olamide",
    role: "Co-Founder & Director",
    image: "/images/founder/Aminullahi.png",
    alt: "Ismail Aminullahi Olamide, Co-Founder of Mayéra",
    position: "object-center",
  },
  {
    name: "Abdulazeez Maryam Omotoyosi",
    role: "Co-Founder & Director",
    image: "/images/founder/Maryam.png",
    alt: "Abdulazeez Maryam Omotoyosi, Co-Founder of Mayéra",
    position: "object-center",
  },
];

export function Founders() {
  return (
    <Section className="overflow-hidden bg-mayera-cream">
      <Container>
        <div className="border-t border-mayera-espresso/10 pt-14 sm:pt-16 lg:pt-20">
          {/* Section introduction */}
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-mayera-olive/60" />

                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-mayera-olive sm:text-xs">
                  The Founders
                </p>
              </div>

              <h2 className="mt-5 max-w-[9ch] font-serif text-[2.8rem] leading-[0.98] tracking-[-0.04em] text-mayera-espresso sm:text-5xl lg:text-6xl">
                Built
                <br />
                together.
              </h2>
            </div>

            <div className="flex items-end">
              <div className="max-w-3xl">
                <p className="text-base leading-8 text-mayera-espresso/65 sm:text-lg sm:leading-8">
                  Mayéra is co-founded by two partners with a shared ambition:
                  to build a beauty company that can begin small, earn trust
                  through product experience, and grow without losing its
                  standard.
                </p>

                <p className="mt-5 max-w-2xl font-serif text-xl italic leading-8 text-mayera-espresso/85 sm:text-2xl">
                  A shared vision for beauty that feels thoughtful, natural and
                  enduring.
                </p>
              </div>
            </div>
          </div>

          {/* Founder portraits */}
          <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-2 lg:gap-7">
            {founders.map((founder, index) => (
              <article
                key={founder.name}
                className="group relative overflow-hidden rounded-[1.75rem] bg-mayera-espresso sm:rounded-[2rem]"
              >
                {/* Portrait */}
                <div className="relative aspect-[4/5] min-h-[470px] overflow-hidden sm:min-h-[560px] lg:min-h-[650px]">
                  <Image
                    src={founder.image}
                    alt={founder.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={`object-cover ${founder.position} transition-transform duration-1000 ease-out group-hover:scale-[1.025]`}
                  />

                  {/* Black cinematic treatment */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5" />

                  {/* Very subtle luxury tint */}
                  <div className="absolute inset-0 bg-mayera-espresso/5 transition-colors duration-700 group-hover:bg-transparent" />

                  {/* Founder number */}
                  <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/10 font-serif text-sm text-white/80 backdrop-blur-md">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Founder information */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/60 sm:text-xs">
                      {founder.role}
                    </p>

                    <h3 className="mt-3 max-w-[13ch] font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.8rem]">
                      {founder.name}
                    </h3>

                    <div className="mt-6 h-px w-full bg-white/20">
                      <div className="h-px w-12 bg-white/70 transition-all duration-700 group-hover:w-24" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Closing brand statement */}
          <div className="mt-6 flex flex-col gap-5 border-b border-mayera-espresso/10 pb-14 pt-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pb-16 lg:pb-20">
            <p className="max-w-xl text-sm leading-6 text-mayera-espresso/50">
              Two perspectives. One standard. One vision for Mayéra.
            </p>

            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-mayera-olive">
              Beauty lives naturally
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
