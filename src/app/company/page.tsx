import type { Metadata } from "next";
import RouteAlias from "@/components/layout/RouteAlias";

// Renamed to /about when the site adopted the content architecture.
export const metadata: Metadata = {
  title: "About Zintraz",
  alternates: { canonical: "/about" },
  robots: { index: false, follow: true },
};

export default function CompanyAliasPage() {
  return <RouteAlias to="/about" label="About ZINTRAZ" />;
}
