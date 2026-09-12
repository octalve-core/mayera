// import Image from "next/image";
// import { Container } from "@/components/ui/container";
// import { ButtonLink } from "@/components/ui/button";
// import { getPublishedText } from "@/server/content/public";

// const defaultIntroduction =
//   "Thoughtful care for textured hair — beginning with the scalp, protecting the strand, and supporting the length you are growing.";

// export async function Hero() {
//   const introduction = await getPublishedText(
//     "homepage.hero",
//     defaultIntroduction,
//   );

//   return (
//     <section className="overflow-hidden border-b border-mayera-line bg-mayera-cream">
//       <Container className="py-8 md:py-10 lg:py-14">
//         <div className="grid min-h-[700px] overflow-hidden rounded-[2.25rem] bg-[#e9e0d4] lg:grid-cols-[0.92fr_1.08fr]">
//           <div className="relative z-10 flex items-center px-7 py-14 sm:px-10 lg:px-14 xl:px-16">
//             <div className="max-w-[40rem]">
//               <p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">
//                 Modern hair wellness
//               </p>
//               <h1 className="mt-5 text-balance font-serif text-[3.35rem] leading-[0.95] tracking-[-0.05em] text-mayera-espresso sm:text-6xl lg:text-7xl xl:text-[5.8rem]">
//                 Nourish.
//                 <br />
//                 Protect.
//                 <br />
//                 <span className="text-mayera-amber">Retain.</span>
//               </h1>
//               <p className="mt-7 max-w-xl text-base leading-7 text-mayera-espresso/68 sm:text-lg sm:leading-8">
//                 {introduction}
//               </p>
//               <div className="mt-8 flex flex-wrap gap-3">
//                 <ButtonLink href="/shop">Shop hair</ButtonLink>
//                 <ButtonLink href="/hair" variant="outline">
//                   Discover the ritual
//                 </ButtonLink>
//               </div>
//               <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-mayera-espresso/10 pt-6 text-xs uppercase tracking-[0.12em] text-mayera-espresso/52">
//                 <span>Textured-hair focused</span>
//                 <span>Lightweight care</span>
//                 <span>Nigeria-first care</span>
//               </div>
//             </div>
//           </div>

