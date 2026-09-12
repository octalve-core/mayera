"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type OwnerDetails = {
  setupToken: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function OwnerSetupForm() {
  const [stage, setStage] = useState<"identity" | "authenticator" | "complete">("identity");
  const [owner, setOwner] = useState<OwnerDetails | null>(null);
  const [totpSecret, setTotpSecret] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function post(body: Record<string, string>) {
    const response = await fetch("/api/setup/owner", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const result = await response.json() as { message?: string; totpSecret?: string; totpUri?: string; redirectTo?: string };
    if (!response.ok) throw new Error(result.message ?? "Owner setup could not be completed.");
    return result;
  }

  async function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const details: OwnerDetails = {
      setupToken: String(form.get("setupToken") ?? ""),
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? "")
    };
    try {
      const result = await post({ action: "start", ...details });
      if (!result.totpSecret || !result.totpUri) throw new Error("The authenticator setup could not be prepared.");
      setOwner(details);
      setTotpSecret(result.totpSecret);
      setTotpUri(result.totpUri);
      setStage("authenticator");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Owner setup could not be prepared.");
    } finally {
      setBusy(false);
    }
  }

  async function complete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!owner) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await post({ action: "complete", ...owner, totpSecret, totpCode: String(form.get("totpCode") ?? "") });
      setOwner(null);
      setTotpSecret("");
      setTotpUri("");
      setStage("complete");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Owner setup could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  if (stage === "complete") {
    return <section className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5"><h2 className="font-serif text-2xl text-emerald-950">Owner account created.</h2><p className="mt-3 text-sm leading-7 text-emerald-900/75">The live catalogue is installed. Remove <code>MAYERA_SETUP_TOKEN</code> from Vercel and redeploy, then use your email, password and authenticator code to sign in.</p><Link href="/admin" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-mayera-espresso px-6 text-sm font-medium text-white">Continue to admin</Link></section>;
  }

  if (stage === "authenticator") {
    return <form onSubmit={complete} className="space-y-5"><section className="rounded-[1.5rem] border border-mayera-line bg-mayera-cream/55 p-5"><p className="text-sm font-medium">Add Mayéra to your authenticator app</p><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-mayera-espresso/65"><li>Choose “enter setup key” or “manual entry”.</li><li>Account: <strong>Mayéra Owner</strong></li><li>Type: <strong>Time based</strong></li></ol><div className="mt-4 rounded-xl border border-mayera-line bg-white p-4"><p className="text-xs uppercase tracking-[.12em] text-mayera-espresso/50">Private setup key</p><code className="mt-2 block break-all text-sm font-semibold tracking-[.08em]">{totpSecret}</code><button type="button" onClick={() => navigator.clipboard.writeText(totpSecret)} className="mt-3 text-xs font-medium underline underline-offset-4">Copy key</button><a href={totpUri} className="ml-4 text-xs font-medium underline underline-offset-4">Open authenticator</a></div></section><Field label="Current six-digit code" name="totpCode" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required/>{error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}<button disabled={busy} className="min-h-12 w-full rounded-full bg-mayera-espresso px-6 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60">{busy ? "Creating secure owner…" : "Verify code and create owner"}</button><button type="button" onClick={() => { setStage("identity"); setOwner(null); setTotpSecret(""); setTotpUri(""); setError(""); }} className="w-full text-sm underline underline-offset-4">Start again</button></form>;
  }

  return <form onSubmit={start} className="space-y-5"><Field label="One-time Vercel setup token" name="setupToken" type="password" autoComplete="off" required/><div className="grid gap-4 sm:grid-cols-2"><Field label="First name" name="firstName" autoComplete="given-name" required/><Field label="Last name" name="lastName" autoComplete="family-name" required/></div><Field label="Owner email" name="email" type="email" autoComplete="email" required/><Field label="Private owner password" name="password" type="password" minLength={12} autoComplete="new-password" required/><Field label="Confirm password" name="confirmPassword" type="password" minLength={12} autoComplete="new-password" required/><p className="text-xs leading-6 text-mayera-espresso/52">Use at least 12 characters with upper-case, lower-case, number and symbol characters. The next step enrols mandatory authenticator MFA.</p>{error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}<button disabled={busy} className="min-h-12 w-full rounded-full bg-mayera-espresso px-6 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60">{busy ? "Checking secure setup…" : "Continue to authenticator"}</button></form>;
}

function Field({ label, name, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="block text-sm font-medium">{label}<input name={name} className="mt-2 min-h-12 w-full rounded-xl border border-mayera-line bg-white px-4 outline-none focus:border-mayera-olive focus:ring-2 focus:ring-mayera-olive/20" {...props}/></label>;
}
