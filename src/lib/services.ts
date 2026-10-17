// The services portfolio. `slug` doubles as the anchor id on the /services hub and as the route
// segment if a service later earns its own page (/services/[slug]).
import { Code2, Brain, BarChart3, Boxes, Workflow, Compass, RefreshCw, type LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  icon: LucideIcon;
  heading: string;
  lede: string;
  items: string[];
  /** Short line for the hero's contents strip. */
  short: string;
  /** What a client walks away with (shown in the service explorer). */
  outcomes: string[];
  accent: string;
  /** Plain-language story shown in the portfolio: the problem today, and the result. */
  story: { before: string; after: string };
};

export const services: Service[] = [
  {
    slug: "software-engineering",
    story: { before: "Work runs on spreadsheets and email", after: "Everyone works in one place, in real time" },
    short: "Custom platforms, apps and integrations.",
    accent: "#0b5cff",
    outcomes: [
      "A system shaped around your real workflow, not a template",
      "Clean integrations with the tools you already use",
      "Code and documentation you own, ready to extend",
    ],
    name: "Software Engineering",
    icon: Code2,
    heading: "Software built around the way you work.",
    lede: "We engineer custom applications and business systems designed around your processes, users and growth requirements.",
    items: [
      "Custom Software Development",
      "Web Application Development",
      "Enterprise Applications",
      "Business Platforms",
      "E-Commerce Development",
      "Workflow Systems",
      "API & System Integration",
      "Application Modernization",
    ],
  },
  {
    slug: "ai-engineering",
    story: { before: "Staff answer the same questions all day", after: "Customers get answers in seconds, day and night" },
    short: "Agents, assistants and automation.",
    accent: "#7c3aed",
    outcomes: [
      "AI working on your own data, with guardrails",
      "Measurable time saved on a real process",
      "A path from one pilot to company-wide capability",
    ],
    name: "AI Engineering",
    icon: Brain,
    heading: "Build AI into the way your business works.",
    lede: "We design practical AI solutions that enhance existing processes or create completely new capabilities.",
    items: [
      "AI Application Development",
      "Generative AI",
      "AI Agents",
      "AI Automation",
      "AI Assistants",
      "Document Intelligence",
      "Knowledge Systems",
      "AI Integration",
    ],
  },
  {
    slug: "data-bi",
    story: { before: "Numbers scattered across different reports", after: "Decisions made on facts, not guesses" },
    short: "Dashboards, analytics and reporting.",
    accent: "#0891b2",
    outcomes: [
      "One trusted view of numbers that used to disagree",
      "Reports that arrive on time, without spreadsheets",
      "Answers to the questions you actually ask",
    ],
    name: "Data & Business Intelligence",
    icon: BarChart3,
    heading: "Make your data useful.",
    lede: "We help businesses turn fragmented information into dashboards, analytics and decision-support systems.",
    items: [
      "Business Intelligence",
      "Data Visualization",
      "Business Analytics",
      "Reporting Systems",
      "Decision Support",
      "Data Processing",
      "Intelligent Reporting",
    ],
  },
  {
    slug: "iot-aiot",
    story: { before: "Problems found only after they happen", after: "Alerts arrive before anything breaks" },
    short: "Devices, sensors and real-time data.",
    accent: "#0d9488",
    outcomes: [
      "Live visibility into equipment and spaces",
      "Alerts before problems become downtime",
      "Device data flowing into your business systems",
    ],
    name: "IoT & AIoT Engineering",
    icon: Boxes,
    heading: "Connect operations, devices and intelligence.",
    lede: "We design systems that connect physical environments with software, data and AI.",
    items: [
      "IoT Platforms",
      "Device Integration",
      "Monitoring Systems",
      "Smart Automation",
      "AIoT",
      "Real-Time Data Systems",
    ],
  },
  {
    slug: "digital-transformation",
    story: { before: "Five manual steps for every task", after: "The same task done in one step, automatically" },
    short: "Strategy, process and modernisation.",
    accent: "#4f46e5",
    outcomes: [
      "A clear picture of where time and money leak",
      "A prioritised roadmap with costs and timelines",
      "Change delivered in steps the team can absorb",
    ],
    name: "Digital Transformation",
    icon: Workflow,
    heading: "Transform the way your business operates.",
    lede: "We help organizations identify where technology can remove friction, improve visibility and create new capabilities.",
    items: [
      "Digital Transformation Strategy",
      "Process Analysis",
      "Workflow Transformation",
      "System Modernization",
      "Technology Roadmapping",
      "Automation Strategy",
    ],
  },
  {
    slug: "consulting",
    story: { before: "Unsure what to build, buy or fix first", after: "A clear plan with costs and timeline" },
    short: "Analysis, architecture and roadmaps.",
    accent: "#2563eb",
    outcomes: [
      "Requirements everyone agrees on before code is written",
      "An architecture that fits your budget and growth",
      "Confident build-or-buy and technology decisions",
    ],
    name: "Business Systems Consulting",
    icon: Compass,
    heading: "Decide what to build before you build it.",
    lede: "We analyse how your business operates today, then define the system architecture, priorities and modernization path that fit it.",
    items: [
      "Business Analysis",
      "Process Mapping",
      "Solution Architecture",
      "System Modernization & Optimization",
      "Technology Selection",
      "Transformation Roadmapping",
    ],
  },
  {
    slug: "ongoing",
    story: { before: "Systems slow down and age after launch", after: "Software that keeps getting better" },
    short: "Support, improvement and growth.",
    accent: "#16a34a",
    outcomes: [
      "Systems that stay fast, secure and current",
      "New features shipped as the business changes",
      "One team that already knows your platform",
    ],
    name: "Ongoing Engineering",
    icon: RefreshCw,
    heading: "Technology shouldn't stop evolving after launch.",
    lede: "We provide ongoing engineering support to improve, maintain and expand systems as business needs change.",
    items: [
      "System Maintenance",
      "Feature Development",
      "Performance Optimization",
      "Security Improvements",
      "AI Model / Capability Enhancement",
      "Technical Support",
      "Continuous Improvement",
    ],
  },
];
