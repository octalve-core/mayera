import Image from "next/image";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/logo/mayera-logo.png"
      alt="Mayéra — Beauty Lives Naturally"
      width={1536}
      height={792}
      priority
      className={`h-auto w-[150px] object-contain sm:w-[172px] ${className}`}
    />
  );
}
