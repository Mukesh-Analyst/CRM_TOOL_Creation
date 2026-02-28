import type { NextConfig } from "next";

const repoName = "CRM_TOOL_Creation";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },

  // IMPORTANT for GitHub Pages project site
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  trailingSlash: true,
};

export default nextConfig;
