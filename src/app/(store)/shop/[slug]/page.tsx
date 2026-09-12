import { notFound, permanentRedirect } from "next/navigation";
import { catalogueCategories } from "@/data/categories";

const productRoutes: Record<string, string> = {
  "hair-oil": "/products/scalp-length-nourishing-oil",
  "hair-butter": "/products/moisture-strength-hair-butter",
  "hair-mask": "/products/moisture-repair-hair-mask",
  "hair-bundle": "/products/hair-care-bundle"
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "hair") permanentRedirect("/hair");

  const productRoute = productRoutes[slug];
  if (productRoute) permanentRedirect(productRoute);

  if (catalogueCategories.some((category) => category.slug === slug)) {
    permanentRedirect(`/shop?category=${encodeURIComponent(slug)}`);
  }

  notFound();
}
