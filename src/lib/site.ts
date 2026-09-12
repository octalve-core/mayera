export const siteConfig = {
  name: "Mayéra",
  legalName: "MAYERA LTD",
  description:
    "Modern hair wellness for textured hair. Nourish. Protect. Retain.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || null,
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || null,
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || null,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  locale: "en-NG",
  currency: "NGN",
};
