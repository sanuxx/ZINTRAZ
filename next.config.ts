import path from "node:path";
import type { NextConfig } from "next";

// Two deploy targets:
//  • GitHub Pages preview (DEPLOY_TARGET=pages, set by .github/workflows/deploy-pages.yml): a static
//    export served from https://sanuxx.github.io/ZINTRAZ/ — a project page, so every route and asset is
//    prefixed with the repo name, and there is no Node server for route handlers or the image optimizer.
//  • Production server (default, and `next dev`): `next build && next start` on a Node.js server, with
//    the server-only routes (blueprint submissions, the admin review pages) switched on.
// Server-only routes are named `*.server.ts(x)`; the Pages build simply doesn't treat them as routes.
const pages = process.env.DEPLOY_TARGET === "pages";
const repo = "ZINTRAZ";

const nextConfig: NextConfig = {
  transpilePackages: [],
  ...(pages
    ? { output: "export", basePath: `/${repo}`, assetPrefix: `/${repo}/`, pageExtensions: ["tsx", "ts"] }
    : { pageExtensions: ["tsx", "ts", "server.tsx", "server.ts"] }),
  env: {
    NEXT_PUBLIC_BASE_PATH: pages ? `/${repo}` : "",
    NEXT_PUBLIC_SERVER_FEATURES: pages ? "" : "1",
  },
  trailingSlash: true,
  images: { unoptimized: true },
  // A stray lockfile in the user's home directory otherwise makes Turbopack misdetect the
  // workspace root; pin it to this project explicitly.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
