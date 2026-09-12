import type { Metadata } from "next";
import CartPage from "@/features/cart/page";

export const metadata: Metadata = { title: "Your Bag" };
export default function Page() { return <CartPage />; }
