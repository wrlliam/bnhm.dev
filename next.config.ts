import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["api.microlink.io"],
  },
  output: "standalone"
};

export default nextConfig;
