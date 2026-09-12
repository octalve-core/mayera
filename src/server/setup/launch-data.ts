import {
  ClaimStatus,
  CommerceAvailability,
  ContentStatus,
  Prisma,
  ProductStatus
} from "@prisma/client";
import { articles } from "@/data/articles";
import { catalogueCategories } from "@/data/categories";
import { products } from "@/data/products";
import { permissions } from "@/server/auth/permissions";

const imageKinds: Record<string, string> = {
  "mayera-oil-100": "oil",
  "mayera-butter-200": "butter",
  "mayera-mask-150": "mask",
  "mayera-hair-bundle": "bundle"
};

const launchPublishedAt = new Date("2026-09-09T00:00:00.000Z");

export async function initializeLiveMayéraStore(tx: Prisma.TransactionClient, standardDeliveryKobo: number) {
  for (const key of Object.values(permissions)) {
    await tx.permission.upsert({ where: { key }, create: { key }, update: {} });
  }

  for (const category of catalogueCategories) {
    await tx.category.upsert({
      where: { slug: category.slug },
      create: { slug: category.slug, name: category.name, sortOrder: category.sortOrder, active: true },
      update: { name: category.name, sortOrder: category.sortOrder, active: true }
    });
  }

  for (const category of catalogueCategories) {
    await tx.category.update({
      where: { slug: category.slug },
      data: { parent: category.parentSlug ? { connect: { slug: category.parentSlug } } : { disconnect: true } }
    });
  }

  const collection = await tx.collection.upsert({
    where: { slug: "founding-ritual" },
    create: { slug: "founding-ritual", name: "Founding Ritual", description: "Mayéra's first scalp and strand ritual." },
    update: { name: "Founding Ritual", description: "Mayéra's first scalp and strand ritual." }
  });

  for (const item of products) {
    const priceKobo = Math.round(item.price * 100);
    const compareAtKobo = item.compareAt ? Math.round(item.compareAt * 100) : null;
    const categoryConnections = item.categories.map(({ slug }) => ({ slug }));
    const product = await tx.product.upsert({
      where: { slug: item.slug },
      create: {
        id: item.id,
        slug: item.slug,
        name: item.name,
        shortName: item.shortName,
        subtitle: item.subtitle,
        description: item.description,
        availability: item.availability === "available" ? CommerceAvailability.AVAILABLE : CommerceAvailability.COMING_SOON,
        benefits: item.benefits,
        ingredients: item.ingredients,
        howToUse: item.howToUse,
        imageKind: imageKinds[item.id] ?? "product",
        status: ProductStatus.PUBLISHED,
        claimStatus: ClaimStatus.APPROVED,
        featured: Boolean(item.featured),
        badge: item.badge,
        seoTitle: `${item.name} | Mayéra`,
        seoDescription: item.description,
        publishedAt: launchPublishedAt,
        categories: { connect: categoryConnections },
        collections: { connect: { id: collection.id } }
      },
      update: {
        name: item.name,
        shortName: item.shortName,
        subtitle: item.subtitle,
        description: item.description,
        availability: item.availability === "available" ? CommerceAvailability.AVAILABLE : CommerceAvailability.COMING_SOON,
        benefits: item.benefits,
        ingredients: item.ingredients,
        howToUse: item.howToUse,
        imageKind: imageKinds[item.id] ?? "product",
        status: ProductStatus.PUBLISHED,
        claimStatus: ClaimStatus.APPROVED,
        featured: Boolean(item.featured),
        badge: item.badge,
        seoTitle: `${item.name} | Mayéra`,
        seoDescription: item.description,
        categories: { set: categoryConnections },
        collections: { set: [{ id: collection.id }] }
      }
    });

    const existingImage = await tx.productImage.findFirst({ where: { productId: product.id }, orderBy: { sortOrder: "asc" } });
    if (existingImage) {
      await tx.productImage.update({ where: { id: existingImage.id }, data: { url: item.imageUrl, alt: `${item.name} by Mayéra`, sortOrder: 0 } });
    } else {
      await tx.productImage.create({ data: { productId: product.id, url: item.imageUrl, alt: `${item.name} by Mayéra`, sortOrder: 0 } });
    }

    const variant = await tx.productVariant.upsert({
      where: { sku: item.sku },
      create: { id: `${item.id}-default`, productId: product.id, sku: item.sku, label: item.size, priceKobo, compareAtKobo, active: true },
      update: { productId: product.id, label: item.size, priceKobo, compareAtKobo, active: true }
    });

    await tx.inventory.upsert({
      where: { variantId: variant.id },
      create: { variantId: variant.id, available: 0, reserved: 0, lowStockThreshold: 10 },
      update: { lowStockThreshold: 10 }
    });
  }

  for (const entry of articles) {
    const categorySlug = entry.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const category = await tx.articleCategory.upsert({
      where: { slug: categorySlug },
      create: { slug: categorySlug, name: entry.category },
      update: { name: entry.category }
    });
    await tx.article.upsert({
      where: { slug: entry.slug },
      create: {
        slug: entry.slug,
        title: entry.title,
        excerpt: entry.excerpt,
        body: { type: "doc", paragraphs: entry.body },
        categoryId: category.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: launchPublishedAt
      },
      update: {
        title: entry.title,
        excerpt: entry.excerpt,
        body: { type: "doc", paragraphs: entry.body },
        categoryId: category.id,
        status: ContentStatus.PUBLISHED
      }
    });
  }

  await tx.shippingRate.upsert({
    where: { id: "standard-nigeria" },
    create: { id: "standard-nigeria", name: "Standard Nigeria delivery", states: [], amountKobo: standardDeliveryKobo, active: true, sortOrder: 100 },
    update: { name: "Standard Nigeria delivery", amountKobo: standardDeliveryKobo, active: true, sortOrder: 100 }
  });
  await tx.pageContent.upsert({
    where: { key: "homepage.hero" },
    create: {
      key: "homepage.hero",
      draft: { content: "Thoughtful care for textured hair — beginning with the scalp, protecting the strand, and supporting the length you are growing." },
      published: { content: "Thoughtful care for textured hair — beginning with the scalp, protecting the strand, and supporting the length you are growing." },
      status: ContentStatus.PUBLISHED,
      publishedAt: launchPublishedAt
    },
    update: {}
  });
  await tx.systemSetting.upsert({ where: { key: "maintenance-mode" }, create: { key: "maintenance-mode", value: { enabled: false } }, update: {} });

  for (const integration of [
    { key: "paystack", provider: "Paystack" },
    { key: "resend", provider: "Resend" },
    { key: "object-storage", provider: "S3/R2-compatible storage" }
  ]) {
    await tx.integration.upsert({
      where: { key: integration.key },
      create: { ...integration, enabled: false },
      update: { provider: integration.provider }
    });
  }
}
