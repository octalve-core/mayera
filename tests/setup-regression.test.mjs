import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("the sample environment contains blank, non-crashing connection and security values", () => {
  const example = readFileSync(".env.example", "utf8");
  assert.match(example, /^DATABASE_URL=$/m);
  assert.match(example, /^DIRECT_URL=$/m);
  assert.match(example, /^AUTH_SECRET=$/m);
  assert.match(example, /^FIELD_ENCRYPTION_KEY=$/m);
  assert.match(example, /^MAYERA_SETUP_TOKEN=$/m);
  assert.doesNotMatch(example, /replace-with-/i);
  assert.doesNotMatch(example, /postgres:postgres/i);
  assert.doesNotMatch(example, /MAYERA_OWNER_/);
});

test("placeholder values are normalized before strict environment validation", () => {
  const env = readFileSync("src/lib/env.ts", "utf8");
  assert.match(env, /startsWith\("replace-with-"\)/);
  assert.match(env, /FIELD_ENCRYPTION_KEY: optionalValue/);
  assert.match(env, /MAYERA_SETUP_TOKEN: optionalValue/);
});

test("local recovery has clean-cache and stable dev commands", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(packageJson.scripts.dev, "next dev --webpack");
  assert.equal(packageJson.scripts.clean, "node scripts/clean-next.mjs");
  assert.match(packageJson.scripts["dev:clean"], /pnpm clean/);
  assert.ok(existsSync("scripts/clean-next.mjs"));
});

test("checkout remains visible but cannot submit without live services", () => {
  const page = readFileSync("src/features/checkout/page.tsx", "utf8");
  const form = readFileSync("src/features/checkout/components/checkout-form.tsx", "utf8");
  assert.match(page, /Checkout preview is visible/);
  assert.match(page, /!env\.DATABASE_URL/);
  assert.match(page, /!env\.PAYSTACK_SECRET_KEY/);
  assert.match(form, /Boolean\(checkoutUnavailableReason\)/);
  assert.match(form, /role="status"/);
});

test("production uses Neon migrations and has no seed workflow", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const prismaConfig = readFileSync("prisma.config.ts", "utf8");
  const schema = readFileSync("prisma/schema.prisma", "utf8");
  assert.equal(packageJson.scripts["prisma:seed"], undefined);
  assert.match(packageJson.scripts["vercel-build"], /prisma migrate deploy/);
  assert.doesNotMatch(prismaConfig, /seed\s*:/);
  assert.equal(existsSync("prisma/seed.mjs"), false);
  assert.match(schema, /url\s*=\s*env\("DATABASE_URL"\)/);
  assert.match(schema, /directUrl\s*=\s*env\("DIRECT_URL"\)/);
});

test("one-time owner setup is locked, rate-limited, atomic and MFA-protected", () => {
  const route = readFileSync("src/app/api/setup/owner/route.ts", "utf8");
  const initializer = readFileSync("src/server/setup/launch-data.ts", "utf8");
  assert.match(route, /timingSafeEqual/);
  assert.match(route, /assertSameOrigin/);
  assert.match(route, /enforceRateLimit/);
  assert.match(route, /role: \{ not: UserRole\.CUSTOMER \}/);
  assert.match(route, /pg_advisory_xact_lock/);
  assert.match(route, /pg_advisory_xact_lock\(687235911\)::text/);
  assert.match(route, /verifyTotp/);
  assert.match(route, /TransactionIsolationLevel\.Serializable/);
  assert.match(initializer, /from "@\/data\/products"/);
  assert.match(initializer, /from "@\/data\/categories"/);
  assert.match(initializer, /available: 0/);
});

test("super-admin creates later staff with a fresh authenticator key", () => {
  const page = readFileSync("src/features/super-admin/admins/page.tsx", "utf8");
  const actions = readFileSync("src/features/super-admin/actions.ts", "utf8");
  assert.match(page, /generateTotpSecret/);
  assert.match(page, /defaultValue=\{newAdminTotpSecret\}/);
  assert.doesNotMatch(page, /pnpm secrets:generate/);
  assert.match(actions, /mfaSecretEncrypted:encryptField/);
  assert.match(actions, /mfaEnabled:true/);
});

test("setup check verifies the database, schema and real MFA owner", () => {
  const setup = readFileSync("scripts/setup-check.mjs", "utf8");
  assert.match(setup, /SELECT 1/);
  assert.match(setup, /prisma\.user\.findFirst/);
  assert.match(setup, /mfaEnabled: true/);
  assert.match(setup, /PostgreSQL credentials and connection/);
  assert.match(setup, /Database migration\/schema/);
  assert.match(setup, /MAYERA_SETUP_TOKEN/);
  assert.match(setup, /\/setup/);
});

test("the complete GitHub, Neon, Vercel and owner setup guide is included", () => {
  const guide = readFileSync("SETUP_GUIDE.md", "utf8");
  assert.match(guide, /## 1\. Local preview, including checkout/);
  assert.match(guide, /## 2\. Create a private GitHub repository/);
  assert.match(guide, /## 3\. Create Neon PostgreSQL and import GitHub into Vercel/);
  assert.match(guide, /## 5\. Create the real owner/);
  assert.match(guide, /DATABASE_URL=the pooled connection string supplied by Neon/);
  assert.match(guide, /DIRECT_URL=the direct\/unpooled connection string supplied by Neon/);
  assert.match(guide, /\/setup/);
  assert.match(guide, /\/super-admin/);
  assert.doesNotMatch(guide, /MAYERA_OWNER_/);
});
