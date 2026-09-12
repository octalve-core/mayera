import AccountSupportPage from "@/features/account/support/page";

export default async function Page({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  return <AccountSupportPage sent={sent === "1"} />;
}
