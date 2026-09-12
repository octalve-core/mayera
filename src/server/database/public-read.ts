let developmentDatabaseUnavailable = false;
let warningShown = false;
const unavailableFlag = "__MAYERA_PUBLIC_DATABASE_UNAVAILABLE";
const warningFlag = "__MAYERA_PUBLIC_DATABASE_WARNING_SHOWN";

function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

const recoverableCodes = new Set([
  "P1000", "P1001", "P1002", "P1003", "P1008", "P1010", "P1011", "P1017", "P2021", "P2022"
]);

function isDatabaseUnavailable(error: unknown) {
  if (!(error instanceof Error)) return false;
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  return error.name === "PrismaClientInitializationError" || recoverableCodes.has(code);
}

export function shouldReadPublicDatabase() {
  if (!process.env.DATABASE_URL) return false;
  const unavailable = developmentDatabaseUnavailable || process.env[unavailableFlag] === "1";
  return !isDevelopment() || !unavailable;
}

export function activateBundledPublicFallback(error: unknown) {
  if (!isDevelopment() || !isDatabaseUnavailable(error)) throw error;

  developmentDatabaseUnavailable = true;
  process.env[unavailableFlag] = "1";
  if (!warningShown && process.env[warningFlag] !== "1") {
    console.warn(
      "[Mayéra] DATABASE_URL is configured but PostgreSQL is unavailable. Public pages are using bundled preview data; accounts, checkout and admin remain disabled until the database connection, migration and first-owner setup are complete."
    );
    warningShown = true;
    process.env[warningFlag] = "1";
  }
}
