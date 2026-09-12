import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { serverEnv } from "@/lib/env";
import { hasPrivilegedAccount } from "@/server/setup/status";
import { OwnerSetupForm } from "./setup-form";

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-[1.5rem] border border-mayera-line bg-mayera-cream/55 p-5"><h2 className="font-serif text-2xl">{title}</h2><div className="mt-3 text-sm leading-7 text-mayera-espresso/65">{children}</div></section>;
}

export default async function SetupPage() {
  let env: ReturnType<typeof serverEnv>;
  try {
    env = serverEnv();
  } catch {
    return <AuthShell eyebrow="Secure first run" title="Correct the server settings." description="One or more security values have the wrong format."><Notice title="Environment validation failed"><p>Generate fresh values with <code>pnpm secrets:generate</code>, replace the invalid Vercel environment values, and redeploy. Values are never displayed on this page.</p></Notice></AuthShell>;
  }

  const missingCore = [
    !env.DATABASE_URL && "DATABASE_URL",
    !env.AUTH_SECRET && "AUTH_SECRET",
    !env.FIELD_ENCRYPTION_KEY && "FIELD_ENCRYPTION_KEY"
  ].filter(Boolean) as string[];

  if (missingCore.length) {
    return <AuthShell eyebrow="Secure first run" title="Connect the live database first." description="The storefront preview can run without these values, but owner login and checkout cannot."><Notice title="Required before owner setup"><p>Add these values in Vercel and redeploy:</p><ul className="mt-3 list-disc space-y-1 pl-5">{missingCore.map((key) => <li key={key}><code>{key}</code></li>)}</ul></Notice></AuthShell>;
  }

  let setupComplete = false;
  try {
    setupComplete = await hasPrivilegedAccount();
  } catch {
    return <AuthShell eyebrow="Secure first run" title="The database is not ready." description="The connection or schema could not be verified."><Notice title="Finish the deployment"><p>Confirm the pooled <code>DATABASE_URL</code> and direct <code>DIRECT_URL</code> supplied by Neon, then redeploy so <code>prisma migrate deploy</code> can create the schema. Return to this page after the Vercel deployment succeeds.</p></Notice></AuthShell>;
  }

  if (setupComplete) {
    return <AuthShell eyebrow="Setup protected" title="The first owner already exists." description="For security, this one-time setup cannot create another privileged account."><Notice title="Continue securely"><p>Sign in with the owner email, password and current authenticator code.</p><Link href="/admin" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-mayera-espresso px-6 text-sm font-medium text-white">Go to admin sign in</Link></Notice></AuthShell>;
  }

  if (!env.MAYERA_SETUP_TOKEN) {
    return <AuthShell eyebrow="Secure first run" title="Enable the one-time setup." description="The database is ready, but owner creation is locked until a setup token is present."><Notice title="One Vercel setting remains"><p>Generate a private token with <code>pnpm secrets:generate</code>, add <code>MAYERA_SETUP_TOKEN</code> to Vercel, and redeploy. Then return to <code>/setup</code>.</p></Notice></AuthShell>;
  }

  return <AuthShell eyebrow="Secure first run" title="Create the Mayéra owner." description="This one-time process creates the real owner account and installs the exact four-product Mayéra launch catalogue—not demo records."><OwnerSetupForm /></AuthShell>;
}
