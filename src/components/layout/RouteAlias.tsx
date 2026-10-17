"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * A page that used to live at this URL and has moved.
 *
 * The site is a static export (`output: "export"`), so there is no server to issue a 301 and
 * next.config `redirects` do nothing. This forwards on the client instead, and renders a real link
 * so the route still works without JavaScript and for crawlers. Pages using this should also set
 * `alternates.canonical` to the destination.
 *
 * These are temporary. Delete one once the new URL has been live long enough that nothing points here.
 */
export default function RouteAlias({ to, label }: { to: string; label: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ textAlign: "center", display: "grid", gap: 18, justifyItems: "center" }}>
          <p className="eyebrow">This page has moved</p>
          <h1 className="h-lg">{label}</h1>
          <Link href={to} className="btn btn-primary btn-lg">Continue to {label}</Link>
        </div>
      </section>
    </div>
  );
}
