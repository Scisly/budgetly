import type { NextConfig } from "next";

function getAllowedOrigins(): string[] {
  const origins = [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.1.121:3000",
  ];

  if (process.env.VERCEL_URL) {
    origins.push(process.env.VERCEL_URL);
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      origins.push(new URL(process.env.NEXT_PUBLIC_APP_URL).host);
    } catch {
      // ignore invalid URL
    }
  }

  return origins;
}

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    serverActions: {
      allowedOrigins: getAllowedOrigins(),
    },
  },
};

export default nextConfig;
