import type { MetadataRoute } from "next";
import { sitemapRoutes } from "@/lib/nav";
import { SITE } from "@/lib/site";
// `output: "export"` requires metadata routes to be explicitly static.
export const dynamic = "force-static";


// Derived from the nav tree, so a route added there is listed here automatically. Anchors, phase-2
// routes and the moved-page aliases are excluded (the aliases are also marked noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return sitemapRoutes().map((route) => ({
    url: `${SITE}${route === "/" ? "/" : `${route}/`}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
