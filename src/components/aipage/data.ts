import {
  BarChart3, Blocks, Bot, Briefcase, Building2, Compass, Eye, FileCheck2, FileSearch, Gauge, HeartHandshake, KeyRound, Layers3,
  Lightbulb, LockKeyhole, Megaphone, MessageCircle, Plug, Repeat, Rocket, Scale, ServerCog, Sparkles, Target, TrendingUp, Users,
  Wallet, Wand2, type LucideIcon,
} from "lucide-react";

/** /ai page content, from the client's AI page brief. Shared by the server page and its client scenes. */

export const opportunity: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Repeat, title: "Reduce repetitive work", desc: "Automate time-consuming tasks and streamline operational workflows." },
  { Icon: Lightbulb, title: "Make smarter decisions", desc: "Turn business data into insights, forecasts, and actionable recommendations." },
  { Icon: Sparkles, title: "Build intelligent experiences", desc: "Create applications that understand context and help users get more done." },
  { Icon: TrendingUp, title: "Scale with confidence", desc: "Build adaptable AI capabilities around your business goals and evolving needs." },
];

export type Solution = {
  title: string; short: string; tagline: string; desc: string; points: string[]; Icon: LucideIcon;
  vis: "integrate" | "agents" | "app" | "analytics" | "docs" | "strategy";
};
export const solutions: Solution[] = [
  { title: "AI Integration & Enhancement", short: "AI integration", tagline: "Make your existing systems smarter.", Icon: Plug, vis: "integrate",
    desc: "Integrate AI capabilities into existing business applications, websites, platforms, and workflows without unnecessarily replacing the systems your business already depends on.",
    points: ["AI integration with existing software and business tools", "Intelligent features for web applications and platforms", "AI-powered search, recommendations, and assistance", "Context-aware business information retrieval", "AI-enabled customer and employee experiences"] },
  { title: "AI Agents & Workflow Automation", short: "Agents & automation", tagline: "Move from manual processes to intelligent execution.", Icon: Bot, vis: "agents",
    desc: "Design AI-powered agents and automated workflows that can interpret information, coordinate tasks, use approved tools, and support business processes under defined permissions and oversight.",
    points: ["AI agents for business operations", "Multi-agent workflow orchestration", "Document processing and information extraction", "Automated reporting and task coordination", "Human approval workflows and exception handling"] },
  { title: "Custom AI Application Development", short: "Custom AI apps", tagline: "Build AI around your unique business needs.", Icon: Wand2, vis: "app",
    desc: "Develop purpose-built AI applications that solve specific business challenges, from intelligent internal assistants to specialized platforms designed around your organization's workflows.",
    points: ["Custom AI-powered web applications", "Intelligent virtual assistants and chat interfaces", "Knowledge assistants for internal documents", "Retrieval-augmented generation (RAG) solutions", "AI-enabled business and industry-specific platforms"] },
  { title: "AI Analytics & Decision Intelligence", short: "Analytics & decisions", tagline: "Transform business data into better decisions.", Icon: BarChart3, vis: "analytics",
    desc: "Connect your business information with analytical and AI capabilities to help teams understand performance, identify patterns, investigate problems, and explore potential outcomes.",
    points: ["AI-powered business intelligence", "Natural-language questions over business data", "KPI analysis and performance insights", "Trend identification and anomaly detection", "Forecasting, scenario analysis, and decision support", "Automated analytical reports and visualizations"] },
  { title: "Intelligent Document & Knowledge Systems", short: "Documents & knowledge", tagline: "Make organizational knowledge easier to access and use.", Icon: FileSearch, vis: "docs",
    desc: "Help teams search, understand, summarize, and analyze business documents through AI systems grounded in authorized organizational information.",
    points: ["Document search and conversational Q&A", "PDF, Word, Excel, and structured-data analysis", "Source references and evidence-backed responses", "Cross-document comparison and summarization", "Internal knowledge assistants and document workflows"] },
  { title: "AI Strategy & Implementation Consulting", short: "Strategy & consulting", tagline: "Start with the right problem, not just the latest technology.", Icon: Compass, vis: "strategy",
    desc: "Identify where AI can create meaningful value, assess readiness, prioritize use cases, and establish a practical implementation roadmap before investing in complex solutions.",
    points: ["AI opportunity and readiness assessments", "Business process and use-case analysis", "Technology and model selection", "Proof-of-concept development", "Implementation roadmaps and success metrics", "Responsible AI practices and governance planning"] },
];

