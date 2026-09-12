import type { Metadata } from "next";
import SetupPage from "@/features/setup/page";

export const metadata: Metadata = { title: "First owner setup", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default SetupPage;
