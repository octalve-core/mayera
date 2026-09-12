import { CheckoutSuccessClient } from "@/features/checkout/success/success-client";
export default async function Page({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference } = await searchParams;
  return <CheckoutSuccessClient reference={reference} />;
}
