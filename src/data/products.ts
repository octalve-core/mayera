import type { Product } from "@/types/commerce";

const hairCategories = [
  { slug: "hair", name: "Hair" },
  { slug: "haircare", name: "Haircare" },
];

export const products: Product[] = [
  {
    id: "mayera-oil-100",
    slug: "scalp-length-nourishing-oil",
    name: "Scalp + Length Nourishing Oil",
    shortName: "Hair Oil",
    subtitle: "Lightweight scalp and strand care",
    description:
      "A lightweight botanical oil blend created to nourish the scalp, add shine, soften dry strands and support a consistent length-retention routine without the heavy feel.",
    price: 9500,
    priceAvailable: true,
    size: "100ml",
    sku: "MYR-OIL-100",
    availability: "available",
    featured: true,
    badge: "Founding Product",
    benefits: [
      "Scalp nourishment",
      "Stronger-feeling strands",
      "Length retention",
      "Lightweight finish",
    ],
    ingredients: [
      {
        name: "Coconut",
        detail: "Conditioning support for dry, textured hair.",
      },
      { name: "Jojoba", detail: "Lightweight scalp and strand conditioning." },
      {
        name: "Baobab",
        detail: "Rich botanical conditioning with an African ingredient story.",
      },
      {
        name: "Rosemary",
        detail: "A signature botanical in the Mayéra oil system.",
      },
    ],
    howToUse: [
      "Part hair in sections and apply a small amount directly to the scalp.",
      "Massage gently with fingertips for 1–2 minutes.",
      "Smooth a few drops through dry ends when needed.",
      "Use 2–3 times weekly or as your routine requires.",
    ],
    imageUrl: "/images/products/hair-oil.png",
    categories: [
      ...hairCategories,
      { slug: "best-seller", name: "Best Seller" },
      { slug: "best-seller-haircare", name: "Best Seller Haircare" },
      { slug: "long-hair", name: "Long Hair" },
    ],
  },
  {
    id: "mayera-butter-200",
    slug: "moisture-strength-hair-butter",
    name: "Moisture + Strength Hair Butter",
    shortName: "Hair Butter",
    subtitle: "Rich, non-greasy strand care",
    description:
      "A rich but balanced hair butter designed to seal moisture, improve softness and manageability, and support strands against unnecessary breakage.",
    price: 9500,
    priceAvailable: true,
    size: "200g",
    sku: "MYR-BUTTER-200",
    availability: "available",
    badge: "Hair Product",
    benefits: [
      "Seals moisture",
      "Softens strands",
      "Improves manageability",
      "Supports breakage reduction",
    ],
    ingredients: [
      {
        name: "Shea Butter",
        detail: "Rich conditioning and moisture-sealing support.",
      },
      { name: "Mango Butter", detail: "Smooth texture and conditioning." },
      {
        name: "Jojoba",
        detail: "Balanced emollience without excessive heaviness.",
      },
      { name: "Vitamin E", detail: "Antioxidant support for the oil system." },
    ],
    howToUse: [
      "Apply a small amount to damp or moisturised hair.",
      "Focus on mid-lengths and ends.",
      "Use during styling or protective-style preparation.",
      "Adjust amount according to hair density and porosity.",
    ],
    imageUrl: "/images/products/hair-butter.png",
    categories: hairCategories,
  },
  {
    id: "mayera-mask-150",
    slug: "moisture-repair-hair-mask",
    name: "Moisture + Repair Hair Mask",
    shortName: "Hair Mask",
    subtitle: "A considered wash-day conditioning step",
    description:
      "A future wash-day treatment being prepared to support softness, manageability and a more intentional textured-hair routine. Final directions and full ingredient information will be published before release.",
    price: 7500,
    priceAvailable: true,
    size: "150g",
    sku: "MYR-MASK-150",
    availability: "available",
    badge: "Hair Product",
    benefits: [
      "Wash-day conditioning",
      "Softness-focused care",
      "Manageability support",
      "In development",
    ],
    ingredients: [],
    howToUse: [
      "Final directions will be published after formulation and compliance review are complete.",
    ],
    imageUrl: "/images/products/hair-mask.png",
    categories: hairCategories,
  },
  {
    id: "mayera-hair-bundle",
    slug: "hair-care-bundle",
    name: "Mayéra Hair Bundle",
    shortName: "Hair Bundle",
    subtitle: "Hair Oil + Hair Butter + Hair Mask",
    description:
      "The complete Mayéra hair ritual, bringing the Hair Oil, Hair Butter and Hair Mask together in one considered set. Bundle pricing and release details will be confirmed before launch.",
    price: 25000,
    priceAvailable: true,
    size: "100ml + 200g + 150g",
    sku: "MYR-BUNDLE-001",
    availability: "available",
    badge: "Hair Product",
    benefits: [
      "Three-product ritual",
      "Scalp + strand care",
      "Wash-day to styling",
      "Bundle release planned",
    ],
    ingredients: [],
    howToUse: [
      "The complete bundle routine will be published when all three products are ready for release.",
    ],
    imageUrl: "/images/products/hair-bundle.png",
    categories: [
      ...hairCategories,
      { slug: "best-seller-haircare", name: "Best Seller Haircare" },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
