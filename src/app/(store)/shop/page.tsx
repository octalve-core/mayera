import type { Metadata } from "next";
import ShopPage from "@/features/shop/page";

export const metadata: Metadata = { title: "Shop" };
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return <ShopPage category={category} />;
}
