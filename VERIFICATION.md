# Mayéra delivery verification

Verified on 12 September 2026 (UTC).

## Delivered scope

- Responsive public storefront, search, category filtering, product detail, cart, checkout, order tracking, legal/help pages, contact, and Hair Journal.
- Customer account area (My Mayéra) for profile, addresses, orders, wishlist, reviews, support, and privacy controls.
- Client-admin area for products, categories, inventory, orders, delivery, discounts, customers, reviews, support, journal, media, content, analytics, and settings.
- Super-admin area for admins, roles, permissions, sessions, integrations, payments, webhooks, audit logs, system health, and settings.
- Server-side authentication, role/permission checks, MFA enforcement, encrypted sensitive fields, rate limits, audit events, Paystack payment handling, inventory reservations, email queueing, and S3/R2-compatible media storage.

## Confirmed catalogue

| Product | Store state | Displayed price | Supplied image |
| --- | --- | ---: | --- |
| Scalp + Length Nourishing Oil | Available | ₦7,500 | `hair-oil.png` |
| Moisture + Strength Hair Butter | Coming soon | ₦7,500 | `hair-butter.png` |
| Moisture + Repair Hair Mask | Coming soon | Price to be announced | `hair-mask.png` |
| Mayéra Hair Bundle | Coming soon | Price to be announced | `hair-bundle.png` |

No unprovided price was invented. Products with no confirmed price cannot be added to the bag or sent to checkout.

## Exact supplied asset checksums

```text
d168506d84fb28d60fd576cfc07bea849ff137e9d3f615a0e31ac5dedc4b1166  public/brand/logo/mayera-logo.png
9a52905221327ead866641b1edadc73dae0ebdaedddf527811cc6021d74a3446  public/images/products/hair-oil.png
679290b1d565e0e7d7ec281597e4026b23544db0ee4e094a34819392e205537f  public/images/products/hair-butter.png
15059f704432548362ea7025c49bb1b2f761326e6f9aa12a41e94ba646b79545  public/images/products/hair-mask.png
7537e225bec30183d5f4b46729f1b3c646b29de36d83cf6527d1207d2a884e38  public/images/products/hair-bundle.png
```

These hashes match the uploaded files byte for byte.

## Quality gates passed

- TypeScript type-check: passed.
- ESLint with zero warnings: passed.
- Automated tests: 24 passed, 0 failed.
- Prisma schema/client generation and initial-migration structural checks: passed.
- Next.js optimized production build: passed for the full public, account, admin, super-admin, and API route set.
- Checkout regression: with the exact obsolete `FIELD_ENCRYPTION_KEY=replace-with-64-hex-characters` value from the reported log, `/checkout` returned HTTP 200, rendered the complete checkout layout and displayed the honest database-configuration notice; the global error screen was absent.
- Live development-route audit: `/`, `/shop`, `/cart`, `/checkout`, and `/setup` each returned HTTP 200. With no live services, the setup API returned the intended HTTP 503 and did not create data.
- Neon configuration audit: Prisma accepts separate pooled `DATABASE_URL` and direct migration `DIRECT_URL` values; the Vercel build command runs the committed migration before the Next.js build.
- First-owner audit: `/setup` is same-origin protected, rate-limited, setup-token protected, authenticator-verified, atomically locked against a second owner, and initializes the exact catalogue with zero assumed inventory.
- Original local failure regression: with a deliberately unreachable PostgreSQL URL, `/`, `/shop`, `/hair`, `/hair-journal`, `/about`, `/shop/hair`, and the four `/shop/hair-*` compatibility addresses all rendered usable HTTP 200 pages; neither the home nor shop response contained the global error screen.
- Database recovery audit: public pages switched to the bundled catalogue, exactly one actionable warning was logged, and admin login returned HTTP 503 with database migration/first-owner guidance instead of a generic HTTP 500.
- Previous full HTTP smoke audit: 18 storefront/help pages returned HTTP 200; all four product images returned the exact expected bytes and PNG content type.
- Catalogue audit: exactly four unique product routes; all required future category groups present; search and Haircare filtering checked; no legacy two-item duo or visible zero price.
- Access-boundary audit: account, admin, and super-admin routes redirect unauthenticated users to the correct sign-in flow; a cross-origin-protected registration request without an Origin header is rejected.
- Responsive/accessibility audit: narrow-screen navigation and search sizing, reduced-motion handling, focus-visible states, semantic labels, dialog metadata, Escape-to-close behavior, and scroll locking checked in code and runtime markup.

## Reported issue and completed repair

The earlier supplied 2,324-line development log and the latest checkout trace were reviewed in full. The original public-page error boundary was triggered by rejected PostgreSQL credentials while `DATABASE_URL` was present. The latest checkout error had a different exact cause: the copied sample value for `FIELD_ENCRYPTION_KEY` was not a 64-character hexadecimal key, so strict environment validation stopped the checkout page. Separate 404 entries identified the legacy `/about`, `/shop/hair`, and `/shop/hair-oil` addresses. Firefox also reported stale development chunks, Next.js reported the smooth-scroll marker, and Grammarly injected the two hydration-only body attributes.

The corrected delivery now:

- uses bundled catalogue/content data for recoverable database connection or migration failures in local development only;
- preserves strict production failure behavior so a live database problem cannot be silently hidden;
- returns an actionable HTTP 503 from database-dependent APIs;
- includes redirects for the recorded legacy addresses, all four product aliases, and future catalogue category slugs;
- defaults local development to Webpack and includes a safe `.next` cache cleaner;
- includes the Next.js smooth-scroll marker and suppresses the specific extension-injected body hydration warning; and
- treats blank or old `replace-with-...` security samples as unconfigured, allowing the checkout preview to render safely;
- removes the old database seed file, command and owner environment variables;
- provides a guarded one-time `/setup` flow for the real MFA-protected owner and exact live catalogue; and
- provides `SETUP_GUIDE.md` with public preview, GitHub, Neon, Vercel, owner MFA, inventory and Paystack instructions.

## Environment-dependent launch checks

This workspace does not contain the owner's Neon account, production connection strings, Vercel project, Paystack keys, email provider keys, object-storage credentials, support details, verified stock count, or final legal/product approvals. Consequently, a live Neon migration, real owner account, real admin login and provider transactions are not claimed as completed. Follow `SETUP_GUIDE.md`, deploy with the Neon URLs, create the owner once at `/setup`, remove the setup token, enter verified inventory, and complete Paystack test-mode checkout/refund testing before enabling production payments.
