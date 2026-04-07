import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {},
  env: {
    IOL_API_BASE_URL: process.env.IOL_API_BASE_URL ?? "https://api.invertironline.com",
    IOL_TOKEN_URL: process.env.IOL_TOKEN_URL ?? "https://api.invertironline.com/token",
  },
}

export default nextConfig
