// The three solution areas on /solutions, from the content architecture ("05. SOLUTIONS").
// `id` is the anchor the nav, footer and home page link to (/solutions#software, #ai, #iot).
import { Boxes, Brain, Code2, type LucideIcon } from "lucide-react";

export type Solution = {
  id: "software" | "ai" | "iot";
  num: string;
  name: string;
  short: string;
  icon: LucideIcon;
  heading: string;
  lede: string;
  capabilities: string[];
  cta: { label: string; href: string };
};

export const solutions: Solution[] = [
  {
    id: "software",
    num: "01",
    name: "Software & Digital Systems",
    short: "Software",
    icon: Code2,
    heading: "Build the digital infrastructure your business actually needs.",
    lede: "We design and engineer custom software systems around your workflows, teams and operational requirements.",
    capabilities: ["Business Applications", "Enterprise Systems", "Web Applications", "Business Portals", "Workflow Systems", "E-Commerce Platforms", "Custom Dashboards", "System Integration", "Process Automation"],
    cta: { label: "Explore software engineering", href: "/services#software-engineering" },
  },
  {
    id: "ai",
    num: "02",
    name: "AI & Intelligence",
    short: "AI",
    icon: Brain,
    heading: "Turn your business data into business intelligence.",
    lede: "We build AI into your processes to understand information, automate work and support decisions.",
    capabilities: ["AI Integration", "AI Agents", "Document Intelligence", "AI-Powered Search", "Business Intelligence", "Decision Support", "Intelligent Automation", "Data Analysis", "Generative AI Applications"],
    cta: { label: "Explore AI & Intelligence", href: "/solutions/ai-intelligence" },
  },
  {
    id: "iot",
    num: "03",
    name: "IoT & AIoT",
    short: "IoT",
    icon: Boxes,
    heading: "Connect the physical world to intelligent software.",
    lede: "Connected devices, software, data and AI that monitor and respond to the real world.",
    capabilities: ["IoT Platforms", "Device Monitoring", "Real-Time Data", "Smart Automation", "Predictive Insights", "AIoT Systems", "Operational Monitoring"],
    cta: { label: "Explore IoT & AIoT engineering", href: "/services#iot-aiot" },
  },
];
