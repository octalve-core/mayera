import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("public, customer, client-admin, and super-admin route boundaries exist", () => {
  const required = [
    "src/app/(store)/page.tsx",
    "src/app/(store)/shop/page.tsx",
    "src/app/(store)/shop/[slug]/page.tsx",
    "src/app/(store)/about/page.tsx",
    "src/app/(store)/products/[slug]/page.tsx",
    "src/app/(checkout)/checkout/page.tsx",
    "src/app/(account)/account/page.tsx",
    "src/app/(account)/account/support/page.tsx",
    "src/app/(admin)/admin/page.tsx",
    "src/app/(admin)/admin/products/page.tsx",
    "src/app/(admin)/admin/categories/page.tsx",
    "src/app/(admin)/admin/support/page.tsx",
    "src/app/(super-admin)/super-admin/page.tsx",
    "src/app/(super-admin)/super-admin/permissions/page.tsx",
    "src/app/(super-admin)/super-admin/system-health/page.tsx",
    "src/app/setup/page.tsx",
    "src/app/api/setup/owner/route.ts",
    "src/app/loading.tsx",
    "src/app/error.tsx"
  ];
  for (const path of required) assert.ok(existsSync(path), `${path} is missing`);
});

test("legacy storefront addresses redirect to current pages", () => {
  const about = readFileSync("src/app/(store)/about/page.tsx", "utf8");
  const shopAlias = readFileSync("src/app/(store)/shop/[slug]/page.tsx", "utf8");
  assert.match(about, /permanentRedirect\("\/our-story"\)/);
  assert.match(shopAlias, /"hair-oil": "\/products\/scalp-length-nourishing-oil"/);
  assert.match(shopAlias, /"hair-butter": "\/products\/moisture-strength-hair-butter"/);
  assert.match(shopAlias, /"hair-mask": "\/products\/moisture-repair-hair-mask"/);
  assert.match(shopAlias, /"hair-bundle": "\/products\/hair-care-bundle"/);
  assert.match(shopAlias, /slug === "hair"/);
  assert.match(shopAlias, /catalogueCategories\.some/);
});

test("checkout rejects unpublished, unapproved, unavailable, or zero-price products", () => {
  const checkout = readFileSync("src/server/checkout/service.ts", "utf8");
  assert.match(checkout, /priceKobo: \{ gt: 0 \}/);
  assert.match(checkout, /status: "PUBLISHED"/);
  assert.match(checkout, /claimStatus: "APPROVED"/);
  assert.match(checkout, /availability: "AVAILABLE"/);
  assert.match(checkout, /TransactionIsolationLevel\.Serializable/);
});

test("privileged routes, sessions, MFA, and mutating APIs retain security gates", () => {
  const proxy = readFileSync("src/proxy.ts", "utf8");
  const session = readFileSync("src/server/auth/session.ts", "utf8");
  const login = readFileSync("src/app/api/auth/login/route.ts", "utf8");
  assert.match(proxy, /\/account\/:path\*/);
  assert.match(proxy, /\/admin\/:path\*/);
  assert.match(proxy, /\/super-admin\/:path\*/);
  assert.match(session, /httpOnly: true/);
  assert.match(session, /sameSite: "lax"/);
  assert.match(session, /mfaEnabled/);
  assert.match(login, /assertSameOrigin/);
  assert.match(login, /enforceRateLimit/);
  assert.match(login, /verifyTotp/);
});

test("database failures produce an actionable service response", () => {
  const request = readFileSync("src/server/security/request.ts", "utf8");
  assert.match(request, /databaseUnavailable \? 503/);
  assert.match(request, /The database is not ready/);
  assert.match(request, /P1000/);
});

test("Paystack events are signed, idempotent, and include refund reconciliation", () => {
  const webhook = readFileSync("src/app/api/webhooks/paystack/route.ts", "utf8");
  const paystack = readFileSync("src/server/payments/paystack.ts", "utf8");
  assert.match(webhook, /x-paystack-signature/);
  assert.match(paystack, /timingSafeEqual/);
  assert.match(webhook, /refund\.processed/);
  assert.match(webhook, /refund\.failed/);
  assert.match(paystack, /\/refund/);
});
