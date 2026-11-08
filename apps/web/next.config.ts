import path from "node:path"

import { loadEnvConfig } from "@next/env"
import type { NextConfig } from "next"

// Load the shared .env from the monorepo root.
loadEnvConfig(path.resolve(process.cwd(), "../.."))

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@workspace/api",
    "@workspace/db",
    "@workspace/email",
  ],
}

export default nextConfig
