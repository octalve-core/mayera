import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/features/auth/sign-in-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ mode?: string; next?: string }> }) {
  const query = await searchParams;
  const adminMode = query.mode === "admin";
  return <AuthShell eyebrow={adminMode ? "Authorised team access" : "My Mayéra"} title={adminMode ? "Admin sign in" : "Welcome back."} description={adminMode ? "Privileged access requires your password and six-digit authenticator code." : "View orders, saved products, addresses and communication preferences."}><SignInForm adminMode={adminMode} nextPath={query.next}/></AuthShell>;
}
