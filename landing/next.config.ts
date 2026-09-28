import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static site: nothing runs on a server, and the download comes straight from GitHub Releases.
  output: "export",
  trailingSlash: true,
  // This project lives inside a monorepo with other lockfiles; pins the build root here.
  turbopack: { root: path.resolve(__dirname) },
  agentRules: false,
};

export default nextConfig;