//           <div className="relative min-h-[520px] overflow-hidden lg:min-h-full">
//             <Image
//               src="/images/home/hero-woman.jpg"
//               alt="Woman with textured hair enjoying a quiet beauty ritual"
//               fill
//               priority
//               className="object-cover object-center"
//               sizes="(min-width: 1024px) 54vw, 100vw"
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-[#e9e0d4]/30 via-transparent to-transparent lg:from-[#e9e0d4]/55" />
//             <div className="absolute bottom-5 left-5 hidden h-52 w-44 overflow-hidden rounded-[1.25rem] border border-white/50 bg-white/90 shadow-card lg:block xl:h-64 xl:w-52">
//               <Image
//                 src="/images/products/hair-oil.png"
//                 alt="Mayéra Scalp + Length Nourishing Oil"
//                 fill
//                 sizes="208px"
//                 className="object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

// Section 2 sample

// import Image from "next/image";
// import { Container } from "@/components/ui/container";
// import { ButtonLink } from "@/components/ui/button";
// import { getPublishedText } from "@/server/content/public";

// const defaultIntroduction =
//   "Thoughtful care for textured hair — beginning with the scalp, protecting the strand, and supporting the length you are growing.";

// export async function Hero() {
//   const introduction = await getPublishedText(
//     "homepage.hero",
//     defaultIntroduction,
//   );

//   return (
//     <section className="overflow-hidden border-b border-mayera-line bg-mayera-cream">
//       <Container className="py-5 sm:py-6 lg:py-8">
//         <div className="relative overflow-hidden rounded-[1.75rem] border border-mayera-espresso/10 bg-[#f3ecdf] sm:rounded-[2rem] lg:min-h-[760px] lg:rounded-[2.5rem]">
//           <div className="grid lg:min-h-[760px] lg:grid-cols-[0.9fr_1.1fr]">
//             {/* Content */}
//             <div className="relative z-20 flex items-center px-6 py-12 sm:px-9 sm:py-16 lg:px-12 lg:py-20 xl:px-16">
//               <div className="w-full max-w-[39rem]">
//                 <div className="flex items-center gap-3">
//                   <span className="h-px w-8 bg-mayera-olive/60" />

//                   <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-mayera-olive sm:text-xs">
//                     Mayéra Hair Wellness
//                   </p>
//                 </div>

//                 <h1 className="mt-6 max-w-[12ch] text-balance font-serif text-[3.4rem] leading-[0.92] tracking-[-0.055em] text-mayera-espresso sm:text-[4.7rem] lg:text-[5.4rem] xl:text-[6.4rem]">
//                   Nourish.
//                   <br />
//                   Protect.
//                   <br />
//                   <span className="italic text-mayera-amber">Retain.</span>
//                 </h1>

//                 <p className="mt-7 max-w-lg text-[0.98rem] leading-7 text-mayera-espresso/65 sm:text-lg sm:leading-8">
//                   {introduction}
//                 </p>

//                 {/* Buttons retained */}
//                 <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
//                   <ButtonLink
//                     href="/shop"
//                     className="w-full justify-center sm:w-auto"
//                   >
//                     Shop hair
//                   </ButtonLink>

//                   <ButtonLink
//                     href="/hair"
//                     variant="outline"
//                     className="w-full justify-center sm:w-auto"
//                   >
//                     Discover the ritual
//                   </ButtonLink>
//                 </div>

//                 <div className="mt-10 border-t border-mayera-espresso/10 pt-5 sm:mt-12">
//                   <div className="flex flex-wrap gap-x-6 gap-y-3 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-mayera-espresso/45 sm:text-[0.67rem]">
//                     <span>Textured-hair focused</span>
//                     <span>Lightweight care</span>
//                     <span>Nigeria-first care</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Editorial Image Gallery */}
//             <div className="relative px-4 pb-4 sm:px-6 sm:pb-6 lg:p-4 lg:pl-0">
//               <div className="grid h-full min-h-[500px] grid-cols-[1.18fr_0.82fr] grid-rows-2 gap-2.5 sm:min-h-[620px] sm:gap-3 lg:min-h-full">
//                 {/* Main image */}
//                 <div className="relative row-span-2 overflow-hidden rounded-[1.4rem] sm:rounded-[1.75rem] lg:rounded-[2rem]">
//                   <Image
//                     src="/images/home/hero1.png"
//                     alt="Mayéra textured hair care"
//                     fill
//                     priority
//                     className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
//                     sizes="(min-width: 1024px) 36vw, 60vw"
//                   />

//                   <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

//                   <div className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-black/15 px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md sm:bottom-5 sm:left-5 sm:text-[0.65rem]">
//                     Root to length
//                   </div>
//                 </div>

//                 {/* Image 2 */}
//                 <div className="relative overflow-hidden rounded-[1.4rem] sm:rounded-[1.75rem] lg:rounded-[2rem]">
//                   <Image
//                     src="/images/home/hero2.png"
//                     alt="Healthy textured hair by Mayéra"
//                     fill
//                     className="object-cover object-center transition-transform duration-700 hover:scale-[1.025]"
//                     sizes="(min-width: 1024px) 22vw, 40vw"
//                   />
//                 </div>

//                 {/* Image 3 */}
//                 <div className="relative overflow-hidden rounded-[1.4rem] sm:rounded-[1.75rem] lg:rounded-[2rem]">
//                   <Image
//                     src="/images/home/hero3.png"
//                     alt="Mayéra natural hair ritual"
//                     fill
//                     className="object-cover object-center transition-transform duration-700 hover:scale-[1.025]"
//                     sizes="(min-width: 1024px) 22vw, 40vw"
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-mayera-espresso/25 via-transparent to-transparent" />

//                   <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4">
//                     <p className="font-serif text-base leading-tight text-white sm:text-xl">
//                       Beauty lives
//                       <br />
//                       naturally.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Decorative luxury detail */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-mayera-amber/10"
//           />
//         </div>
//       </Container>
//     </section>
//   );
// }

import { getPublishedText } from "@/server/content/public";
import { HeroSlider } from "./hero-slider";

const defaultIntroduction =
  "Thoughtful care for textured hair — beginning with the scalp, protecting the strand, and supporting the length you are growing.";

export async function Hero() {
  const introduction = await getPublishedText(
    "homepage.hero",
    defaultIntroduction,
  );

  return <HeroSlider introduction={introduction} />;
}
