import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Firebase Storage will be added here later, e.g.:
    // remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }],
  },
};

export default nextConfig;
