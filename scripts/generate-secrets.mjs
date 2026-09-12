import { randomBytes } from "node:crypto";

console.log("# Copy these new values into your private .env.local file.");
console.log(`AUTH_SECRET=${randomBytes(48).toString("base64url")}`);
console.log(`FIELD_ENCRYPTION_KEY=${randomBytes(32).toString("hex")}`);
console.log(`MAYERA_SETUP_TOKEN=${randomBytes(48).toString("base64url")}`);
