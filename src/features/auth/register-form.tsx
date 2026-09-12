"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email: form.get("email"),
          password: form.get("password"),
          marketingEmailConsent: form.get("marketing") === "on",
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        redirectTo?: string;
      };
      if (!response.ok || !result.redirectTo)
        throw new Error(result.message ?? "Unable to create the account.");
      router.push(result.redirectTo);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to create the account.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" autoComplete="given-name" />
        <Field label="Last name" name="lastName" autoComplete="family-name" />
      </div>
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
        autoComplete="new-password"
      />
      <p className="text-xs leading-5 text-mayera-espresso/50">
        At least 12 characters, including upper-case, lower-case, a number and a
        symbol.
      </p>
      <label className="flex items-start gap-3 text-sm text-mayera-espresso/65">
        <input type="checkbox" name="marketing" className="mt-1" />
        Send me occasional product education and launch updates. Order messages
        are sent separately.
      </label>
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
        className="flex min-h-12 w-full items-center justify-center rounded-full bg-mayera-espresso px-6 text-sm font-medium text-white disabled:opacity-60"
      >
        {busy ? "Creating account…" : "Create My Mayéra"}
      </button>
      <p className="text-center text-sm text-mayera-espresso/55">
        Already registered?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-mayera-espresso underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
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
