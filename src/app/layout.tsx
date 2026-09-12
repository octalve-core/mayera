import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/features/cart/cart-provider";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { siteConfig } from "@/lib/site";
import { assertProductionEnv } from "@/lib/env";
import { getPublishedText } from "@/server/content/public";

export async function generateMetadata(): Promise<Metadata> {
  const description = await getPublishedText(
    "seo.defaults",
    siteConfig.description,
  );
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: "Mayéra — Modern Hair Wellness",
      template: "%s | Mayéra",
    },
    description,
    keywords: [
      "Mayéra",
      "hair care",
      "textured hair",
      "scalp oil",
      "Nigeria beauty",
    ],
    openGraph: {
      title: "Mayéra — Modern Hair Wellness",
      description,
      type: "website",
      url: siteConfig.url,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  assertProductionEnv();
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
