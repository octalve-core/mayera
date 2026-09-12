import type { NextConfig } from "next";

function storagePatterns() {
  const value = process.env.OBJECT_STORAGE_PUBLIC_URL;
  if (!value) return [];
  try {
    const url = new URL(value);
    return [{ protocol: url.protocol.replace(":", "") as "http" | "https", hostname: url.hostname, port: url.port, pathname: `${url.pathname.replace(/\/$/, "")}/**` }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: storagePatterns()
  }
};

export default nextConfig;
