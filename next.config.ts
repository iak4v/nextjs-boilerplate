import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "ignoumax-dev-s3.s3.ap-south-1.amazonaws.com" },
      { hostname: "ignoumax-prod-s3.s3.ap-south-1.amazonaws.com" },
    ]
  }
};

export default nextConfig;
