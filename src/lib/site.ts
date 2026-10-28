// Kept in sync with `basePath` in next.config.ts, which sets NEXT_PUBLIC_BASE_PATH: "/ZYNTRAZ" for the
// GitHub Pages preview, "" for the production server and `next dev`. next/link and next/image apply the
// base path automatically, but a plain <img src>, fetch() or a CSS url() does not, so anything using one of
// those must prefix its path with this constant itself.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Absolute origin + basePath, for sitemap.ts, robots.ts and links in emails. Set SITE_URL on the production
// server (e.g. https://zintraz.com); the preview falls back to its GitHub Pages address. A root-relative path
// resolved against `metadataBase` would drop the /ZYNTRAZ segment, so these are concatenated, not URL-joined.
export const SITE = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || `https://sanuxx.github.io${BASE_PATH || "/ZYNTRAZ"}`).replace(/\/$/, "");

/** True on the production server and in `next dev`; false in the static GitHub Pages preview. */
export const SERVER_FEATURES = process.env.NEXT_PUBLIC_SERVER_FEATURES === "1";
