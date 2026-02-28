import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },

  // GitHub Pages project repo
  basePath: "/CRM_TOOL_Creation",
  trailingSlash: true,
};

export default nextConfig;
