import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { PrismaClient } from "@prisma/client";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) loadEnvFile(file);
}

function configuredValue(value) {
  const trimmed = value?.trim();
  return trimmed && !trimmed.toLowerCase().startsWith("replace-with-")
    ? trimmed
    : undefined;
}

const configured = {
  databaseUrl: Boolean(configuredValue(process.env.DATABASE_URL)),
  directUrl: Boolean(configuredValue(process.env.DIRECT_URL)),
  authSecret: Boolean(configuredValue(process.env.AUTH_SECRET)?.length >= 32),
  encryptionKey: Boolean(
    /^[a-fA-F0-9]{64}$/.test(
      configuredValue(process.env.FIELD_ENCRYPTION_KEY) ?? "",
    ),
  ),
  setupToken: Boolean(
    configuredValue(process.env.MAYERA_SETUP_TOKEN)?.length >= 32,
  ),
  paystack: Boolean(process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_")),
  email: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
  storage: Boolean(
    process.env.OBJECT_STORAGE_ENDPOINT &&
    process.env.OBJECT_STORAGE_BUCKET &&
    process.env.OBJECT_STORAGE_ACCESS_KEY_ID &&
    process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY &&
    process.env.OBJECT_STORAGE_PUBLIC_URL,
  ),
  support: Boolean(
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
    process.env.NEXT_PUBLIC_SUPPORT_PHONE,
  ),
};

let databaseConnection = false;
let databaseSchema = false;
let ownerAccount = false;

if (configured.databaseUrl) {
  const prisma = new PrismaClient({ log: [] });
  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseConnection = true;
    try {
      const owner = await prisma.user.findFirst({
        where: {
          role: { in: ["OWNER", "SUPER_ADMIN"] },
          status: "ACTIVE",
          passwordHash: { not: null },
          mfaEnabled: true,
          mfaSecretEncrypted: { not: null },
        },
        select: { id: true },
      });
      databaseSchema = true;
      ownerAccount = Boolean(owner);
    } catch {
      databaseSchema = false;
    }
  } catch {
    databaseConnection = false;
  } finally {
    await prisma.$disconnect();
  }
}

const requiredChecks = [
  ["Neon pooled runtime URL", configured.databaseUrl],
  ["Neon direct migration URL", configured.directUrl],
  ["PostgreSQL credentials and connection", databaseConnection],
  ["Database migration/schema", databaseSchema],
  ["MFA-protected owner account", ownerAccount],
  ["Session secret", configured.authSecret],
  ["Field encryption", configured.encryptionKey],
];

const optionalChecks = [
  ["Paystack payments", configured.paystack],
  ["Transactional email", configured.email],
  ["Object storage", configured.storage],
  ["Support contact", configured.support],
];

console.log("Mayéra setup check (credential values are never printed):");
for (const [label, ready] of requiredChecks) {
  console.log(`${ready ? "READY" : "NOT READY"}  ${label}`);
}
for (const [label, ready] of optionalChecks) {
  console.log(`${ready ? "READY" : "OPTIONAL — NOT CONFIGURED"}  ${label}`);
}

if (!configured.databaseUrl) {
  console.error(
    "\nThe public storefront preview is available, but accounts, checkout, admin and super-admin need PostgreSQL.",
  );
} else if (!databaseConnection) {
  console.error(
    "\nPostgreSQL rejected the connection. Correct DATABASE_URL and confirm that the server is reachable.",
  );
} else if (!databaseSchema) {
  console.error(
    "\nPostgreSQL is reachable, but the Mayéra schema is missing. Run: pnpm prisma:deploy",
  );
} else if (!ownerAccount) {
  console.error(
    configured.setupToken
      ? "\nNo active MFA-protected owner exists. Open /setup on the deployed site to create it."
      : "\nNo owner exists. Add MAYERA_SETUP_TOKEN in Vercel, redeploy, then open /setup.",
  );
} else if (configured.setupToken) {
  console.warn(
    "\nOwner setup is complete. Remove MAYERA_SETUP_TOKEN from Vercel and redeploy.",
  );
}

if (!requiredChecks.every(([, ready]) => ready)) {
  console.error(
    "Follow SETUP_GUIDE.md, then run this check again with: pnpm setup",
  );
  process.exitCode = 1;
}
