import { BarChart3, BedDouble, Bot, CalendarDays, FileSearch, Handshake, Scale, ScanSearch, UtensilsCrossed, type LucideIcon } from "lucide-react";

export type ProductStatus = "available" | "soon";
export const statusLabel: Record<ProductStatus, string> = { available: "Available now", soon: "Coming soon" };

/** Product families, matching the anchors the nav links to on /products. */
export type ProductGroup = "hospitality" | "business-systems" | "ai-products";
export const groupLabel: Record<ProductGroup, string> = {
  hospitality: "Hospitality",
  "business-systems": "Business Systems",
  "ai-products": "AI Products",
};

export type Product = {
  // `id` doubles as the URL slug: /products/<id>.
  id: string; name: string; category: string; tagline: string; accent: string; icon: LucideIcon; status: ProductStatus;
  group: ProductGroup;
  // The one unit of work the product films follow through the workflow ("An order", "A reservation").
  token: string;
  pain: string; desc: string; features: string[]; ai: string;
  // Detail-page content (/products/[slug]).
  useCases: string[]; workflow: string[];
};

export const products: Product[] = [
  {
    id: "zynrest", name: "ZynRest", category: "Restaurant Management", tagline: "Every order. Every table. One system.", accent: "#0b5cff", icon: UtensilsCrossed, status: "available", group: "hospitality", token: "An order",
    pain: "Wrong orders, wasted stock and no idea which dishes actually make money?",
    desc: "An intelligent platform designed to manage restaurant operations, orders, inventory, and analytics from one unified dashboard.",
    features: ["Multi-terminal POS", "Live KDS system", "Real-time inventory", "Dynamic QR menus", "Staff shift tracking", "Recipe cost engine"],
    ai: "AI-ready: add a Zintraz agent for demand forecasting and automatic reorders",
    useCases: [
      "A single restaurant replacing a cash register and a notebook",
      "A multi-outlet group that needs one view of sales across branches",
      "A kitchen losing time to handwritten tickets",
      "An owner who cannot say which dishes are profitable",
    ],
    workflow: [
      "An order is taken at any terminal, or by the guest from a QR menu",
      "The kitchen display picks it up the moment it is sent",
      "Stock is deducted against the recipe as the dish is made",
      "The bill closes, and the sale, the cost and the margin land in reporting together",
    ],
  },
  {
    id: "zynstay", name: "ZynStay", category: "Hotel Management", tagline: "The whole hotel. One connected system.", accent: "#4f46e5", icon: BedDouble, status: "soon", group: "hospitality", token: "A reservation",
    pain: "Bookings, events, rooms, stock and the restaurant — all run in separate places?",
    desc: "A connected hospitality ecosystem for hotels, resorts and event venues — property management, reservations, events, inventory and ZynRest for the restaurant, working as one system.",
    features: ["Property management (PMS)", "Bookings & reservations", "Events & banquets", "3D event planner", "Housekeeping & maintenance", "Inventory management"],
    ai: "AI-ready: add a booking agent that answers guests on WhatsApp",
    useCases: [
      "A hotel running bookings in one tool and the restaurant in another",
      "A resort where housekeeping status never reaches the front desk",
      "An event venue double-booking function rooms",
      "An owner with no live figure for occupancy or revenue per room",
    ],
    workflow: [
      "A reservation arrives from any channel and lands on one calendar",
      "The room, the housekeeping task and the event block all reference it",
      "Restaurant and bar charges post to the guest folio as they happen",
      "Checkout closes the folio, and occupancy and RevPAR update with it",
    ],
  },
  {
    id: "zyncrm", name: "ZynCRM", category: "Customer Relationship", tagline: "No lead left behind.", accent: "#0891b2", icon: Handshake, status: "soon", group: "business-systems", token: "A new lead",
    pain: "Leads going cold because nobody followed up?",
    desc: "A smart CRM system designed to manage leads, track sales pipelines, and improve growth.",
    features: ["Visual pipeline tracking", "Follow-up automation", "Predictive lead scoring", "Invoice & quote generator"],
    ai: "Predictive lead scoring and automated follow-ups",
    useCases: [
      "Leads arriving from a website form into somebody's inbox",
      "A sales team where each person keeps their own spreadsheet",
      "Quotes written from scratch for every enquiry",
      "No idea which deals are actually close to closing",
    ],
    workflow: [
      "A lead is captured from any source into one pipeline",
      "It is scored, assigned and given a next action with a date",
      "Follow-ups fire automatically when that date passes",
      "The quote, the invoice and the closed value all stay on the same record",
    ],
  },
  {
    id: "zynevents", name: "ZynEvents", category: "Events Management", tagline: "Plan events before they happen.", accent: "#e0589b", icon: CalendarDays, status: "soon", group: "hospitality", token: "An event enquiry",
    pain: "Function rooms double-booked and event plans living in somebody's head?",
    desc: "Bring event planning, venue management and operational coordination into one visual system — including a 3D planner that lays out the room before anyone moves a table.",
    features: ["Event planning", "Venue management", "Event scheduling", "Resource planning", "3D event planner", "Packages & quoting", "Customer management", "Event operations"],
    ai: "AI-ready: generate a staffing and resource plan from the event brief",
    useCases: [
      "A hotel banquet team coordinating weddings and corporate events in the same week",
      "A venue that needs to show a client the room layout before they commit",
      "Event staff who find out about a setup change on the day",
      "Packages quoted differently by every salesperson",
    ],
    workflow: [
      "An enquiry becomes a provisional booking on the venue schedule",
      "The 3D planner lays out tables, staging and capacity for client sign-off",
      "Resources, staff and setup time are blocked against the event",
      "Operations works from one plan, and the final invoice matches the package",
    ],
  },
  {
    id: "zyniq", name: "ZynIQ", category: "Business Intelligence", tagline: "Ask your business data better questions.", accent: "#0ea5e9", icon: BarChart3, status: "soon", group: "business-systems", token: "A business question",
    pain: "Reports that tell you what happened, but never why?",
    desc: "Bring documents, operational data and business information together to create intelligent analysis and decision support — in plain language, not just charts.",
    features: ["Dashboards & reporting", "Document intelligence", "Natural-language queries", "Trend & anomaly detection", "Multi-source data connections", "Scheduled reports", "Decision support", "Export & sharing"],
    ai: "Ask a question in plain language and get the analysis behind the answer",
    useCases: [
      "A monthly report assembled by hand from four different systems",
      "Data that exists but never reaches the person making the decision",
      "Contracts and documents nobody has time to read in full",
      "A trend spotted three months after it started",
    ],
    workflow: [
      "Operational systems and documents connect as data sources",
      "Dashboards surface the metrics that matter to your business",
      "You ask a question in plain language instead of building a report",
      "Anomalies and trends are flagged before you go looking for them",
    ],
  },
  {
    id: "zynagent", name: "ZynAgent", category: "AI Agents", tagline: "AI staff that work inside your systems.", accent: "#16a34a", icon: Bot, status: "soon", group: "ai-products", token: "A customer request",
    pain: "Requests piling up after hours because there is nobody to answer them?",
    desc: "Deploy AI agents for sales, support, operations, finance and bookings that understand requests, reason through the steps and take action across your systems — with your team approving what matters.",
    features: ["Sales & support agents", "Operations & finance agents", "Acts inside your systems", "Human-in-the-loop approvals", "Web, WhatsApp & email", "Grounded in your business data", "Audit log of every action", "Escalation to your team"],
    ai: "Reasons through each request and acts within the rules you set",
    useCases: [
      "Customer enquiries arriving around the clock on WhatsApp and the website",
      "A support team answering the same questions every day",
      "Invoices, payments and reminders chased by hand",
      "Bookings and reschedules that need someone at a desk",
    ],
    workflow: [
      "A request arrives on any channel",
      "The agent understands it and checks your systems for context",
      "It takes the action, or routes it to a person for approval",
      "Every step is logged and the outcome is reported back",
    ],
  },
  {
    id: "zyndocs", name: "ZynDocs", category: "AI Document Intelligence", tagline: "Turn documents into data you can act on.", accent: "#e11d48", icon: FileSearch, status: "soon", group: "ai-products", token: "An invoice",
    pain: "Teams re-typing invoices, forms and contracts into other systems?",
    desc: "Read, classify and extract information from invoices, forms, contracts and reports — validated against your records and posted straight into the systems that need it.",
    features: ["Invoice & form extraction", "Contract review", "Document classification", "Validation against records", "Confidence scoring", "Human review queue", "System integration", "Searchable archive"],
    ai: "Shows its confidence on every field it extracts",
    useCases: [
      "Supplier invoices keyed into accounts by hand",
      "Application forms that arrive as scans and photos",
      "Contracts checked clause by clause before signing",
      "Years of documents that nobody can search",
    ],
    workflow: [
      "A document arrives by email, upload or scan",
      "It is classified and the key fields are extracted",
      "Each field is validated against your records, with confidence shown",
      "Approved data is posted to the right system automatically",
    ],
  },
  {
    id: "zynanalyst", name: "ZynAnalyst", category: "AI Business Analyst", tagline: "An intelligent layer for business analysis.", accent: "#8b5cf6", icon: ScanSearch, status: "soon", group: "ai-products", token: "A project brief",
    pain: "Requirements documents that contradict each other and nobody notices until build?",
    desc: "Analyze requirements, documents, workflows and business information with AI-assisted reasoning and structured outputs — gaps, ambiguities and conflicts surfaced before they become rework.",
    features: ["Requirement extraction", "Gap & conflict detection", "Ambiguity flagging", "Document comparison", "Structured specifications", "Traceability", "Stakeholder mapping", "Export to standard formats"],
    ai: "Reasons across your documents and shows its working",
    useCases: [
      "A requirements brief written by several people over several months",
      "A project where scope arguments are settled by memory",
      "Analysis work that takes weeks before engineering can start",
      "Documents that need comparing against an earlier approved version",
    ],
    workflow: [
      "Documents, briefs and meeting notes are uploaded",
      "Requirements are extracted and given structure and IDs",
      "Gaps, ambiguities and conflicts are flagged with their source",
      "A reviewable specification comes out the other side",
    ],
  },
  {
    id: "zyndecide", name: "ZynDecide", category: "AI Decision Intelligence", tagline: "Move from information to informed decisions.", accent: "#f59e0b", icon: Scale, status: "soon", group: "ai-products", token: "A decision",
    pain: "Big decisions made on instinct because comparing the options properly takes too long?",
    desc: "Compare options, evaluate criteria, identify risks and surface assumptions through AI-powered decision support — so the reasoning behind a decision outlives the meeting.",
    features: ["Option comparison", "Weighted criteria", "Risk identification", "Assumption surfacing", "Scenario modelling", "Recommendation with reasoning", "Decision records", "Stakeholder input"],
    ai: "States the assumption its recommendation depends on",
    useCases: [
      "Choosing between building, buying or extending a system",
      "A vendor selection that needs to be defensible later",
      "A decision where the risks are known but never written down",
      "Revisiting a choice and not remembering why it was made",
    ],
    workflow: [
      "The decision and its options are defined",
      "Criteria are weighted according to what your business values",
      "Each option is scored, with risks and assumptions made explicit",
      "A recommendation is produced, along with what would overturn it",
    ],
  },
];
