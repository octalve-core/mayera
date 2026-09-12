export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  price: number;
  priceAvailable: boolean;
  compareAt?: number;
  size: string;
  sku: string;
  availability: "available" | "coming-soon";
  featured?: boolean;
  badge?: string;
  benefits: string[];
  ingredients: Array<{ name: string; detail: string }>;
  howToUse: string[];
  imageUrl: string;
  categories: Array<{ slug: string; name: string }>;
};

export type CartLine = {
  product: Product;
  quantity: number;
};
