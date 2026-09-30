/**
 * Single typed source of truth for every project shown on the site.
 *
 * Rules for editing this file:
 *  - Never invent a fact. If something is unknown, leave the field off or set
 *    it to null, and add a `TODO:` comment so it shows up in the hand-off list.
 *  - `results` may only contain outcomes documented in the CV, worded as the
 *    CV words them, attached to the right project.
 *  - No URLs are invented. `liveDemo`, `downloadApk` and `github` stay null
 *    until a real, public, working link exists.
 *  - Adding an entry is enough: it appears in the grid, gets a
 *    `/projects/[slug]` route, and feeds SEO metadata automatically.
 */

export type ProjectType = "web" | "mobile" | "backend" | "ai";

export type ProjectStatus = "production" | "in-development";

export interface Project {
  slug: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  tagline: string;
  shortDescription: string;
  description: string;
  thumbnail: string | null;
  screenshots: { src: string; alt: string }[];
  /** Grouped so the case study can render labelled columns. */
  technologies: { category: string; items: string[] }[];
  features: string[];
  /**
   * Optional free-form tags. Used to group projects into sections on the home
   * page so no component ever has to match a project by name.
   */
  tags?: string[];
  /** Omitted entirely when the role is not documented — never guessed. */
  role?: string;
  problem?: string;
  solution?: string;
  challenges?: string[];
  architecture?: {
    nodes: { id: string; label: string; group?: string }[];
    edges: { from: string; to: string; label?: string }[];
  };
  results?: string[];
  caseStudy: boolean;
  liveDemo?: string | null;
  downloadApk?: string | null;
  github?: string | null;
}

export const PROJECT_TYPES: { value: ProjectType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "backend", label: "Backend" },
  { value: "ai", label: "AI" },
];