export const functions: { Icon: LucideIcon; title: string; uses: string[] }[] = [
  { Icon: Wallet, title: "Finance & Operations", uses: ["Financial document analysis", "Expense categorization", "Budget-versus-actual insights", "Management reporting", "Workflow automation"] },
  { Icon: MessageCircle, title: "Sales & Customer Experience", uses: ["Lead qualification support", "Customer inquiry assistants", "Conversation summaries", "Sales insights", "Personalized customer journeys"] },
  { Icon: Megaphone, title: "Marketing & Growth", uses: ["Campaign analysis", "Audience insights", "Content workflows", "Marketing performance reports", "Data-informed strategy"] },
  { Icon: Users, title: "Human Resources", uses: ["HR policy assistants", "Employee self-service", "Document processing", "Recruitment workflow support", "Workforce reporting"] },
  { Icon: Briefcase, title: "Projects & Management", uses: ["Project status summaries", "Schedule-risk signals", "Progress reporting", "Resource insights", "Decision support"] },
  { Icon: Building2, title: "Industry & Enterprise Systems", uses: ["Industry-specific assistants", "Operational intelligence", "Knowledge systems", "AI-enhanced applications"] },
];

export const steps: { title: string; desc: string }[] = [
  { title: "Discover & Understand", desc: "We examine your business objectives, existing processes, challenges, data sources, and operational environment." },
  { title: "Identify & Strategize", desc: "We evaluate potential AI use cases, feasibility, risks, expected value, and the best-fit implementation approach." },
  { title: "Design & Engineer", desc: "We design the solution architecture, data workflows, integrations, user experience, and AI components." },
  { title: "Build & Validate", desc: "We develop and test the solution against defined requirements, real-world scenarios, performance expectations, and relevant security controls." },
  { title: "Deploy & Integrate", desc: "We implement the solution within your operational environment, with appropriate access controls, monitoring, and user guidance." },
  { title: "Optimize & Evolve", desc: "We evaluate performance, gather feedback, improve workflows, and identify opportunities for further business value." },
];

export const why: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: Target, title: "Business-first thinking", desc: "We prioritize actual business challenges and measurable objectives over technology for its own sake." },
  { Icon: Layers3, title: "End-to-end engineering", desc: "We combine AI, software, integrations, and data workflows into practical solutions." },
  { Icon: HeartHandshake, title: "Tailored to your operations", desc: "Solutions are designed around your workflows, constraints, users, and organizational goals." },
  { Icon: Scale, title: "Responsible implementation", desc: "We consider data protection, access permissions, validation, human oversight, and operational reliability." },
  { Icon: Blocks, title: "Built to integrate", desc: "We consider existing systems and data environments to reduce unnecessary disruption." },
  { Icon: Rocket, title: "Designed to evolve", desc: "Our approach supports iterative improvement as your requirements and business grow." },
];

export const trust: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: LockKeyhole, title: "Data protection", desc: "Design appropriate safeguards for sensitive business information." },
  { Icon: KeyRound, title: "Access control", desc: "Restrict information and actions according to user permissions." },
  { Icon: FileCheck2, title: "Grounded responses", desc: "Where applicable, connect AI answers to authorized source documents and supporting evidence." },
  { Icon: Eye, title: "Human oversight", desc: "Keep people involved in consequential decisions and actions where required." },
  { Icon: Gauge, title: "Reliability and evaluation", desc: "Test output quality, monitor limitations, and define suitable validation procedures." },
  { Icon: ServerCog, title: "Deployment flexibility", desc: "Evaluate cloud, private, and local deployment options where technically and commercially appropriate." },
];

export const faqs: [string, string][] = [
  ["What types of AI solutions does Zyntraz develop?", "Zyntraz works across AI integration, custom AI applications, AI agents, workflow automation, business intelligence, document intelligence, and AI strategy. The right solution depends on your business goals and technical environment."],
  ["Can you integrate AI into our existing software?", "In many cases, yes. We review how your current systems store and share information — through APIs, databases or exports — and where AI would add value, then integrate it without replacing what already works. Where a system can't be connected directly, we recommend the most practical alternative."],
  ["Can AI analyze our internal business documents?", "Yes. We build document and knowledge systems that can search, summarize, compare and answer questions over your authorized documents — including PDF, Word, Excel and structured data — with references to the sources used. Access follows the permissions you define."],
  ["Do we need to train our own AI model?", "Usually not. Most business solutions combine established AI models with your own information through retrieval, integration and workflow design. Training or fine-tuning a model is considered only where it offers clear value, and we explain the trade-offs before recommending it."],
  ["Can AI solutions run in a private or local environment?", "It depends on your requirements. We evaluate cloud, private and local deployment options against your data sensitivity, regulatory obligations, performance needs and budget, and recommend the architecture that fits."],
  ["How long does an AI project take?", "It depends on the scope. A focused proof of concept is much shorter than a production system with several integrations. After an initial assessment of your requirements, we provide a timeline for your specific project."],
  ["How much does AI development cost?", "Cost depends on the solution's scope, integrations, data preparation, deployment environment and ongoing support. We usually recommend starting with an assessment or proof of concept, after which we provide a clear estimate."],
];

/** The capability ticker under the hero. */
export const ticker = [
  "AI Integration", "AI Agents", "Workflow Automation", "Retrieval-Augmented Generation", "Document Intelligence", "Natural-Language Analytics",
  "Forecasting", "Anomaly Detection", "Knowledge Assistants", "Decision Support", "Human-in-the-Loop", "AI Strategy",
];
