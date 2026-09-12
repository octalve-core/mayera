# Mayéra commerce platform

Production-oriented ecommerce source for **Mayéra**, the consumer brand of **MAYERA LTD**. This repository contains the public store, the **My Mayéra** customer portal, the permission-controlled client admin, and the separate super-admin system layer.

The design uses Mayéra's exact supplied logo and the four exact supplied product images. No product pack is redrawn in HTML or CSS.

## Current catalogue

| Product | Store state | Price |
| --- | --- | ---: |
| Hair Oil | Available | ₦7,500 |
| Hair Butter | Coming soon | ₦7,500 |
| Hair Mask | Coming soon | To be announced |
| Hair Bundle (Oil + Butter + Mask) | Coming soon | To be announced |

The Hair Mask and three-item Hair Bundle intentionally have no price until Mayéra supplies one. Server checkout accepts only published, compliance-approved, in-stock products with a positive current database price.

## Catalogue categories

The expandable live hierarchy includes Hair, Haircare, Long Hair, Best Seller Haircare, Skincare, Best Seller Skin Care, Body Care, Eye Care, Lip Care, Weightloss, Diet Plan, Tea, Spa Product, Shop by Concern, Best Seller, and Deal of the Week.

Client admins can add, hide, reorder, nest, and assign future categories without code changes. Both the interface and server reject category cycles.

## Included applications

### Public store

- Homepage with the locked Mayéra section system and restrained cream, espresso, olive, sand, and amber palette
- Shop with four real-image products and category navigation
- Individual product pages with structured product data, benefits, directions, ingredients/compliance states, genuine verified-review states, shipping guidance, related products, wishlist, and mobile add-to-bag
- Hair education ecosystem, Our Story, Hair Journal, search, contact/FAQ, cart drawer, full cart, checkout, order tracking, and legal/service pages
- Persistent local cart with server-side price, availability, stock, discount, and delivery recalculation at checkout
- Responsive layouts from 320px upward, keyboard-accessible controls, global loading/error/not-found states, sitemap, robots, metadata, and optimized Next Image delivery

### My Mayéra customer portal

- Dashboard
- Order history and order details
- Shipment tracking and buy again
- Saved addresses
- Wishlist
- Verified review history and submission eligibility
- Profile and communication preferences
- Privacy/deletion request controls
- Support tickets

### Mayéra client admin

- Operational dashboard
- Products, prices, product images, publication/compliance gates, and product-category assignment
- Hierarchical categories for future catalogue growth
- Inventory, movements, reservations, and low-stock states
- Orders, controlled status transitions, shipment tracking, and permission-gated Paystack refunds
- Customers, internal notes, and tags
- Support inbox and contact messages
- Discounts and coupons
- Genuine-review moderation
- CMS content, FAQs, navigation/footer copy, homepage copy, and SEO defaults
- Media registration and direct S3/R2-compatible uploads
- Hair Journal publishing
- Analytics
- Delivery rates and settings

### Super admin

- System dashboard
- Admin creation, disablement, role changes, MFA resets, and forced logout
- Built-in and custom roles with a granular permission matrix
- Immutable audit history
- Payment/refund reconciliation views
- Integration and webhook inspection
- Database/configuration/email/storage/webhook health checks
- Session management
- Maintenance mode that replaces the public store while leaving account, checkout, admin, and recovery access available

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- pnpm
- Neon PostgreSQL
- Prisma
- Paystack server API and signed webhooks
- Resend-compatible transactional email queue
- S3-compatible object storage, including Cloudflare R2's S3 API

## Local setup

Follow **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for the complete Windows-friendly walkthrough, including public preview recovery, Neon, MFA owner login, GitHub and Vercel.

Requirements: Node.js 22.13 or newer and pnpm 10. Neon PostgreSQL is required for accounts, live checkout, admin and super-admin, but not for a public-store-only local preview.

```bash
cp .env.example .env.local
pnpm install
pnpm dev:clean
```

Open `http://localhost:3000`. With the blank sample environment, the public store and checkout layout render; checkout explains that payment is disabled until Neon and Paystack are connected. Placeholder sample values are treated as unconfigured and cannot crash the page.

For production, connect a Neon database through Vercel, provide its pooled `DATABASE_URL` and direct `DIRECT_URL`, add the generated security values, deploy, then open `/setup`. That secure one-time page creates the real owner with authenticator MFA and installs the exact Mayéra launch catalogue. There are no default credentials, owner credentials in environment variables, or seed command. See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for the exact Windows, GitHub, Neon, Vercel and owner-setup steps.

The public catalogue has a carefully limited file-backed fallback for design review when `DATABASE_URL` is absent. In local development it also recovers the public pages from a rejected or temporarily unavailable database connection and prints one clear warning. Production never masks a database failure. Accounts, live checkout, admin, and super-admin require PostgreSQL.

The administrator sign-in addresses are `/admin` and `/super-admin`. Both require the real owner email and password created at `/setup`, plus the current six-digit authenticator code. There are no default credentials.

## Payments

Set a Paystack test secret locally:

```text
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_CALLBACK_URL=http://localhost:3000/checkout/success
```

Register the following signed webhook endpoint in Paystack:

