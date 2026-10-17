"use client";

import type { ComponentType } from "react";
import AgentDemo from "@/components/demos/AgentDemo";
import AnalystDemo from "@/components/demos/AnalystDemo";
import CrmDemo from "@/components/demos/CrmDemo";
import DecideDemo from "@/components/demos/DecideDemo";
import DocsDemo from "@/components/demos/DocsDemo";
import EventsDemo from "@/components/demos/EventsDemo";
import IqDemo from "@/components/demos/IqDemo";
import RestDemo from "@/components/demos/RestDemo";
import StayDemo from "@/components/demos/StayDemo";
import { products } from "@/components/sections/Products";

/**
 * A product's interactive demo (three of its systems, connected, running in the browser on sample
 * data), shown on the laptop in the product page hero. Takes the slug, since a product carries an icon
 * component that cannot cross to the client.
 */
const DEMOS: Record<string, ComponentType<{ accent: string }>> = {
  zynrest: RestDemo, zynstay: StayDemo, zyncrm: CrmDemo, zynevents: EventsDemo, zyniq: IqDemo,
  zynagent: AgentDemo, zyndocs: DocsDemo, zynanalyst: AnalystDemo, zyndecide: DecideDemo,
};

export default function ProductDemo({ slug }: { slug: string }) {
  const product = products.find((p) => p.id === slug);
  const Demo = DEMOS[slug];
  if (!product || !Demo) return null;
  return <Demo accent={product.accent} />;
}
