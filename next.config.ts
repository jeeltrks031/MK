import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "milkekhareedo-storage.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**",
      },
      // Allow any S3 bucket domain (common patterns)
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        pathname: "/**",
      },
    ],
    // Allow unoptimized images for external domains not in remotePatterns
    unoptimized: false,
  },
};

export default nextConfig;
