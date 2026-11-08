import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // The API contract package ships TypeScript source.
  transpilePackages: ["@workspace/api"],
}

export default nextConfig
