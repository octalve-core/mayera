import type { Metadata } from "next";
import OurStoryPage from "@/features/our-story/page";
export const metadata: Metadata = { title: "Our Story" };
export default function Page() { return <OurStoryPage />; }
