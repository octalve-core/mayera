"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    setStatus("loading");
    const response = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, consent: true, source: "homepage" }) });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <Section className="bg-mayera-olive text-white">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-luxury text-white/70">Stay rooted</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">New products. Hair education. Mayéra stories.</h2>
          </div>
          <div>
            <p className="max-w-xl text-sm leading-7 text-white/72">Thoughtfully delivered — not every day, and not for the sake of filling your inbox.</p>
            <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <input id="newsletter-email" name="email" type="email" required placeholder="Your email address" className="min-h-12 flex-1 rounded-full border border-white/25 bg-white/10 px-5 text-sm text-white outline-none placeholder:text-white/55 focus:border-white/70" />
              <button type="submit" disabled={status === "loading"} className="min-h-12 rounded-full bg-white px-7 text-sm font-semibold text-mayera-espresso transition hover:bg-mayera-cream disabled:opacity-60">
                {status === "loading" ? "Joining..." : status === "success" ? "You're in" : "Join Mayéra"}
              </button>
            </form>
            {status === "error" ? <p role="alert" className="mt-3 text-sm text-white">We could not save your subscription. Please try again.</p> : null}
            <p className="mt-3 text-xs leading-5 text-white/60">By joining, you consent to receive Mayéra email updates. You can unsubscribe at any time.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
