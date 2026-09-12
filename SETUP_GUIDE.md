# Mayéra deployment and first-owner setup

Mayéra now has two deliberate operating states:

- **Local storefront preview:** every public page and the checkout layout can be reviewed without Neon or Paystack. Payment remains disabled.
- **Live commerce platform:** Vercel connects to Neon PostgreSQL, applies the schema, and exposes a secure one-time `/setup` page for the real owner account and live launch catalogue.

There is no demo-data or `prisma:seed` step. Vercel itself does not create an administrator: it hosts the application. The Mayéra `/setup` page creates the first owner inside the connected production database.

## 1. Local preview, including checkout

Stop any running development server with `Ctrl+C`. In PowerShell, from the Mayéra project folder, run:

```powershell
Copy-Item .env.example .env.local -Force
pnpm install
pnpm dev:clean
```

Open <http://localhost:3000> and <http://localhost:3000/checkout>.

The checkout form and order summary will render. A notice explains that payment is disabled because the preview has no production database or Paystack key. This is intentional; the page must never pretend that an order or payment succeeded.

The sample environment file contains blank security values. Older text such as `replace-with-64-hex-characters` is also treated as unconfigured instead of crashing the checkout.

## 2. Create a private GitHub repository

Create a new private repository on GitHub without adding a README, `.gitignore` or license. Then run these commands in PowerShell from the Mayéra project folder, replacing the repository address:

```powershell
git init
git branch -M main
git add .
git status
git commit -m "Initial Mayéra platform"
git remote add origin https://github.com/YOUR_USERNAME/mayera.git
git push -u origin main
```

Before committing, confirm that `.env.local`, `.next` and `node_modules` are not listed by `git status`. The included `.gitignore` excludes them. Never put database URLs, Paystack keys, owner passwords or security tokens in GitHub.

GitHub reference: <https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories>

## 3. Create Neon PostgreSQL and import GitHub into Vercel

1. At <https://console.neon.tech>, create the production Neon project and database. Keep its generated role, password and database name; do not invent replacements.
2. In Neon, open the project's **Connect** panel. Copy the pooled connection string for `DATABASE_URL`, then turn pooling off and copy the direct connection string for `DIRECT_URL`.
3. In Vercel, create a new project and import the private GitHub repository.
4. Keep the detected framework as **Next.js** and the root directory as the repository root.
5. Before selecting **Deploy**, add both Neon URLs and the environment variables below for **Production**.

Alternatively, Vercel's Neon Marketplace integration can create or link the Neon account. Whichever path you use, verify that Vercel contains both the pooled and direct URLs with the exact variable names shown here before the first deployment.

The pooled URL is used by the live Vercel functions. The direct URL is used by Prisma's deployment migration. Keep the SSL query parameters supplied by Neon. The project includes a `vercel-build` command: Vercel runs Prisma's production migration before building Next.js, so the database tables are created from the committed migration. No demo-data command runs.

## 4. Generate and add the Vercel security values

On your computer, run:

```powershell
pnpm secrets:generate
```

The command prints three fresh values:

```text
AUTH_SECRET=
FIELD_ENCRYPTION_KEY=
MAYERA_SETUP_TOKEN=
```

Copy them into Vercel's project environment settings. Do not put them in GitHub. Add these production values:

```text
DATABASE_URL=the pooled connection string supplied by Neon
DIRECT_URL=the direct/unpooled connection string supplied by Neon
AUTH_SECRET=the generated authentication secret
FIELD_ENCRYPTION_KEY=the generated 64-character encryption key
MAYERA_SETUP_TOKEN=the generated one-time setup token
NEXT_PUBLIC_SITE_URL=https://YOUR-VERCEL-DOMAIN
NEXT_PUBLIC_SUPPORT_EMAIL=
NEXT_PUBLIC_SUPPORT_PHONE=
PAYSTACK_SECRET_KEY=sk_test_... or the live key when launch testing is complete
PAYSTACK_CALLBACK_URL=https://YOUR-VERCEL-DOMAIN/checkout/success
```

Also add email and object-storage values from `.env.example` when those services are ready. Use Neon's exact connection strings; do not invent a PostgreSQL password or remove its SSL settings.

Deploy the project. A successful deployment confirms that the migration and Next.js build completed.

Vercel references:

