import { Prisma, PrismaClient } from "@prisma/client";
import { serverEnv } from "@/lib/env";

export type ShippingAddress = { city: string; state: string; country: string };
export type ShippingQuote = { provider: string; service: string; amountKobo: number; estimatedDays: string };
type Database = PrismaClient | Prisma.TransactionClient;

export async function quoteShipping(database: Database, address: ShippingAddress, subtotalKobo: number): Promise<ShippingQuote> {
  if (address.country.toLowerCase() !== "nigeria") throw new Error("Mayéra checkout currently supports delivery within Nigeria only.");
  const configuredRates = await database.shippingRate.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  const state = address.state.trim().toLowerCase();
  const match = configuredRates.find((rate) => rate.states.length === 0 || rate.states.some((item) => item.toLowerCase() === state));
  const env = serverEnv();
  const free = env.MAYERA_FREE_DELIVERY_ENABLED === "true" && subtotalKobo >= env.MAYERA_FREE_DELIVERY_THRESHOLD_KOBO;
  return { provider: "manual", service: match?.name ?? "Standard delivery", amountKobo: free ? 0 : (match?.amountKobo ?? env.MAYERA_STANDARD_DELIVERY_KOBO), estimatedDays: "2–7 business days" };
}
