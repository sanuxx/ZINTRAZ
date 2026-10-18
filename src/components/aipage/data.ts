import {
  BarChart3, Blocks, Bot, Briefcase, Building2, Compass, Eye, FileCheck2, FileSearch, Gauge, HeartHandshake, KeyRound, Layers3,
  Lightbulb, LockKeyhole, Megaphone, MessageCircle, Plug, Repeat, Rocket, Scale, ServerCog, Sparkles, Target, TrendingUp, Users,
  Wallet, Wand2, type LucideIcon,
} from "lucide-react";

/**
 * /ai page content, condensed from the client's AI page brief so the page scans rather than reads.
 * Shared by the server page and its client scenes.
 */

export const opportunity: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Repeat, title: "Less repetitive work", desc: "Automate the tasks that eat your week." },
  { Icon: Lightbulb, title: "Smarter decisions", desc: "Turn data into clear next steps." },
  { Icon: Sparkles, title: "Intelligent experiences", desc: "Apps that understand what people need." },
  { Icon: TrendingUp, title: "Room to scale", desc: "AI that grows with the business." },
];

export type Solution = {
  title: string; short: string; tagline: string; points: string[]; Icon: LucideIcon;
  vis: "integrate" | "agents" | "app" | "analytics" | "docs" | "strategy";
};
export const solutions: Solution[] = [
  { title: "AI Integration & Enhancement", short: "AI integration", tagline: "Make the systems you already have smarter.", Icon: Plug, vis: "integrate",
    points: ["AI inside your existing software", "Smart search and recommendations", "Assistants for customers and staff"] },
  { title: "AI Agents & Workflow Automation", short: "Agents & automation", tagline: "Agents that do the work, with you in control.", Icon: Bot, vis: "agents",
    points: ["Agents for everyday operations", "Document processing and reporting", "Human approval where it matters"] },
  { title: "Custom AI Application Development", short: "Custom AI apps", tagline: "AI built around how your business works.", Icon: Wand2, vis: "app",
    points: ["AI-powered web applications", "Chat assistants and virtual agents", "Knowledge assistants over your documents"] },
  { title: "AI Analytics & Decision Intelligence", short: "Analytics & decisions", tagline: "Ask your data questions in plain language.", Icon: BarChart3, vis: "analytics",
    points: ["KPIs, trends and anomalies", "Forecasts and what-if scenarios", "Automated reports"] },
  { title: "Intelligent Document & Knowledge Systems", short: "Documents & knowledge", tagline: "Find any answer in your documents, with sources.", Icon: FileSearch, vis: "docs",
    points: ["Search and Q&A over PDFs, Word and Excel", "Summaries and comparisons", "Answers that cite their sources"] },
  { title: "AI Strategy & Implementation Consulting", short: "Strategy & consulting", tagline: "Start with the right problem, not the latest tool.", Icon: Compass, vis: "strategy",
    points: ["Readiness and opportunity assessments", "Proofs of concept", "A practical roadmap"] },
];

export const functions: { Icon: LucideIcon; title: string; uses: string[] }[] = [
  { Icon: Wallet, title: "Finance & Operations", uses: ["Document analysis", "Expense sorting", "Management reports"] },
  { Icon: MessageCircle, title: "Sales & Customers", uses: ["Lead qualification", "Customer assistants", "Sales insights"] },
  { Icon: Megaphone, title: "Marketing & Growth", uses: ["Campaign analysis", "Audience insights", "Content workflows"] },
  { Icon: Users, title: "Human Resources", uses: ["Policy assistants", "Employee self-service", "Recruitment support"] },
  { Icon: Briefcase, title: "Projects & Management", uses: ["Status summaries", "Schedule risks", "Decision support"] },
  { Icon: Building2, title: "Industry Systems", uses: ["Industry assistants", "Operational intelligence", "Knowledge systems"] },
];

export const steps: { title: string; desc: string }[] = [
  { title: "Discover & Understand", desc: "Your goals, processes, data and challenges." },
  { title: "Identify & Strategize", desc: "The use cases worth doing, and how." },
  { title: "Design & Engineer", desc: "Architecture, integrations and experience." },
  { title: "Build & Validate", desc: "Tested against real scenarios and security needs." },
  { title: "Deploy & Integrate", desc: "Live in your systems, with access controls and monitoring." },
  { title: "Optimize & Evolve", desc: "Measured, improved and extended over time." },
];

export const why: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Target, title: "Business first", desc: "Real problems and measurable results." },
  { Icon: Layers3, title: "End-to-end engineering", desc: "AI, software, data and integrations in one team." },
  { Icon: HeartHandshake, title: "Tailored to you", desc: "Built around your workflows and goals." },
  { Icon: Scale, title: "Responsible by design", desc: "Privacy, permissions and human oversight." },
  { Icon: Blocks, title: "Built to integrate", desc: "Works with the systems you already run." },
  { Icon: Rocket, title: "Designed to evolve", desc: "Improves as your business grows." },
];

export const trust: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: LockKeyhole, title: "Data protection", desc: "Safeguards for sensitive information." },
  { Icon: KeyRound, title: "Access control", desc: "People only see what they're allowed to." },
  { Icon: FileCheck2, title: "Grounded answers", desc: "Responses linked to your source documents." },
  { Icon: Eye, title: "Human oversight", desc: "People approve the decisions that matter." },
  { Icon: Gauge, title: "Tested and monitored", desc: "Output quality checked before and after launch." },
  { Icon: ServerCog, title: "Flexible deployment", desc: "Cloud, private or on-premise." },
];

export const faqs: [string, string][] = [
  ["What AI solutions do you build?", "Integrations, custom AI apps, agents and automation, analytics, document intelligence and AI strategy. The right one depends on your goals."],
  ["Can you add AI to our existing software?", "Usually, yes. We connect to your current systems through their APIs, databases or exports, so you don't have to replace what already works."],
  ["Do we need to train our own model?", "Usually not. Most solutions combine proven AI models with your own data. We only suggest training when it clearly pays off."],
  ["Can it run privately or on our own servers?", "Yes, where it fits. We compare cloud, private and on-premise options against your data, rules and budget."],
  ["How long and how much?", "It depends on scope. We usually start with a short assessment or proof of concept, then give you a clear timeline and estimate."],
];

/** The capability ticker under the hero. */
export const ticker = [
  "AI Integration", "AI Agents", "Workflow Automation", "Retrieval-Augmented Generation", "Document Intelligence", "Natural-Language Analytics",
  "Forecasting", "Anomaly Detection", "Knowledge Assistants", "Decision Support", "Human-in-the-Loop", "AI Strategy",
];
