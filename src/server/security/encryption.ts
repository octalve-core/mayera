import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { serverEnv } from "@/lib/env";

function key() {
  const value = serverEnv().FIELD_ENCRYPTION_KEY;
  if (!value) throw new Error("FIELD_ENCRYPTION_KEY is required for encrypted configuration");
  return Buffer.from(value, "hex");
}

export function encryptField(plainText: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["v1", iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptField(value: string) {
  const [version, ivValue, tagValue, cipherText] = value.split(".");
  if (version !== "v1" || !ivValue || !tagValue || !cipherText) throw new Error("Invalid encrypted field");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(cipherText, "base64url")), decipher.final()]).toString("utf8");
}
