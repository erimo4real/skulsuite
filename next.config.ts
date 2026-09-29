import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static output — deploys to Vercel, Netlify or any shared host (out/ directory).
  output: "export",
  images: { unoptimized: true },
  // Lint runs as a separate `npm run lint` step; keep builds decoupled from it.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
