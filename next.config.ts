import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Uncomment for static hosting (Hostinger)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