```text
https://YOUR-DOMAIN/api/webhooks/paystack
```

The server:

- creates idempotent pending orders from current database values;
- reserves inventory transactionally;
- initializes Paystack with the server-calculated total;
- verifies amount, currency, reference, and provider status;
- records payment events idempotently;
- reconciles successful payments and releases stale reservations;
- reconciles refund lifecycle events; and
- never stores raw card details.

Checkout remains disabled until the Paystack secret is configured. It does not simulate a successful payment.

## Transactional email

Configure:

```text
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

Payment confirmation messages are deduplicated and queued. Run the worker from a scheduler or queue runner:

```bash
pnpm email:send-queued
```

## Product and media storage

The four launch product images are already stored locally and used exactly as provided. To let admins upload future assets, configure a public S3-compatible bucket:

```text
OBJECT_STORAGE_ENDPOINT=https://ACCOUNT-ENDPOINT
OBJECT_STORAGE_BUCKET=mayera-media
OBJECT_STORAGE_ACCESS_KEY_ID=
OBJECT_STORAGE_SECRET_ACCESS_KEY=
OBJECT_STORAGE_PUBLIC_URL=https://PUBLIC-ASSET-DOMAIN
OBJECT_STORAGE_REGION=auto
```

The upload implementation uses SigV4, path-style bucket URLs, a 10 MB limit, randomized object keys, allow-listed raster MIME types, same-origin enforcement, RBAC, rate limiting, and audit logging. `OBJECT_STORAGE_ENDPOINT` must be an origin without a path. The public asset domain is automatically added to the Next Image allow-list at build time.

## Scheduled operations

Run these from a protected scheduler in production:

```bash
pnpm orders:release-expired
pnpm email:send-queued
```

The first releases inventory held by expired pending orders. The second sends queued transactional emails.

## Security model

- HTTP-only, secure-in-production, SameSite session cookies
- Only session-token hashes stored in PostgreSQL
- Strong password validation, slow password hashing, login throttling, lockout, and session expiry/revocation
- Mandatory encrypted TOTP MFA for privileged accounts
- Built-in RBAC plus database-backed custom roles/permissions
- Same-origin protection and rate limits on mutating APIs
- Server-only provider secrets
- Server-revalidated product prices, availability, claims approval, stock, delivery, and discounts
- Constant-time Paystack signature comparison
- Idempotent order/payment/webhook handling
- Append-only audit table protected by PostgreSQL update/delete triggers
- Sensitive integration configuration encrypted at rest
- No fabricated testimonials; only moderated reviews tied to delivered order items can be verified

In-memory rate limiting is suitable for a single process. For horizontally scaled production, replace the rate-limit adapter with a shared store such as managed Redis without changing the route contracts.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Or run all checks:

```bash
pnpm check
```

The automated tests protect the supplied logo/product asset hashes, four-product catalogue, no-guessed-price rule, required category set, route boundaries, checkout gates, webhook/refund handling, migration integrity, and audit immutability.

## Production configuration checklist

Before launch, supply and verify:

1. Production Neon pooled runtime URL and direct migration URL, with backups and restricted credentials.
2. Unique production session and field-encryption secrets.
3. Final public site URL and support email/phone/WhatsApp/Instagram details.
4. Live Paystack key, callback URL, signed webhook registration, and a complete test transaction/refund.
5. Resend credentials and verified sender domain.
6. S3/R2 bucket credentials, CORS policy, retention policy, and public asset domain.
7. Actual delivery prices, coverage, free-delivery decision, returns terms, privacy terms, and legal review.
8. Final Hair Mask and Hair Bundle price, stock, directions, ingredients, and compliance approval before making either available.
9. DNS, TLS, Cloudflare security controls, monitoring, error reporting, and scheduled jobs.

External credentials, legal/compliance approvals, provider accounts, and final business facts are deployment inputs; they are intentionally not guessed or committed.

## Deployment outline

1. Follow the exact GitHub and Vercel instructions in **[SETUP_GUIDE.md](SETUP_GUIDE.md)**.
2. Import the private GitHub repository into Vercel and add Neon `DATABASE_URL`/`DIRECT_URL` plus the generated production secrets.
3. Deploy. The repository's `vercel-build` command applies committed Prisma migrations and builds Next.js.
4. Visit `/setup` once to create the real MFA-protected owner and live launch catalogue.
5. Remove `MAYERA_SETUP_TOKEN` from Vercel and redeploy.
6. Enter verified inventory in admin, configure Paystack, and complete end-to-end test-mode checkout/refund tests before switching to live keys.
7. Run `pnpm check` in CI for later changes; normal deployments preserve all Neon data.

Do not expose `.env.local`, database credentials, Paystack keys, object-storage secrets, encryption keys, TOTP secrets, or generated session tokens.

## Project organization

Thin files in `src/app` map URLs to feature pages. Reusable design and commerce components live in `src/components`. Page sections and portal modules live in `src/features`. Database-backed domain logic and the guarded one-time launch initializer live in `src/server`. Prisma schema and migrations live in `prisma`. Run `pnpm tree` to regenerate `PROJECT_STRUCTURE.txt`.

Mayéra's public identity remains **Mayéra**; the legal company name is **MAYERA LTD**.
