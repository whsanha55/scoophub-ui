import type { NextConfig } from "next";

const API_URL = process.env.API_URL || "http://localhost:20010";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
      {
        source: "/docs",
        destination: `${API_URL}/docs`,
      },
      {
        source: "/docs/:path*",
        destination: `${API_URL}/docs/:path*`,
      },
      {
        source: "/openapi.json",
        destination: `${API_URL}/openapi.json`,
      },
    ];
  },
};

export default nextConfig;