- Git deployments: <https://vercel.com/docs/git>
- Environment variables: <https://vercel.com/docs/environment-variables>
- Neon Postgres integration: <https://vercel.com/marketplace/neon>
- Neon Prisma guide: <https://neon.tech/docs/guides/prisma>

## 5. Create the real owner—without seed data

After the first successful deployment, open:

```text
https://YOUR-VERCEL-DOMAIN/setup
```

Enter:

- the private `MAYERA_SETUP_TOKEN` generated above;
- the real owner's first name, last name and email; and
- a private password of at least 12 characters containing upper-case, lower-case, number and symbol characters.

The next step generates an authenticator key in the browser. Add it manually to Google Authenticator, Microsoft Authenticator, 1Password or another TOTP application, then enter the current six-digit code. The server verifies that code before it creates the owner.

The same atomic operation installs only the real launch content already approved for the website:

- Hair Oil;
- Hair Butter;
- Hair Mask;
- Hair Bundle;
- the requested expandable category hierarchy;
- the existing Mayéra Hair Journal content; and
- operational permissions and settings.

Product inventory starts at **zero** because no real stock quantity was supplied. This prevents an invented stock count from reaching the live checkout. After owner creation, enter verified stock at `/admin/inventory` before accepting orders.

As soon as setup succeeds:

1. Remove `MAYERA_SETUP_TOKEN` from Vercel.
2. Redeploy the current project so the token is no longer present in the runtime.
3. Keep the owner password and authenticator account private.

The `/setup` endpoint also locks permanently as soon as any privileged account exists, so it cannot create a second owner.

## 6. Sign in and prepare checkout

Use either address:

- Client admin: `https://YOUR-VERCEL-DOMAIN/admin`
- Super-admin: `https://YOUR-VERCEL-DOMAIN/super-admin`

Enter the owner email, password and current six-digit authenticator code. The first owner can use both portals and can create separate staff accounts at `/super-admin/admins`.

Before accepting a real payment:

1. Enter the verified Hair Oil stock at `/admin/inventory`.
2. Confirm prices and publication states at `/admin/products`.
3. Configure Paystack in Vercel.
4. Register `https://YOUR-VERCEL-DOMAIN/api/webhooks/paystack` in Paystack.
5. Complete a full Paystack test-mode order and refund.
6. Switch to a live Paystack key only after the test passes.

The checkout page remains visible when these services are not configured, but its payment button stays disabled with an accurate explanation.

## 7. Future updates

Push changes to the connected GitHub production branch:

```powershell
git add .
git commit -m "Describe the Mayéra update"
git push
```

Vercel creates a new deployment. Existing products, orders, customers, staff accounts and settings remain in PostgreSQL; deployments do not replace them. The one-time launch installation never runs again after an owner exists.

## Troubleshooting

| Symptom | Cause | Resolution |
| --- | --- | --- |
| Checkout shows “This page could not be prepared” with an invalid `FIELD_ENCRYPTION_KEY` | An older sample placeholder was parsed as a real key | Use this corrected project; copy the new `.env.example` and restart with `pnpm dev:clean` |
| Checkout is visible but payment is disabled | Database or Paystack is not configured | This is correct for local preview; configure both in Vercel for live payment |
| Vercel build reports a database connection error | A Neon URL is missing, rejected or unreachable | Set pooled `DATABASE_URL` and direct `DIRECT_URL` with their supplied SSL settings, then redeploy |
| `/setup` says the schema is not ready | The production migration did not complete | Inspect the failed Vercel build, correct both Neon URLs, and redeploy |
| `/setup` says the setup token is missing | `MAYERA_SETUP_TOKEN` was not added | Generate it, add it to Vercel Production, and redeploy |
| `/setup` says setup is already complete | A privileged account already exists | Sign in at `/admin`; create later staff accounts from `/super-admin/admins` |
| Authenticator code fails | The code belongs to a different key or device time is incorrect | Use the key shown in the current setup session and confirm automatic device time |
| Product cannot be checked out | Its live stock is zero, unavailable, unpublished or unapproved | Enter verified stock and confirm the product gates in admin |
| Vercel still uses an old environment value | Environment changes do not alter an existing deployment | Redeploy after saving the corrected value |

Never share `.env.local`, a database URL, owner password, authenticator key, setup token, Paystack secret, encryption key or session secret in screenshots, chat messages or Git commits.
