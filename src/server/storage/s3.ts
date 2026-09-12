import { createHash, createHmac, randomUUID } from "node:crypto";
import { serverEnv } from "@/lib/env";

function digest(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key: string | Buffer, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function encodePath(value: string) {
  return value.split("/").map((part) => encodeURIComponent(part).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)).join("/");
}

function configuration() {
  const env = serverEnv();
  const values = [env.OBJECT_STORAGE_ENDPOINT, env.OBJECT_STORAGE_BUCKET, env.OBJECT_STORAGE_ACCESS_KEY_ID, env.OBJECT_STORAGE_SECRET_ACCESS_KEY, env.OBJECT_STORAGE_PUBLIC_URL];
  if (values.some((value) => !value)) throw new Error("Object storage is not fully configured.");
  return {
    endpoint: env.OBJECT_STORAGE_ENDPOINT!,
    bucket: env.OBJECT_STORAGE_BUCKET!,
    accessKey: env.OBJECT_STORAGE_ACCESS_KEY_ID!,
    secretKey: env.OBJECT_STORAGE_SECRET_ACCESS_KEY!,
    publicUrl: env.OBJECT_STORAGE_PUBLIC_URL!,
    region: env.OBJECT_STORAGE_REGION
  };
}

export async function uploadMediaObject(input: { bytes: Buffer; mimeType: string; extension: string; folder: string }) {
  const config = configuration();
  const endpoint = new URL(config.endpoint);
  if (endpoint.pathname !== "/" && endpoint.pathname !== "") throw new Error("OBJECT_STORAGE_ENDPOINT must not include a path.");
  const date = new Date();
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const folder = input.folder.toLowerCase().replace(/[^a-z0-9/_-]+/g, "-").replace(/^\/+|\/+$/g, "") || "media";
  const key = `${folder}/${dateStamp.slice(0, 4)}/${randomUUID()}.${input.extension}`;
  const canonicalUri = `/${encodePath(config.bucket)}/${encodePath(key)}`;
  const payloadHash = digest(input.bytes);
  const canonicalHeaders = `content-type:${input.mimeType}\nhost:${endpoint.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = ["PUT", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const scope = `${dateStamp}/${config.region}/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, digest(canonicalRequest)].join("\n");
  const dateKey = hmac(`AWS4${config.secretKey}`, dateStamp);
  const regionKey = hmac(dateKey, config.region);
  const serviceKey = hmac(regionKey, "s3");
  const signingKey = hmac(serviceKey, "aws4_request");
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${config.accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  const uploadUrl = `${endpoint.origin}${canonicalUri}`;
  const response = await fetch(uploadUrl, { method: "PUT", headers: { authorization, "content-type": input.mimeType, "x-amz-content-sha256": payloadHash, "x-amz-date": amzDate }, body: new Uint8Array(input.bytes), cache: "no-store" });
  if (!response.ok) throw new Error(`Object storage rejected the upload (${response.status}).`);
  return { key, publicUrl: `${config.publicUrl.replace(/\/$/, "")}/${encodePath(key)}` };
}
