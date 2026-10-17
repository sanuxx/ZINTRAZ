// Industries, in the architecture's five-part shape: problems -> approach -> solutions -> products
// -> outcomes. `slug` is the anchor id on the /industries hub and the future /industries/[slug].
//
// Real Estate and Logistics live under "Other / Custom Industries" — they have real pain points
// worth keeping, but no dedicated product line behind them yet.
import { Hotel, HeartPulse, GraduationCap, ShoppingBag, Briefcase, Puzzle, type LucideIcon } from "lucide-react";

export type Industry = {
  slug: string;
  name: string;
  /** Short label for compact UI (the scene's progress rail). */
  short: string;
  /** The industry's accent, drawn from the site's cool brand family; shared by its frame, glow and highlights. */
  accent: string;
  icon: LucideIcon;
  heading: string;
  lede: string;
  problems: string[];
  approach: string;
  solutions: string[];
  products: string[];
  outcomes: string[];
};

export const industries: Industry[] = [
  {
    slug: "hospitality",
    name: "Hospitality",
    short: "Hospitality",
    accent: "#0b5cff",
    icon: Hotel,
    heading: "Make hospitality operations more connected.",
    lede: "For hotels, restaurants, resorts and event businesses, ZYNTRAZ brings operations, customers, inventory, reservations and intelligence together.",
    problems: [
      "Booking fragmentation across channels",
      "Housekeeping and maintenance chaos",
      "Restaurant operations disconnected from the front desk",
      "No live view of revenue",
    ],
    approach:
      "We map the guest journey and the operational one behind it, then connect the systems that touch both — so a booking, a room status and a restaurant bill all refer to the same reality.",
    solutions: ["Hotel Management", "Restaurant Management", "POS", "Reservations", "Inventory", "Events", "Guest Management", "Business Intelligence"],
    products: ["ZynStay", "ZynRest", "ZynEvents", "ZynIQ"],
    outcomes: ["One live view of occupancy and revenue", "Fewer manual handovers between teams", "Faster service at the table and the desk", "Stock that reflects what was actually sold"],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    short: "Healthcare",
    accent: "#0891b2",
    icon: HeartPulse,
    heading: "Technology for more connected healthcare operations.",
    lede: "Build systems that improve information flow, operational visibility and administrative efficiency across healthcare environments.",
    problems: [
      "Patient records fragmented across paper and tools",
      "No-shows with no reminder system",
      "Pharmacy stock tracked manually",
      "Billing disconnected from insurance",
    ],
    approach:
      "We start with the administrative and operational layer, where fragmented information costs the most time, and engineer the flow of records, appointments and billing into one connected system.",
    solutions: ["Hospital Management", "Patient Operations", "Document Management", "Workflow Automation", "Analytics", "Administrative Systems"],
    products: ["ZynIQ"],
    outcomes: ["Records findable in one place", "Fewer missed appointments", "Stock and billing that reconcile", "Administrative time returned to care"],
  },
  {
    slug: "education",
    name: "Education",
    short: "Education",
    accent: "#7c3aed",
    icon: GraduationCap,
    heading: "Build better digital learning operations.",
    lede: "Technology for schools, universities, educators and training organizations.",
    problems: [
      "Enrolment and fees handled on paper",
      "Attendance tracked by hand",
      "Parents with no visibility into progress",
      "Timetabling done manually every term",
    ],
    approach:
      "We separate the teaching from the administration, then automate the administration — enrolment, attendance, fees and reporting — so educators spend their time on the part that matters.",
    solutions: ["Student Management", "Learning Platforms", "Educator Systems", "Workflow Management", "Communication", "Analytics"],
    products: ["ZynIQ"],
    outcomes: ["Enrolment and fees handled digitally", "Attendance captured automatically", "Progress visible to parents and staff", "Timetabling that takes hours, not weeks"],
  },
  {
    slug: "retail",
    name: "Retail & E-Commerce",
    short: "Retail",
    accent: "#9333ea",
    icon: ShoppingBag,
    heading: "Connect commerce, customers and operations.",
    lede: "Build digital commerce experiences and operational systems designed for modern retail.",
    problems: [
      "Inventory out of sync across branches",
      "Orders re-typed between systems",
      "No single view of sales",
      "Leads and customers going cold",
    ],
    approach:
      "We connect the storefront to the stockroom. One source of truth for inventory and orders, with customer data flowing into it rather than sitting beside it.",
    solutions: ["E-Commerce", "Inventory", "Order Management", "Customer Systems", "Analytics", "Automation"],
    products: ["ZynCRM", "ZynIQ"],
    outcomes: ["Stock accurate across every branch", "Orders that never get re-typed", "One view of sales performance", "Follow-up that happens on its own"],
  },
  {
    slug: "corporate",
    name: "Corporate & Professional Services",
    short: "Corporate",
    accent: "#4f46e5",
    icon: Briefcase,
    heading: "Engineer the systems behind complex businesses.",
    lede: "From internal workflows to customer-facing platforms, we build technology that helps professional organizations operate with greater clarity and efficiency.",
    problems: [
      "Approvals chased over email",
      "Documents scattered across drives and inboxes",
      "No shared view of client work in progress",
      "Reporting assembled by hand every month",
    ],
    approach:
      "We model how work actually moves through the organization — who requests, who approves, who delivers — and engineer the workflow, documents and reporting around that model.",
    solutions: ["CRM", "Workflow Management", "Document Management", "Support Systems", "Business Intelligence", "AI Automation", "Enterprise Applications"],
    products: ["ZynCRM", "ZynAnalyst", "ZynIQ"],
    outcomes: ["Approvals that move without chasing", "Documents in one searchable place", "Shared visibility of client work", "Reporting that assembles itself"],
  },
  {
    slug: "other",
    name: "Other / Custom Industries",
    short: "Other",
    accent: "#0d9488",
    icon: Puzzle,
    heading: "Your industry isn't on this list.",
    lede: "Most of the work is the same regardless of sector: understand how the business actually operates, then engineer the system around it. Real estate and logistics are two we already build for.",
    problems: [
      "Real estate: leads lost between agents, property data in spreadsheets, no pipeline visibility",
      "Logistics: no live tracking for customers, manual dispatch and routing, proof of delivery lost on paper",
      "Any operation where the process is understood but the software for it doesn't exist",
    ],
    approach:
      "We don't begin with a technology stack. We begin with the business — which means an industry we haven't worked in yet is an analysis problem, not an obstacle.",
    solutions: ["Business Analysis", "Custom Systems", "Workflow Automation", "Analytics", "Integration"],
    products: ["ZynCRM", "ZynIQ"],
    outcomes: ["A system shaped around your operation", "Processes that scale past spreadsheets", "Visibility where there was none", "A roadmap rather than a one-off build"],
  },
];