export const projects: Project[] = [
  {
    slug: "terahome",
    name: "TERAHOME",
    type: "web",
    status: "production",
    tagline: "ISP billing and network management platform",
    shortDescription:
      "Customer records, subscriptions, invoices, PPPoE accounts, and payments for an ISP, in one platform.",
    description:
      "An end-to-end platform for internet service providers. It covers the whole operational loop: customer and subscription records, recurring billing and invoice generation, synchronization of network accounts on MikroKit routers over PPPoE, online payment collection, WhatsApp notifications to customers, and operational dashboards for revenue, PPPoE status, traffic, and router health. I worked on it end to end, from backend services and REST APIs through database design and third-party integrations to deployment and production maintenance.",
    // TODO: add real screenshots captured with dummy data — see SCREENSHOTS.md
    thumbnail: null,
    screenshots: [],
    technologies: [
      {
        category: "Frontend",
        items: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Recharts"],
      },
      {
        category: "Backend",
        items: ["Node.js", "NestJS", "REST API", "BullMQ", "JWT"],
      },
      {
        category: "Database",
        items: ["PostgreSQL", "Prisma"],
      },
      {
        category: "Infra",
        items: ["Docker", "CI/CD", "Nginx"],
      },
      {
        category: "Integrations",
        items: ["MikroTik (PPPoE)", "Xendit", "WhatsApp"],
      },
    ],
    features: [
      "Customer and subscription management",
      "Recurring billing and invoice generation",
      "MikroTik PPPoE account synchronization",
      "Online payment collection through Xendit",
      "WhatsApp customer notifications",
      "Operational dashboards for customer statistics, revenue, PPPoE status, network traffic, and router health",
      "Role-based access and audit logs",
    ],
    tags: ["integration", "operations"],
    role: "Software Engineer — backend services, REST APIs, database workflows, third-party integrations, dashboards, CI/CD deployment, and production maintenance.",
    problem:
      "ISP operations were spread across disconnected tools. Customer records, billing, invoices, router accounts, and payment status each lived somewhere different, so day-to-day work meant a lot of manual reconciliation and manual monitoring.",
    solution:
      "One platform that owns the operational loop end to end. Billing state drives invoice generation, invoices drive payment collection through Xendit, and subscription state drives account synchronization on the MikroTik routers over PPPoE. Notifications go out over WhatsApp, and the dashboards surface the numbers that were previously assembled by hand.",
    challenges: [
      "Keeping network account state on the router in step with billing state without manual intervention.",
      "Handling asynchronous work — invoice generation, notifications, and payment callbacks — reliably rather than in the request path.",
      "Preserving a trustworthy audit trail of operational events across billing, payments, and customer records.",
    ],
    architecture: {
      nodes: [
        { id: "admin", label: "Admin app", group: "Clients" },
        { id: "portal", label: "Customer portal", group: "Clients" },
        { id: "isp", label: "ISP / field app", group: "Clients" },
        { id: "api", label: "REST API", group: "Application" },
        { id: "queue", label: "Job queue", group: "Application" },
        { id: "db", label: "PostgreSQL", group: "Data" },
        { id: "mikrotik", label: "MikroTik router", group: "External" },
        { id: "xendit", label: "Xendit", group: "External" },
        { id: "wa", label: "WhatsApp", group: "External" },
      ],
      edges: [
        { from: "admin", to: "api" },
        { from: "portal", to: "api" },
        { from: "isp", to: "api" },
        { from: "api", to: "db" },
        { from: "api", to: "queue", label: "enqueue" },
        { from: "queue", to: "mikrotik", label: "PPPoE sync" },
        { from: "queue", to: "wa", label: "notify" },
        { from: "xendit", to: "api", label: "payment webhook" },
      ],
    },
    results: [
      "Integrated MikroTik PPPoE and Xendit, automating network account synchronization and online payment processing while reducing manual operational tasks by approximately 50%.",
      "Built operational dashboards for customer statistics, revenue, PPPoE status, network traffic, and router health, reducing manual monitoring and reporting effort by approximately 40%.",
    ],
    caseStudy: true,
    // TODO: add the public URL once the platform is reachable on a real domain
    liveDemo: null,
    // not an APK project
    downloadApk: null,
    // TODO: add only if a public repository actually exists
    github: null,
  },

  {
    slug: "thinkpos",
    name: "THINKPOS",
    type: "mobile",
    status: "production",
    tagline: "Point of sale for barbershops",
    shortDescription:
      "A Flutter point of sale for barbershops, with cashier checkout, Excel reports, and thermal receipt printing.",
    description:
      "A Flutter point of sale built for barbershops, paired with a Node.js and Express API over PostgreSQL. It covers the daily counter workflow — cashier checkout, products and categories, employee records — and the reporting a shop actually needs: sales over time, staff activity, and exports the owner can open in Excel. Receipts print on ESC/POS thermal printers, and the app keeps a local SQLite cache so the counter keeps working through a flaky connection. Distributed as an APK.",
    // TODO: add real screenshots captured with dummy data — see SCREENSHOTS.md
    thumbnail: null,
    screenshots: [],
    technologies: [
      {
        category: "Mobile",
        items: ["Flutter", "Dart", "fl_chart", "SQFlite"],
      },
      {
        category: "Backend",
        items: ["Node.js", "Express.js", "REST API", "JWT"],
      },
      {
        category: "Database",
        items: ["PostgreSQL", "SQLite (offline cache)"],
      },
      {
        category: "Integrations",
        items: ["Thermal / ESC-POS printing", "Excel export", "Camera"],
      },
      {
        category: "Delivery",
        items: ["Android APK", "In-app updates"],
      },
    ],
    features: [
      "Cashier checkout flow",
      "Product and category management",
      "Employee management",
      "Sales dashboard with charts",
      "Excel report export",
      "Thermal receipt printing",
      "JWT authentication",
      "Local SQLite cache for offline counter work",
    ],
    tags: ["offline"],
    role: "Full-stack developer — Flutter mobile client, Node.js and Express API, PostgreSQL schema, and release packaging.",
    problem:
      "Barbershops were running the counter on paper or on a general-purpose POS that did not fit the way a barber works. Staff needed a fast checkout, and owners needed sales numbers they could actually read and export.",
    solution:
      "A purpose-built Flutter app for the counter. Checkout is the primary screen, sales data is charted for the owner, reports export to Excel, and receipts print on the thermal printers already sitting on the counter. A local SQLite cache keeps checkout working when the connection to the API is slow or down.",
    challenges: [
      "Keeping the counter usable when connectivity to the backend degrades.",
      "Driving ESC/POS thermal printers reliably across different printer models.",
      "Packaging and distributing updates to APK installs directly.",
    ],
    architecture: {
      nodes: [
        { id: "app", label: "Flutter app", group: "Clients" },
        { id: "cache", label: "Local cache", group: "Application" },
        { id: "api", label: "REST API", group: "Application" },
        { id: "db", label: "PostgreSQL", group: "Data" },
        { id: "printer", label: "Thermal printer", group: "External" },
      ],
      edges: [
        { from: "app", to: "api", label: "REST" },
        { from: "app", to: "cache", label: "offline" },
        { from: "api", to: "db" },
        { from: "app", to: "printer", label: "ESC/POS" },
      ],
    },
    results: [
      "Migrated production applications, databases, and file storage from shared hosting to VPS infrastructure, improving deployment and server resource efficiency by approximately 30%.",
    ],
    caseStudy: true,
    liveDemo: null,
    // TODO: add a public download URL for the release APK
    downloadApk: null,
    // TODO: add only if a public repository actually exists
    github: null,
  },

  {
    slug: "clockora",
    name: "CLOCKORA",
    type: "mobile",
    status: "production",
    tagline: "Attendance and workforce management",
    shortDescription:
      "A Flutter attendance app with QR check-in, geolocation, and photo capture, on an Express and PostgreSQL backend.",
    description:
      "An attendance and workforce management app for Flutter, backed by a Node.js and Express API over PostgreSQL. Attendance is captured where the person actually is: a QR code is scanned, the device records its location, and a photo is taken as evidence. The backend handles authentication, attendance records, and synchronization, with scheduled jobs for the reports and notifications that a supervisor needs each day. Distributed as an APK.",
    // TODO: add real screenshots captured with dummy data — see SCREENSHOTS.md
    thumbnail: null,
    screenshots: [],
    technologies: [
      {
        category: "Mobile",
        items: ["Flutter", "Dart", "Riverpod", "fl_chart"],
      },
      {
        category: "Backend",
        items: ["Node.js", "Express.js", "TypeORM", "REST API", "JWT"],
      },
      {
        category: "Database",
        items: ["PostgreSQL"],
      },
      {
        category: "Capabilities",
        items: ["QR scanning", "Geolocation", "Camera", "Secure storage", "Scheduled jobs"],
      },
      {
        category: "Delivery",
        items: ["Android APK", "In-app updates"],
      },
    ],
    features: [
      "QR code scanning for attendance capture",
      "Geolocation verification",
      "Photo capture as attendance evidence",
      "Attendance records and synchronization with the backend",
      "Scheduled jobs and local notifications",
      "Secure credential storage on device",
      "Workforce reporting and export",
    ],
    tags: ["workforce"],
    role: "Full-stack developer — Flutter mobile client, Node.js and Express API, PostgreSQL schema, scheduled jobs, and release packaging.",
    problem:
      "Manual attendance meant a paper log that was slow to check, easy to dispute, and impossible to turn into workforce data without retyping it.",
    solution:
      "Attendance is captured at the point of work and verified three ways at once — a scanned QR code, the device's location, and a photo — then synchronized to a backend that stores the record once and can report on it. Scheduled jobs handle the recurring summaries and reminders so nobody compiles them by hand.",
    challenges: [
      "Making attendance capture reliable on the device, including camera and location permission handling.",
      "Designing attendance and API contracts so the mobile app stays in step with the server.",
      "Running reliable scheduled work on the backend alongside the request path.",
    ],
    architecture: {
      nodes: [
        { id: "app", label: "Flutter app", group: "Clients" },
        { id: "api", label: "REST API", group: "Application" },
        { id: "jobs", label: "Scheduled jobs", group: "Application" },
        { id: "db", label: "PostgreSQL", group: "Data" },
        { id: "files", label: "File storage", group: "Data" },
      ],
      edges: [
        { from: "app", to: "api", label: "REST" },
        { from: "api", to: "db" },
        { from: "api", to: "files", label: "attachments" },
        { from: "jobs", to: "db" },
        { from: "jobs", to: "app", label: "notifications" },
      ],
    },
    results: [
      "Migrated production applications, databases, and file storage from shared hosting to VPS infrastructure, improving deployment and server resource efficiency by approximately 30%.",
    ],
    caseStudy: true,
    liveDemo: null,
    // TODO: add a public download URL for the release APK
    downloadApk: null,
    // TODO: add only if a public repository actually exists
    github: null,
  },

  {
    slug: "kopiflow",
    name: "KOPIFLOW",
    type: "web",
    status: "in-development",
    tagline: "Coffee business management",
    shortDescription:
      "Purchasing, warehouse stock, suppliers, production, sales, and costs for a coffee business.",
    description:
      "A web application for running a coffee business: purchase orders and warehouse stock movements, supplier records, production, cost tracking, sales, customers, and reporting. It is built on the Next.js App Router with Server Actions doing the writes, PostgreSQL through Prisma, and role-based access where an owner manages users and staff work within the modules they are allowed to touch. Several modules are still being finished.",
    // TODO: add real screenshots captured with dummy data — see SCREENSHOTS.md
    thumbnail: null,
    screenshots: [],
    technologies: [
      {
        category: "Frontend",
        items: [
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Tailwind CSS v4",
          "shadcn/ui",
          "Recharts",
        ],
      },
      {
        category: "Backend",
        items: ["Server Actions", "Auth.js v5", "JWT", "Zod"],
      },
      {
        category: "Database",
        items: ["PostgreSQL", "Prisma 5"],
      },
      {
        category: "Infra",
        items: ["Docker Compose"],
      },
    ],
    features: [
      "Purchasing and stock movement tracking",
      "Warehouse stock by coffee type, with opening balances",
      "Supplier management",
      "Production tracking",
      "Cost tracking, split into labour and operational costs",
      "Sales and customer records",
      "Reporting",
      "Role-based access with owner and staff roles",
    ],
    // TODO: role and dates are not in the CV — supply them here.
    problem:
      "A coffee business tracks stock, suppliers, production, and costs in separate places, so nobody has a single current answer to what is on hand, what it cost, or what was sold.",
    solution:
      "One web application covering that loop. Purchases move stock, stock feeds production and sales, and costs are captured as they happen, so the numbers on the dashboard come from the same records the staff actually enter.",
    challenges: [
      "Keeping stock movements consistent so derived stock always matches the underlying records.",
      "Protecting mutations at the Server Action boundary rather than trusting the UI.",
      "Making a partially finished set of modules usable without shipping half-built screens.",
    ],
    tags: ["operations"],
    caseStudy: false,
    liveDemo: null,
    downloadApk: null,
    // TODO: add only if a public repository actually exists
    github: null,
  },

  {
    slug: "ai-helpdesk-assistant",
    name: "AI Helpdesk Assistant",
    type: "ai",
    status: "production",
    tagline: "RAG-powered assistant for customer support",
    shortDescription:
      "A full-stack helpdesk with ticket workflows, rule-based routing, and a retrieval-augmented assistant.",
    description:
      "A full-stack enterprise application for customer support operations and service requests. It manages the ticket lifecycle — intake, assignment, categorization, and resolution — and layers on two pieces of automation: rule-based routing that sends a ticket to the right place based on its priority, category, and topic, and a retrieval-augmented assistant that pulls relevant knowledge and produces a contextual response so agents can stop hunting through documentation.",
    // TODO: add real screenshots captured with dummy data — see SCREENSHOTS.md
    thumbnail: null,
    screenshots: [],
    technologies: [
      {
        category: "Backend",
        items: ["Laravel", "PHP", "REST API"],
      },
      {
        category: "Database",
        items: ["MySQL"],
      },
      {
        category: "AI",
        items: ["Retrieval-Augmented Generation (RAG)"],
      },
    ],
    features: [
      "Ticket management, assignment, categorization, and resolution workflows",
      "Rule-based routing by priority, category, and topic",
      "Retrieval-augmented knowledge lookup with contextual responses",
    ],
    tags: ["ai", "automation"],
    role: "Full-stack engineer — the Laravel and MySQL core application, the RAG assistant, the routing and automation rules, plus testing, deployment, and ongoing improvements.",
    problem:
      "Support staff spent their time finding information and assigning work by hand. Relevant knowledge was scattered, and every new ticket had to be read and routed to a person manually.",
    solution:
      "Two targeted automations. Retrieval-augmented generation lets an agent ask the system and get a contextual answer grounded in the knowledge base. Rule-based routing assigns the ticket automatically from its priority, category, and topic, so assignment stops being a manual read-and-guess step.",
    challenges: [
      "Keeping generated answers grounded in the actual knowledge base instead of drifting.",
      "Encoding routing rules so automatic assignment matches how support actually triages.",
      "Testing and maintaining the application and the assistant together over time.",
    ],
    results: [
      "Built an AI-powered helpdesk assistant using RAG, enabling support teams to retrieve relevant knowledge and generate contextual responses, reducing manual knowledge lookup time by 80%.",
      "Implemented rule-based routing and automation based on priority, category, and topic, reducing manual ticket assignment effort by approximately 60%.",
    ],
    caseStudy: false,
    liveDemo: null,
    downloadApk: null,
    // TODO: add only if a public repository actually exists
    github: null,
  },

  {
    slug: "outstanding-delivery-automation",
    name: "Outstanding Delivery Automation",
    type: "backend",
    status: "production",
    tagline: "Delivery follow-up and supplier automation",
    shortDescription:
      "Automates outstanding-delivery follow-up, purchase order updates, and supplier communication.",
    description:
      "A software automation platform built to replace manual outstanding-delivery follow-up. It retrieves and processes delivery data automatically, keeps due dates and purchase orders current — including revisions and cancellations — and chases suppliers without someone doing it by hand. A companion Auto In Portal gives suppliers one place to enter their data, so the information arrives already in the shape the downstream processes need. Data is pulled from the Enterprise Planning System and fed into these automated flows.",
    // TODO: add real screenshots captured with dummy data — see SCREENSHOTS.md
    thumbnail: null,
    screenshots: [],
    // TODO: the CV describes this project but does not name its technologies.
    // Left empty rather than guessed — supply them here.
    technologies: [],
    features: [
      "Automated retrieval and processing of delivery data",
      "Automated due-date updates",
      "Purchase order revisions and cancellations",
      "Automated supplier follow-ups",
      "Auto In Portal for supplier data entry",
      "Integration with the Enterprise Planning System (EPS)",
    ],
    tags: ["automation"],
    // TODO: role and dates are not in the CV — supply them here.
    problem:
      "Outstanding deliveries were chased by hand. Someone pulled the data, worked out what was late, updated due dates and purchase orders, and then contacted suppliers one by one — every week.",
    solution:
      "Automate the whole loop. Delivery data is retrieved and processed without a person stepping in, due dates and purchase orders are updated or cancelled programmatically, and supplier follow-ups go out automatically. Suppliers enter what they have through the Auto In Portal so the data arrives ready to use, and the Enterprise Planning System feeds the process directly.",
    challenges: [
      "Waking up the right supplier automatically, with enough context for the follow-up to be useful.",
      "Keeping due dates and purchase order state correct across updates, revisions, and cancellations.",
      "Replacing a manual process end to end without losing a step that mattered.",
    ],
    results: [
      "Reduced processing time from 490 minutes/week to 60 minutes/week, achieving an approximately 88% reduction in processing time.",
    ],
    caseStudy: false,
    liveDemo: null,
    downloadApk: null,
    // TODO: add only if a public repository actually exists
    github: null,
  },
];

/** Projects carrying any of the given tags, in array order. */
export function getProjectsByTags(tags: string[]): Project[] {
  return projects.filter((project) =>
    project.tags?.some((tag) => tags.includes(tag)),
  );
}

/**
 * The projects highlighted on the home page. Order in this file is the
 * curation — the first N entries are the selected ones.
 */
export function getFeaturedProjects(limit = 4): Project[] {
  return projects.slice(0, limit);
}

/** Image path convention: everything for a project lives under this folder. */
export function projectImagePath(slug: string, file: string) {
  return `/projects/${slug}/${file}`;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Related projects for the "More Projects" section: same type first, then
 * whatever else exists, never the current project.
 */
export function getRelatedProjects(slug: string, limit = 3): Project[] {
  const current = getProject(slug);
  if (!current) return [];

  const others = projects.filter((project) => project.slug !== slug);
  const sameType = others.filter((project) => project.type === current.type);
  const rest = others.filter((project) => project.type !== current.type);

  return [...sameType, ...rest].slice(0, limit);
}
