// The single source of truth for site structure: drives the header (top-level items only), the
// footer columns and sitemap.ts. The groups feed the sitemap so every sub-page is still indexed.
//
// `phase: 2` marks routes from the content architecture that are planned but not written yet.
// They stay in this tree so the whole structure is reviewable in one place, and are filtered out of
// everything rendered (see `navTree`, `footerColumns`, `sitemapRoutes`). Drop the flag to ship one.

export type NavLink = { label: string; href: string; desc?: string; phase?: 2 };
export type NavGroup = { title: string; links: NavLink[] };
export type NavItem = { label: string; href: string; groups?: NavGroup[]; phase?: 2 };

export const CTA = { label: "Let's Transform", href: "/contact" };

const tree: NavItem[] = [
  {
    label: "Solutions",
    href: "/solutions",
    groups: [
      {
        title: "Engineering capabilities",
        links: [
          // Software and IoT are anchors on the /solutions hub until they earn their own pages;
          // AI already has a full page of its own, so it is a real route.
          { label: "Software & Digital Systems", href: "/solutions#software", desc: "Custom applications, platforms, portals and workflows." },
          { label: "AI & Intelligence", href: "/solutions/ai-intelligence", desc: "Agents, document intelligence, analytics and decision support." },
          { label: "IoT & AIoT", href: "/solutions#iot", desc: "Connected devices, monitoring and smart automation." },
        ],
      },
      {
        title: "Where to start",
        links: [
          { label: "Business Transformation", href: "/transformation", desc: "How we move a business from where it is to what it could be." },
          { label: "How We Work", href: "/how-we-work", desc: "Consultation to continuous improvement, in six steps." },
          { label: "Build Your System", href: "/system-builder", desc: "Design your own system, see it live and send us the blueprint." },
        ],
      },
    ],
  },
  {
    label: "AI",
    href: "/ai",
    groups: [
      {
        title: "ZYNTRAZ AI",
        links: [
          { label: "Our AI solutions", href: "/ai#solutions", desc: "Integration, agents, custom apps, analytics, documents and strategy." },
          { label: "AI across your business", href: "/ai#across-business", desc: "Finance, sales, marketing, HR, projects and more." },
        ],
      },
      {
        title: "Go deeper",
        links: [
          { label: "Our approach", href: "/ai#approach", desc: "From business challenge to intelligent solution." },
          { label: "AI products", href: "/products#ai-products", desc: "ZynAgent, ZynDocs, ZynAnalyst and ZynDecide." },
          { label: "AI & Intelligence engineering", href: "/solutions/ai-intelligence", desc: "How we design, build and deploy AI." },
        ],
      },
    ],
  },
  {
    label: "Products",
    href: "/products",
    groups: [
      {
        title: "Hospitality",
        links: [
          { label: "ZynRest", href: "/products/zynrest", desc: "Restaurant Management" },
          { label: "ZynStay", href: "/products/zynstay", desc: "Hotel Management" },
          { label: "ZynEvents", href: "/products/zynevents", desc: "Events Management" },
        ],
      },
      {
        title: "Business Systems",
        links: [
          { label: "ZynCRM", href: "/products/zyncrm", desc: "Customer Relationship" },
          { label: "ZynIQ", href: "/products/zyniq", desc: "Business Intelligence" },
        ],
      },
      {
        title: "AI Products",
        links: [
          { label: "ZynAgent", href: "/products/zynagent", desc: "AI Agents" },
          { label: "ZynDocs", href: "/products/zyndocs", desc: "AI Document Intelligence" },
          { label: "ZynAnalyst", href: "/products/zynanalyst", desc: "AI Business Analyst" },
          { label: "ZynDecide", href: "/products/zyndecide", desc: "AI Decision Intelligence" },
          { label: "All products", href: "/products", desc: "The complete product ecosystem." },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    groups: [
      {
        title: "Build",
        links: [
          { label: "Software Engineering", href: "/services#software-engineering" },
          { label: "AI Engineering", href: "/services#ai-engineering" },
          { label: "Data & Business Intelligence", href: "/services#data-bi" },
          { label: "IoT & AIoT Engineering", href: "/services#iot-aiot" },
        ],
      },
      {
        title: "Transform & sustain",
        links: [
          { label: "Digital Transformation", href: "/services#digital-transformation" },
          { label: "Business Systems Consulting", href: "/services#consulting" },
          { label: "Ongoing Engineering", href: "/services#ongoing" },
        ],
      },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    groups: [
      {
        title: "Industries we engineer for",
        links: [
          { label: "Hospitality", href: "/industries#hospitality" },
          { label: "Healthcare", href: "/industries#healthcare" },
          { label: "Education", href: "/industries#education" },
          { label: "Retail & E-Commerce", href: "/industries#retail" },
          { label: "Corporate & Professional Services", href: "/industries#corporate" },
          { label: "Other / Custom Industries", href: "/industries#other" },
        ],
      },
    ],
  },
  {
    label: "About",
    href: "/about",
    groups: [
      {
        title: "Company",
        links: [
          { label: "About ZYNTRAZ", href: "/about" },
          { label: "How We Work", href: "/how-we-work" },
          { label: "Careers", href: "/careers", phase: 2 },
          { label: "FAQ", href: "/faq", phase: 2 },
        ],
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

const live = (l: NavLink) => l.phase !== 2;

/** The tree with unwritten (phase 2) routes removed — what the header and mobile menu render. */
export const navTree: NavItem[] = tree
  .filter((i) => i.phase !== 2)
  .map((i) => {
    const groups = i.groups
      ?.map((g) => ({ ...g, links: g.links.filter(live) }))
      .filter((g) => g.links.length > 0);
    return groups?.length ? { ...i, groups } : { label: i.label, href: i.href };
  });

/** Footer columns, per the architecture's footer grouping. */
export const footerColumns: NavGroup[] = [
  {
    title: "Company",
    links: ([
      { label: "About", href: "/about" },
      { label: "How We Work", href: "/how-we-work" },
      { label: "Careers", href: "/careers", phase: 2 },
    ] as NavLink[]).filter(live),
  },
  {
    title: "Solutions",
    links: [
      { label: "ZYNTRAZ AI", href: "/ai" },
      { label: "Software & Digital Systems", href: "/solutions#software" },
      { label: "AI & Intelligence", href: "/solutions/ai-intelligence" },
      { label: "IoT & AIoT", href: "/solutions#iot" },
      { label: "Transformation", href: "/transformation" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "ZynRest", href: "/products/zynrest" },
      { label: "ZynStay", href: "/products/zynstay" },
      { label: "Business Systems", href: "/products#business-systems" },
      { label: "AI Products", href: "/products#ai-products" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Hospitality", href: "/industries#hospitality" },
      { label: "Healthcare", href: "/industries#healthcare" },
      { label: "Education", href: "/industries#education" },
      { label: "Retail & E-Commerce", href: "/industries#retail" },
      { label: "Corporate", href: "/industries#corporate" },
    ],
  },
  {
    title: "Resources",
    links: ([
      { label: "Insights", href: "/insights", phase: 2 },
      { label: "FAQ", href: "/contact#faq" },
    ] as NavLink[]).filter(live),
  },
  {
    title: "Contact",
    links: [
      { label: "Start a Conversation", href: "/contact" },
      { label: "Request a Consultation", href: "/consultation" },
      { label: "Build Your System", href: "/system-builder" },
    ],
  },
];

/** Every real page on the site, for sitemap.ts. Anchors and phase-2 routes are excluded. */
export function sitemapRoutes(): string[] {
  const out = new Set<string>(["/"]);
  const add = (href: string) => {
    if (!href.includes("#")) out.add(href);
  };
  for (const item of navTree) {
    add(item.href);
    for (const group of item.groups ?? []) for (const link of group.links) add(link.href);
  }
  for (const col of footerColumns) for (const link of col.links) add(link.href);
  return [...out].sort();
}
