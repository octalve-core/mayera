"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

const heroImages = [
  {
    src: "/images/home/hero1.png",
    alt: "Mayéra textured hair wellness",
  },
  {
    src: "/images/home/hero2.png",
    alt: "Healthy textured hair by Mayéra",
  },
  {
    src: "/images/home/hero3.png",
    alt: "Mayéra natural hair ritual",
  },
];

type HeroSliderProps = {
  introduction: string;
};

export function HeroSlider({ introduction }: HeroSliderProps) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-black sm:min-h-[760px] lg:min-h-[calc(100svh-4rem)]">
      {/* Background slideshow */}
      <div className="absolute inset-0 -z-30">
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${
              activeImage === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[8000ms] ease-out ${
                activeImage === index ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Main dark overlay */}
      <div className="absolute inset-0 -z-20 bg-black/55" />

      {/* Luxury directional gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/20 lg:from-black/80 lg:via-black/45 lg:to-black/10" />

      {/* Bottom cinematic fade */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-black/55 to-transparent" />

      <Container className="relative flex min-h-[720px] items-center py-16 sm:min-h-[760px] sm:py-20 lg:min-h-[calc(100svh-4rem)] lg:py-24">
        <div className="w-full max-w-[46rem]">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-white/50" />

            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-white/75 sm:text-xs">
              Mayéra Hair Wellness
            </p>
          </div>

          {/* Heading */}
          <h1 className="mt-6 max-w-[10ch] text-balance font-serif text-[3.7rem] leading-[0.9] tracking-[-0.055em] text-white sm:text-[5rem] lg:text-[6.3rem] xl:text-[7.2rem]">
            Nourish.
            <br />
            Protect.
            <br />
            <span className="italic text-mayera-amber">Retain.</span>
          </h1>

          {/* Introduction */}
          <p className="mt-7 max-w-[38rem] text-[0.98rem] leading-7 text-white/75 sm:text-lg sm:leading-8">
            {introduction}
          </p>

          {/* Existing buttons retained */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink
              href="/shop"
              className="w-full justify-center sm:w-auto"
            >
              Shop hair
            </ButtonLink>

            <ButtonLink
              href="/hair"
              variant="outline"
              className="w-full justify-center border-white/45 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-mayera-espresso sm:w-auto"
            >
              Discover the ritual
            </ButtonLink>
          </div>

          {/* Brand points */}
          <div className="mt-12 max-w-[42rem] border-t border-white/20 pt-5">
            <div className="flex flex-wrap gap-x-7 gap-y-3 text-[0.62rem] font-medium uppercase tracking-[0.17em] text-white/55 sm:text-[0.68rem]">
              <span>Textured-hair focused</span>
              <span>Lightweight care</span>
              <span>Nigeria-first care</span>
            </div>
          </div>
        </div>
      </Container>

      {/* Slider controls */}
      <div className="absolute bottom-7 right-6 z-20 flex items-center gap-2 sm:bottom-9 sm:right-10 lg:right-14">
        {heroImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Show hero image ${index + 1}`}
            onClick={() => setActiveImage(index)}
            className="group flex h-5 items-center"
          >
            <span
              className={`block h-[2px] rounded-full transition-all duration-500 ${
                activeImage === index
                  ? "w-10 bg-white"
                  : "w-5 bg-white/35 group-hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-7 left-6 hidden items-center gap-2 font-serif text-sm text-white/55 sm:bottom-9 sm:left-auto sm:right-[12.5rem] sm:flex lg:right-[16rem]">
        <span className="text-white">
          {String(activeImage + 1).padStart(2, "0")}
        </span>

        <span className="h-px w-6 bg-white/30" />

        <span>{String(heroImages.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
