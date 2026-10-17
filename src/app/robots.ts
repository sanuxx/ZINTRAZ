import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
// `output: "export"` requires metadata routes to be explicitly static.
export const dynamic = "force-static";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
