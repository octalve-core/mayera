import { ProductMain } from "./components/product-main";
import { ProductDetails } from "./components/details";
import { ProductFaq } from "./components/faq";
import { RelatedProducts } from "./components/related";
import type { Product } from "@/types/commerce";
import { siteConfig } from "@/lib/site";
import { ProductReviews } from "./components/reviews";
import { StickyMobileCart } from "./components/sticky-mobile-cart";

export default function ProductPage({ product }: { product: Product }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Mayéra" },
    ...(product.priceAvailable ? { offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: "NGN",
      price: product.price,
      availability: product.availability === "coming-soon" ? "https://schema.org/PreOrder" : "https://schema.org/InStock"
    } } : {})
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><ProductMain product={product} /><ProductDetails product={product} /><ProductReviews productId={product.id}/><ProductFaq /><RelatedProducts currentId={product.id} /><StickyMobileCart product={product}/></>;
}
