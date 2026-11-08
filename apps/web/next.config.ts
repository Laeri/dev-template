import path from "node:path"

import { loadEnvConfig } from "@next/env"
import type { NextConfig } from "next"

// Load the shared .env files from the monorepo root. `forceReload` is needed
// because Next.js already ran (and cached) env loading for apps/web.
loadEnvConfig(
  path.resolve(process.cwd(), "../.."),
  process.env.NODE_ENV !== "production",
  undefined,
  true
)

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/api",
  ],
}

export default nextConfig
