import type { Product as StoreProduct } from "@/types/commerce";
import type { JournalArticle } from "@/data/articles";
import { products as fallbackProducts } from "@/data/products";
import { articles as fallbackArticles } from "@/data/articles";
import { catalogueCategories } from "@/data/categories";
import { prisma } from "@/lib/prisma";
import { activateBundledPublicFallback, shouldReadPublicDatabase } from "@/server/database/public-read";

export type StoreCategory = { slug: string; name: string; parentSlug: string | null; sortOrder: number };

function arrayValue<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? value as T[] : fallback;
}

function fallbackProductList(categorySlug?: string) {
  return categorySlug
    ? fallbackProducts.filter((product) => product.categories.some((category) => category.slug === categorySlug))
    : fallbackProducts;
}

export async function getStoreProducts(categorySlug?: string): Promise<StoreProduct[]> {
  if (!shouldReadPublicDatabase()) return fallbackProductList(categorySlug);

  try {
    const records = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        availability: { not: "HIDDEN" },
        ...(categorySlug ? { categories: { some: { slug: categorySlug, active: true } } } : {})
      },
      include: {
        variants: { where: { active: true }, orderBy: { priceKobo: "asc" }, take: 1 },
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        categories: { where: { active: true }, orderBy: { sortOrder: "asc" } }
      },
      orderBy: [{ featured: "desc" }, { createdAt: "asc" }]
    });
    return records.flatMap((record) => {
      const variant = record.variants[0];
      if (!variant) return [];
      const fallback = fallbackProducts.find((product) => product.id === record.id || product.slug === record.slug);
      return [{
        id: record.id,
        slug: record.slug,
        name: record.name,
        shortName: record.shortName,
        subtitle: record.subtitle ?? "Mayéra",
        description: record.description,
        price: variant.priceKobo / 100,
        priceAvailable: variant.priceKobo > 0,
        compareAt: variant.compareAtKobo ? variant.compareAtKobo / 100 : undefined,
        size: variant.label,
        sku: variant.sku,
        availability: record.availability === "AVAILABLE" ? "available" : "coming-soon",
        featured: record.featured,
        badge: record.badge ?? undefined,
        benefits: arrayValue<string>(record.benefits, fallback?.benefits ?? []),
        ingredients: arrayValue<{ name: string; detail: string }>(record.ingredients, fallback?.ingredients ?? []),
        howToUse: arrayValue<string>(record.howToUse, fallback?.howToUse ?? []),
        imageUrl: record.images[0]?.url ?? fallback?.imageUrl ?? "/images/products/hair-bundle.png",
        categories: record.categories.map((category) => ({ slug: category.slug, name: category.name }))
      }];
    });
  } catch (error) {
    activateBundledPublicFallback(error);
    return fallbackProductList(categorySlug);
  }
}

export async function getStoreProduct(slug: string) {
  return (await getStoreProducts()).find((product) => product.slug === slug);
}

export async function getStoreCategories(): Promise<StoreCategory[]> {
  const fallback = () => catalogueCategories.map((category) => ({ ...category }));
  if (!shouldReadPublicDatabase()) return fallback();
  try {
    const categories = await prisma.category.findMany({ where: { active: true }, include: { parent: { select: { slug: true } } }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
    return categories.map((category) => ({ slug: category.slug, name: category.name, parentSlug: category.parent?.slug ?? null, sortOrder: category.sortOrder }));
  } catch (error) {
    activateBundledPublicFallback(error);
    return fallback();
  }
}

function articleBody(value: unknown) {
  if (!value || typeof value !== "object") return [];
  const body = value as { paragraphs?: unknown };
  return arrayValue<string>(body.paragraphs, []);
}

export async function getJournalArticles(): Promise<JournalArticle[]> {
  if (!shouldReadPublicDatabase()) return fallbackArticles;
  try {
    const records = await prisma.article.findMany({ where: { status: "PUBLISHED" }, include: { category: true }, orderBy: { publishedAt: "desc" } });
    return records.map((record) => {
      const body = articleBody(record.body);
      const words = body.join(" ").split(/\s+/).filter(Boolean).length;
      return { slug: record.slug, title: record.title, excerpt: record.excerpt, category: record.category?.name ?? "Hair Education", readTime: `${Math.max(1, Math.ceil(words / 200))} min read`, body };
    });
  } catch (error) {
    activateBundledPublicFallback(error);
    return fallbackArticles;
  }
}

export async function getJournalArticle(slug: string) {
  return (await getJournalArticles()).find((article) => article.slug === slug);
}
