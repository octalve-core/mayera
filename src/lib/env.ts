import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  FIELD_ENCRYPTION_KEY: z.string().regex(/^[a-fA-F0-9]{64}$/).optional(),
  MAYERA_SETUP_TOKEN: z.string().min(32).optional(),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(720).default(168),
  PAYSTACK_SECRET_KEY: z.string().startsWith("sk_").optional(),
  PAYSTACK_CALLBACK_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  OBJECT_STORAGE_ENDPOINT: z.string().url().optional(),
  OBJECT_STORAGE_BUCKET: z.string().min(1).optional(),
  OBJECT_STORAGE_ACCESS_KEY_ID: z.string().min(1).optional(),
  OBJECT_STORAGE_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  OBJECT_STORAGE_PUBLIC_URL: z.string().url().optional(),
  OBJECT_STORAGE_REGION: z.string().min(1).default("auto"),
  MAYERA_STANDARD_DELIVERY_KOBO: z.coerce.number().int().min(0).default(250000),
  MAYERA_FREE_DELIVERY_THRESHOLD_KOBO: z.coerce.number().int().min(0).default(2500000),
  MAYERA_FREE_DELIVERY_ENABLED: z.enum(["true", "false"]).default("false")
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | undefined;

function optionalValue(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.toLowerCase().startsWith("replace-with-")) return undefined;
  return trimmed;
}

export function serverEnv(): ServerEnv {
  if (!cached) {
    const values = {
      DATABASE_URL: optionalValue(process.env.DATABASE_URL),
      AUTH_SECRET: optionalValue(process.env.AUTH_SECRET),
      FIELD_ENCRYPTION_KEY: optionalValue(process.env.FIELD_ENCRYPTION_KEY),
      MAYERA_SETUP_TOKEN: optionalValue(process.env.MAYERA_SETUP_TOKEN),
      SESSION_TTL_HOURS: process.env.SESSION_TTL_HOURS,
      PAYSTACK_SECRET_KEY: optionalValue(process.env.PAYSTACK_SECRET_KEY),
      PAYSTACK_CALLBACK_URL: optionalValue(process.env.PAYSTACK_CALLBACK_URL),
      RESEND_API_KEY: optionalValue(process.env.RESEND_API_KEY),
      RESEND_FROM_EMAIL: optionalValue(process.env.RESEND_FROM_EMAIL),
      OBJECT_STORAGE_ENDPOINT: optionalValue(process.env.OBJECT_STORAGE_ENDPOINT),
      OBJECT_STORAGE_BUCKET: optionalValue(process.env.OBJECT_STORAGE_BUCKET),
      OBJECT_STORAGE_ACCESS_KEY_ID: optionalValue(process.env.OBJECT_STORAGE_ACCESS_KEY_ID),
      OBJECT_STORAGE_SECRET_ACCESS_KEY: optionalValue(process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY),
      OBJECT_STORAGE_PUBLIC_URL: optionalValue(process.env.OBJECT_STORAGE_PUBLIC_URL),
      OBJECT_STORAGE_REGION: process.env.OBJECT_STORAGE_REGION,
      MAYERA_STANDARD_DELIVERY_KOBO: process.env.MAYERA_STANDARD_DELIVERY_KOBO,
      MAYERA_FREE_DELIVERY_THRESHOLD_KOBO: process.env.MAYERA_FREE_DELIVERY_THRESHOLD_KOBO,
      MAYERA_FREE_DELIVERY_ENABLED: process.env.MAYERA_FREE_DELIVERY_ENABLED
    };
    cached = serverSchema.parse(values);
  }
  return cached;
}

export function assertProductionEnv() {
  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PHASE === "phase-production-build") return;
  const env = serverEnv();
  const missing = [
    !env.DATABASE_URL && "DATABASE_URL",
    !env.AUTH_SECRET && "AUTH_SECRET",
    !env.FIELD_ENCRYPTION_KEY && "FIELD_ENCRYPTION_KEY"
  ].filter(Boolean);
  if (missing.length) throw new Error(`Missing production environment variables: ${missing.join(", ")}`);
}
