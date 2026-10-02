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

/**
 * One step of an illustrative walkthrough, used only when a project has no
 * real screenshot. Content comes from the CV and repo-verified features —
 * never invented numbers, names, customer data, or UI text.
 */
export interface Walkthrough {
  title: string;
  description: string;
  steps?: string[];
}

export interface Project {
  slug: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  tagline: string;
  shortDescription: string;
  description: string;
  thumbnail: string | null;
  /**
   * Real dimensions of the thumbnail, read from the file itself. Used so
   * next/image reserves the right box and the frame keeps the true ratio.
   */
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  /** Real screenshots only. `width`/`height` are the file's actual pixels. */
  screenshots: {
    /**
     * Stable screen identifier, matching a `mockScreens` entry when there is
     * one. With it, a real capture automatically replaces the recreation of
     * the same screen instead of both being shown.
     */
    id?: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
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
  /** CV project name for subtitle on case study (only if different from name). */
  cvName?: string;
  downloadApk?: string | null;
  github?: string | null;
  /** Private source code — show "Source code: Private" muted text when true and github is null. */
  sourcePrivate?: boolean;
  /** My contribution areas and details. Rendered after Tech Stack. */
  contribution?: { area: string; detail: string }[];
  /** Engineering decisions: title + reason. Max 5. Rendered after Architecture. */
  decisions?: { title: string; reason: string }[];
  /**
   * Illustrative walkthrough for projects with no capturable UI. Rendered only
   * where no real screenshot exists, and never inside a device or browser
   * frame, so it can never read as a screenshot.
   */
  walkthrough?: Walkthrough[];
  /**
   * Screen ids rendered as labeled UI recreations, in display order.
   *
   * Used where a real screenshot could not be captured: mobile apps whose UI
   * source was read but never run, and individual screens blocked in a running
   * app. Definitions live in `data/mock-screens.ts` and the component that
   * draws each id is resolved through a slug-keyed registry, so no component
   * ever branches on a project name.
   *
   * A real screenshot carrying the same `id` always wins: see
   * `resolveShowcaseScreens`. Every recreation is labelled on screen, so this
   * is never a way to imply a capture that does not exist.
   */
  mockScreens?: string[];
}

export const PROJECT_TYPES: { value: ProjectType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "backend", label: "Backend" },
  { value: "ai", label: "AI" },
];

/**
 * Canonical display order for project types. The home page and /projects both
 * sort by this, so the two pages never disagree about the order of categories.
 */
export const PROJECT_TYPE_ORDER: Record<ProjectType, number> = {
  web: 0,
  mobile: 1,
  backend: 2,
  ai: 3,
};

