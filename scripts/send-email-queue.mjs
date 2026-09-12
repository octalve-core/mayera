import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL;

async function main() {
  if (!apiKey || !from)
    throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL are required.");
  const messages = await prisma.emailMessage.findMany({
    where: { status: { in: ["QUEUED", "FAILED"] }, attempts: { lt: 5 } },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
  let sent = 0;
  for (const message of messages) {
    const payload =
      message.payload &&
      typeof message.payload === "object" &&
      !Array.isArray(message.payload)
        ? message.payload
        : {};
    const html = typeof payload.html === "string" ? payload.html : undefined;
    if (!html) {
      await prisma.emailMessage.update({
        where: { id: message.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
          lastError: "Queued message has no HTML body.",
        },
      });
      continue;
    }
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [message.to],
          subject: message.subject,
          html,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.id)
        throw new Error(
          result.message || "Email provider rejected the message.",
        );
      await prisma.emailMessage.update({
        where: { id: message.id },
        data: {
          status: "SENT",
          providerId: result.id,
          sentAt: new Date(),
          attempts: { increment: 1 },
          lastError: null,
        },
      });
      sent += 1;
    } catch (error) {
      await prisma.emailMessage.update({
        where: { id: message.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
          lastError:
            error instanceof Error
              ? error.message.slice(0, 1000)
              : "Unknown email error",
        },
      });
    }
  }
  console.log(`Sent ${sent} of ${messages.length} queued Mayéra email(s).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
