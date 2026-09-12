import type { Metadata } from "next";
import JournalPage from "@/features/journal/page";
export const metadata: Metadata = { title: "Hair Journal" };
export const dynamic = "force-dynamic";
export default function Page() { return <JournalPage />; }
