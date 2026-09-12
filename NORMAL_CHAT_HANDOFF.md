# Continue Mayéra in a normal ChatGPT chat

Attach the latest Mayéra ZIP to the new normal chat and send this exact message:

> Read `NORMAL_CHAT_HANDOFF.md`, `README.md`, `SETUP_GUIDE.md`, and `VERIFICATION.md` completely before changing anything. Continue from the verified state in this ZIP. Do not guess product facts, prices, stock, credentials, legal terms, or provider settings.

## Verified project decisions

- Public brand: **Mayéra**. Legal company: **MAYERA LTD**.
- The supplied Mayéra logo and four supplied product images are exact protected assets. Do not redraw, replace, or approximate them.
- Shop products: Hair Oil, Hair Butter, Hair Mask, and Hair Bundle.
- Hair Oil is ₦7,500 and available in the bundled public catalogue.
- Hair Butter is ₦7,500 and coming soon.
- Hair Mask and Hair Bundle remain coming soon with no invented price.
- The category system is database-backed, hierarchical, editable in admin, and ready for future product groups.
- Hosting path: private GitHub repository → Vercel → Neon PostgreSQL.
- Neon pooled connection string is `DATABASE_URL`; Neon direct/unpooled connection string is `DIRECT_URL` for Prisma migrations.
- There is no seed command and no default administrator.
- The one-time `/setup` page creates the real owner, enrols authenticator MFA, and installs only the exact launch catalogue. Inventory starts at zero until verified stock is entered in admin.
- After setup, remove `MAYERA_SETUP_TOKEN` from Vercel and redeploy.
- Admin sign-in is `/admin`; owner-level system access is `/super-admin`.
- Checkout renders locally without Neon or Paystack, but payment is truthfully disabled until both are configured.

## Checkout failure that was repaired

The reported checkout error was caused by this obsolete placeholder being parsed as a real key:

```text
FIELD_ENCRYPTION_KEY=replace-with-64-hex-characters
```

The corrected `.env.example` leaves security values blank, and the environment loader also treats older `replace-with-...` values as unconfigured. Therefore `/checkout` renders its preview instead of entering the global error boundary.

## Rules for any future change

1. Inspect the current code and logs first.
2. Preserve all existing user work and exact supplied image files.
3. Do not add mock testimonials, fake orders, invented inventory, guessed prices, default passwords, or environment-stored owner credentials.
4. Keep secrets out of GitHub and screenshots.
5. Run `pnpm check` and relevant HTTP route checks before returning a replacement ZIP.
6. Report anything that requires the user's real provider account or business decision as an external setup step, not as completed.

## First deployment

Follow `SETUP_GUIDE.md` in order. It contains the exact PowerShell, GitHub, Vercel, Neon, `/setup`, inventory, and Paystack steps. Do not use an older guide or run any database seed command.
