"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SignInForm({
  adminMode,
  nextPath,
}: {
  adminMode: boolean;
  nextPath?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
          mfaCode: form.get("mfaCode") || undefined,
          next: nextPath,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        redirectTo?: string;
      };
      if (!response.ok || !result.redirectTo)
        throw new Error(result.message ?? "Unable to sign in.");
      router.push(result.redirectTo);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
      />
      {adminMode ? (
        <Field
          label="Authenticator code"
          name="mfaCode"
          inputMode="numeric"
          autoComplete="one-time-code"
        />
      ) : null}
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}
      <button
        disabled={busy}
        className="flex min-h-12 w-full items-center justify-center rounded-full bg-mayera-espresso px-6 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in securely"}
      </button>
      {!adminMode ? (
        <p className="text-center text-sm text-mayera-espresso/55">
          New to Mayéra?{" "}
          <Link
            href="/create-account"
            className="font-medium text-mayera-espresso underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  ...props
}: {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        required
        className="mt-2 min-h-12 w-full rounded-xl border border-mayera-line bg-white px-4 outline-none focus:border-mayera-olive focus:ring-2 focus:ring-mayera-olive/20"
        {...props}
      />
    </label>
  );
}
