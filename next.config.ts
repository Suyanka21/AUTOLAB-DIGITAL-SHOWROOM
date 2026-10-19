import type { NextConfig } from "next";

const immutableAssetHeader = { key: "Cache-Control", value: "public, max-age=31536000, immutable" };

const nextConfig: NextConfig = {
  async headers() {
    return ["/assets/3d/:path*", "/draco/:path*", "/basis/:path*"].map((source) => ({
      source,
      headers: [immutableAssetHeader],
    }));
  },
};

export default nextConfig;
