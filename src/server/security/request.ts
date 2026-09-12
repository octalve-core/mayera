import { NextRequest } from "next/server";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function clientIp(request: NextRequest) {
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) throw new HttpError(403, "This request could not be verified.");
  if (new URL(origin).host !== host) throw new HttpError(403, "Cross-site request blocked.");
}

export function errorResponse(error: unknown) {
  const prismaCode = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  const databaseUnavailable = error instanceof Error && (
    error.name === "PrismaClientInitializationError" ||
    ["P1000", "P1001", "P1002", "P1003", "P1008", "P1010", "P1011", "P1017", "P2021", "P2022"].includes(prismaCode)
  );
  const status = error instanceof HttpError ? error.status : databaseUnavailable ? 503 : 500;
  const message = error instanceof HttpError
    ? error.message
    : databaseUnavailable
      ? "The database is not ready. Check DATABASE_URL, apply the migrations and finish the one-time owner setup, then try again."
      : "Something went wrong. Please try again.";
  return Response.json({ ok: false, message }, { status });
}
