import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env";
import type { Prisma } from "@prisma/client";

type EmailInput = {
  dedupeKey?: string;
  to: string;
  subject: string;
  template: string;
  html: string;
  payload?: Prisma.InputJsonObject;
};

export async function sendEmail(input: EmailInput) {
  const payload = { ...(input.payload ?? {}), html: input.html };
  const message = input.dedupeKey
    ? await prisma.emailMessage.upsert({
      where: { dedupeKey: input.dedupeKey },
      create: { dedupeKey: input.dedupeKey, to: input.to, subject: input.subject, template: input.template, payload },
      update: {}
    })
    : await prisma.emailMessage.create({ data: { to: input.to, subject: input.subject, template: input.template, payload } });
  if (message.status === "SENT") return { queued: false, messageId: message.id };
  const env = serverEnv();
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) return { queued: true, messageId: message.id };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to: [input.to], subject: input.subject, html: input.html })
    });
    const result = await response.json() as { id?: string; message?: string };
    if (!response.ok || !result.id) throw new Error(result.message ?? "Email provider rejected the message");
    await prisma.emailMessage.update({ where: { id: message.id }, data: { status: "SENT", providerId: result.id, sentAt: new Date(), attempts: { increment: 1 } } });
    return { queued: false, messageId: message.id };
  } catch (error) {
    await prisma.emailMessage.update({ where: { id: message.id }, data: { status: "FAILED", attempts: { increment: 1 }, lastError: error instanceof Error ? error.message.slice(0, 1000) : "Unknown email error" } });
    throw error;
  }
}
