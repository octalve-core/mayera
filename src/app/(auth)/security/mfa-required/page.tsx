import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export default function MfaRequiredPage() {
  return <AuthShell eyebrow="Security requirement" title="MFA must be enabled." description="Mayéra does not permit privileged access without multi-factor authentication."><div className="rounded-2xl border border-mayera-line bg-mayera-cream p-5 text-sm leading-7 text-mayera-espresso/65">Ask an authorised super administrator to complete or reset your MFA enrolment before signing in again.</div><Link href="/sign-in?mode=admin" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-mayera-espresso px-6 text-sm text-white">Return to secure sign in</Link></AuthShell>;
}
