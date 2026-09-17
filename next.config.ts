import type { NextConfig } from "next";

const indicTransUrl = (
  process.env.INDIC_TRANS_API_URL ||
  process.env.TRANSLATION_API_URL ||
  process.env.TRANSLATION_SERVICE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: `${indicTransUrl}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;

