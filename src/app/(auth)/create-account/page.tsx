import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = { title: "Create My Mayéra", robots: { index: false, follow: false } };

export default function CreateAccountPage() {
  return <AuthShell eyebrow="My Mayéra" title="Create your account." description="Keep your orders, delivery details, wishlist and preferences together in one private space."><RegisterForm/></AuthShell>;
}
