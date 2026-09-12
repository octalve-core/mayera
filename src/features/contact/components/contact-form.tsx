"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({})) as { message?: string };
    setStatus(response.ok ? "success" : "error");
    if (!response.ok) setError(result.message ?? "Something went wrong. Please try again.");
    if (response.ok) event.currentTarget.reset();
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Phone (optional)" name="phone" type="tel" />
      <Field label="Subject (optional)" name="subject" />
      <label className="block"><span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-mayera-espresso/58">How can we help?</span><textarea name="message" required rows={6} className="w-full rounded-[1.25rem] border border-mayera-line bg-white/65 px-4 py-3 text-sm outline-none focus:border-mayera-olive" /></label>
      <button type="submit" disabled={status === "loading"} className="min-h-12 rounded-full bg-mayera-espresso px-7 text-sm font-medium text-white disabled:opacity-50">{status === "loading" ? "Sending..." : "Send message"}</button>
      {status === "success" ? <p className="text-sm text-mayera-olive">Thank you. Your message has been received.</p> : null}
      {status === "error" ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label className="block"><span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-mayera-espresso/58">{label}</span><input name={name} type={type} required={required} className="h-12 w-full rounded-full border border-mayera-line bg-white/65 px-4 text-sm outline-none focus:border-mayera-olive" /></label>;
}
