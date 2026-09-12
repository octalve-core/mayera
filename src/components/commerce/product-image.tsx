import Image from "next/image";
import type { Product } from "@/types/commerce";

export function ProductImage({ product, className = "", imageClassName = "", sizes = "(min-width: 1024px) 33vw, 100vw", priority = false }: { product: Product; className?: string; imageClassName?: string; sizes?: string; priority?: boolean }) {
  return <div className={`relative overflow-hidden bg-white ${className}`}><Image src={product.imageUrl} alt={`${product.name} by Mayéra`} fill priority={priority} sizes={sizes} className={`object-contain ${imageClassName}`} /></div>;
}
