import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPage from "@/features/product/page";
import { getStoreProduct } from "@/server/catalog/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