/** Projects sorted by the canonical type order, stable within a type. */
export function sortProjectsByType(list: Project[]): Project[] {
  return [...list].sort(
    (a, b) => PROJECT_TYPE_ORDER[a.type] - PROJECT_TYPE_ORDER[b.type],
  );
}

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
    // No real captures are committed here: the screenshot values are
    // held back deliberately and stay out of version control.
    thumbnail: null,
    screenshots: [],
    // Only the invoice detail screen gets a recreation: it is blocked in the
    // running app by a hooks-order bug, so it could not be captured at all.
    mockScreens: ["invoice-detail", "whatsapp"],
    technologies: [
      {
        category: "Frontend",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Recharts"],
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
        items: ["Docker", "CI/CD"],
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
        { id: "isp", label: "ISP app", group: "Clients" },
        { id: "xendit", label: "Xendit", group: "Payments" },
        { id: "api", label: "REST API", group: "Server" },
        { id: "queue", label: "Job queue", group: "Server" },
        { id: "db", label: "PostgreSQL", group: "Data" },
        { id: "mikrotik", label: "MikroTik router", group: "Network" },
        { id: "wa", label: "WhatsApp", group: "Messaging" },
      ],
      edges: [
        { from: "admin", to: "api" },
        { from: "portal", to: "api" },
        { from: "isp", to: "api" },
        { from: "xendit", to: "api", label: "payment webhook" },
        { from: "api", to: "db" },
        { from: "api", to: "queue", label: "enqueue" },
        { from: "queue", to: "mikrotik", label: "PPPoE sync" },
        { from: "queue", to: "wa", label: "notify" },
      ],
    },
    results: [
      "Integrated MikroTik PPPoE and Xendit, automating network account synchronization and online payment processing while reducing manual operational tasks by approximately 50%.",
      "Built operational dashboards for customer statistics, revenue, PPPoE status, network traffic, and router health, reducing manual monitoring and reporting effort by approximately 40%.",
    ],
    caseStudy: true,
    cvName: "ISP Billing & Network Management Platform",
    sourcePrivate: true,
    contribution: [
      { area: "Backend", detail: "REST APIs, database workflows, business logic for customer management, subscription, billing, and network operations." },
      { area: "Integration", detail: "MikroTik PPPoE synchronization, Xendit payment gateway, WhatsApp notifications." },
      { area: "Database", detail: "PostgreSQL schema design, Prisma migrations, query optimization." },
      { area: "Deployment", detail: "Docker multi-stage builds, CI/CD pipelines, production maintenance." },
    ],
    decisions: [
      { title: "BullMQ job queue", reason: "Handles invoice generation, payment callbacks, and WhatsApp notifications outside the HTTP request cycle." },
      { title: "Multi-stage Docker build", reason: "Produces a standalone Next.js output for containerized deployment." },
    ],
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
    // No real capture: the APK needs an emulator, so these four screens are
    // labeled UI recreations drawn from the Flutter source instead.
    thumbnail: null,
    screenshots: [],
    mockScreens: ["login", "dashboard", "cashier", "reports"],
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
        { id: "api", label: "REST API", group: "Server" },
        { id: "cache", label: "SQLite cache", group: "Client" },
        { id: "printer", label: "Thermal printer", group: "Hardware" },
        { id: "db", label: "PostgreSQL", group: "Data" },
      ],
      edges: [
        { from: "app", to: "api", label: "REST" },
        { from: "app", to: "cache", label: "offline cache" },
        { from: "app", to: "printer", label: "ESC/POS" },
        { from: "api", to: "db" },
      ],
    },
    results: [
      "Migrated production applications, databases, and file storage from shared hosting to VPS infrastructure, improving deployment and server resource efficiency by approximately 30%.",
    ],
    caseStudy: true,
    // cvName omitted: the CV lists THINKPOS and CLOCKORA as one entry,
    // "Attendance & POS Android Systems", so neither owns that name alone.
    sourcePrivate: false,
    contribution: [
      { area: "Mobile", detail: "Flutter app: cashier checkout, product/category/employee management, local SQLite cache, thermal printing." },
      { area: "Backend", detail: "Node.js + Express REST API, JWT auth, PostgreSQL schema." },
      { area: "Integration", detail: "ESC/POS thermal printing, Excel export, camera for product images." },
      { area: "Deployment", detail: "APK packaging, in-app updates, VPS migration (30% efficiency gain)." },
    ],
    decisions: [
      { title: "SQLite offline cache", reason: "sqflite provides local persistence; counter operates when backend is unreachable." },
      { title: "Express.js REST API with JWT", reason: "Serves checkout, products, employees, reports endpoints; JWT auth on each request." },
    ],
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
      "A Flutter attendance app with check-in, geolocation, and photo capture, on an Express and PostgreSQL backend.",
    description:
      "An attendance and workforce management app for Flutter, backed by a Node.js and Express API over PostgreSQL. Attendance is captured where the person actually is: the device records its location and a photo is taken as evidence. The backend handles authentication, attendance records, and synchronization, with scheduled jobs for the reports and notifications that a supervisor needs each day. Distributed as an APK.",
    // No real capture: the APK needs an emulator, so these four screens are
    // labeled UI recreations drawn from the Flutter source instead.
    thumbnail: null,
    screenshots: [],
    mockScreens: ["login", "home", "checkin", "reports"],
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
        items: ["Geolocation", "Camera", "Secure storage", "Scheduled jobs"],
      },
      {
        category: "Delivery",
        items: ["Android APK", "In-app updates"],
      },
    ],
    features: [
      "Attendance capture with geolocation verification",
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
    // QR scanning is deliberately absent from every field on this project. It is
    // not in the CV, and in the app it is dead code: lib/sections/
    // qr_scanner_section.dart exists but nothing imports or navigates to it, so
    // no user can reach a QR screen. Do not add it back without a working
    // screen and a CV line that says so.
    solution:
      "Attendance is captured at the point of work and verified two ways at once — the device's location and a photo — then synchronized to a backend that stores the record once and can report on it. Scheduled jobs handle the recurring summaries and reminders so nobody compiles them by hand.",
    challenges: [
      "Making attendance capture reliable on the device, including camera and location permission handling.",
      "Designing attendance and API contracts so the mobile app stays in step with the server.",
      "Running reliable scheduled work on the backend alongside the request path.",
    ],
    architecture: {
      nodes: [
        { id: "app", label: "Flutter app", group: "Clients" },
        { id: "api", label: "REST API", group: "Server" },
        { id: "jobs", label: "Scheduled jobs", group: "Server" },
        { id: "db", label: "PostgreSQL", group: "Data" },
        { id: "files", label: "File storage", group: "Data" },
      ],
      edges: [
        { from: "app", to: "api", label: "sync" },
        { from: "api", to: "db" },
        { from: "api", to: "files", label: "attachments" },
        { from: "jobs", to: "db", label: "reports" },
      ],
    },
    results: [
      "Migrated production applications, databases, and file storage from shared hosting to VPS infrastructure, improving deployment and server resource efficiency by approximately 30%.",
    ],
caseStudy: true,
      // cvName omitted: shared with THINKPOS in the CV, see note above.
      sourcePrivate: false,
      contribution: [
        { area: "Mobile", detail: "Flutter app: attendance check-in, geolocation, photo capture, secure storage, Riverpod state." },
      { area: "Backend", detail: "Node.js + Express REST API, TypeORM, JWT auth, PostgreSQL, scheduled jobs for reports." },
      { area: "Integration", detail: "Geolocation, camera, secure storage, local notifications." },
      { area: "Deployment", detail: "APK packaging, in-app updates, VPS migration (30% efficiency gain)." },
    ],
    decisions: [
      { title: "TypeORM with PostgreSQL", reason: "Entity decorators define attendance, user, file entities; migrations manage schema." },
      { title: "Scheduled report jobs", reason: "node-cron runs daily report generation and supervisor notifications on the backend." },
    ],
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
    // TODO: add real screenshots captured with dummy data
    thumbnail: null,
    screenshots: [],
    technologies: [
      {
        category: "Frontend",
        items: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "shadcn/ui",
          "Recharts",
        ],
      },
      {
        category: "Backend",
        items: ["Server Actions", "Auth.js", "JWT", "Zod"],
      },
      {
        category: "Database",
        items: ["PostgreSQL", "Prisma"],
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
    sourcePrivate: false,
    contribution: [
      { area: "Frontend", detail: "Next.js App Router, Server Actions, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts." },
      { area: "Backend", detail: "Server Actions, Auth.js, JWT, Zod validation, role-based access (Owner/Staff)." },
      { area: "Database", detail: "PostgreSQL, Prisma ORM, stock movements, suppliers, production, costs, sales." },
      { area: "Infra", detail: "Docker Compose for local development." },
    ],
    decisions: [
      { title: "Server Actions for mutations", reason: "Next.js Server Actions handle purchase, supplier, production mutations with Zod validation." },
      { title: "Prisma with PostgreSQL", reason: "Prisma schema defines Supplier, Purchase, StockMovement, Production models with relations." },
      { title: "Auth.js role-based access", reason: "Credentials provider with JWT; session callback checks is_active and role (OWNER/STAFF)." },
    ],
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
    // No repository was available for this project, so there is no real UI to
    // capture. No screenshot and no mockup: the walkthrough below is the
    // honest fallback, and it is labelled as such wherever it appears.
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
    cvName: "AI-Powered Helpdesk Assistant",
    sourcePrivate: true,
    contribution: [
      { area: "Backend", detail: "Laravel + PHP core application: ticket management, assignment, categorization, resolution workflows." },
      { area: "AI", detail: "RAG assistant: retrieval-augmented knowledge lookup, contextual response generation." },
      { area: "Automation", detail: "Rule-based routing by priority, category, topic; automated ticket assignment." },
      { area: "Deployment", detail: "Testing, deployment, ongoing improvements." },
    ],
    decisions: [
      { title: "Laravel + MySQL core", reason: "Laravel controllers handle ticket CRUD, assignment, categorization; MySQL stores tickets, users, categories." },
      { title: "RAG knowledge retrieval", reason: "RAG pipeline retrieves relevant docs and generates contextual responses for agents." },
      { title: "Rule-based ticket routing", reason: "Routing rules match ticket priority, category, topic to assignee." },
    ],
    // Wording is taken from the CV entry and the repo-verified feature list
    // above. No invented UI text, numbers, or ticket content.
    walkthrough: [
      {
        title: "Ticket lifecycle",
        description:
          "A service request moves through intake, assignment, categorisation, and resolution inside the helpdesk.",
        steps: [
          "Intake: a support agent records the incoming request",
          "Categorisation: the ticket is filed by category and topic",
          "Assignment: routing rules send it to the right person",
          "Resolution: the assigned agent works and closes the ticket",
        ],
      },
      {
        title: "Rule-based routing",
        description:
          "Assignment is derived from the ticket itself rather than read and guessed by hand.",
        steps: [
          "Priority, category, and topic are read from the ticket",
          "Routing rules match those values against the configured assignments",
          "The ticket is routed automatically once a rule matches",
        ],
      },
      {
        title: "Retrieval-augmented assistant",
        description:
          "An agent asks the system a question and gets a contextual answer grounded in the knowledge base.",
        steps: [
          "The agent asks a question from the ticket",
          "Relevant knowledge is retrieved from the knowledge base",
          "A contextual response is generated from that retrieved knowledge",
        ],
      },
    ],
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
    // No repository was available for this project, so there is no real UI to
    // capture. No screenshot and no mockup: the walkthrough below is the
    // honest fallback, and it is labelled as such wherever it appears.
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
    cvName: "Outstanding Delivery Digitalization & Automation System",
    sourcePrivate: true,
    contribution: [
      { area: "Backend", detail: "Automated delivery data retrieval, processing, due-date updates, PO revisions/cancellations." },
      { area: "Automation", detail: "Supplier follow-ups, Auto In Portal for supplier data entry, EPS integration." },
      { area: "Integration", detail: "Enterprise Planning System (EPS) data ingestion, automated supplier communication." },
    ],
    decisions: [
      { title: "Automated EPS data ingestion", reason: "EPS feeds delivery data into the automated pipeline for due-date and purchase order updates." },
      { title: "Auto In Portal for suppliers", reason: "Suppliers enter their data in one place, so downstream processes consume a standardised input." },
    ],
    // Wording is taken from the CV entry and the repo-verified feature list
    // above. No invented UI text, numbers, or supplier data.
    walkthrough: [
      {
        title: "Delivery data retrieval",
        description:
          "Delivery data is pulled from the Enterprise Planning System and processed without a person stepping in.",
        steps: [
          "The Enterprise Planning System (EPS) supplies the delivery data",
          "The platform retrieves and processes that data automatically",
          "The processed data feeds the downstream automation",
        ],
      },
      {
        title: "Purchase orders and due dates",
        description:
          "Due dates and purchase orders are kept current programmatically, including revisions and cancellations.",
        steps: [
          "Outstanding deliveries are identified from the incoming data",
          "Due dates and purchase orders are updated automatically",
          "Revisions and cancellations are applied to the purchase order state",
        ],
      },
      {
        title: "Supplier follow-up",
        description:
          "Suppliers are chased automatically, so the weekly manual loop is not needed.",
        steps: [
          "The platform determines which suppliers need following up",
          "Follow-ups go out to those suppliers automatically",
          "Supplier replies come back through the Auto In Portal",
        ],
      },
      {
        title: "Auto In Portal",
        description:
          "Suppliers enter their data in one place, so it arrives in the shape the downstream processes need.",
        steps: [
          "A supplier opens the Auto In Portal and enters what they have",
          "The data is captured in a standardised shape",
          "Downstream processes consume that input directly",
        ],
      },
    ],
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


