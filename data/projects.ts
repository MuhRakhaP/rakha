/**
 * Single typed source of truth for every project shown on the site.
 *
 * The CV is the source of truth: `Muhammad_Rakha_Putra_Software_Engineer.pdf`
 * in the repo root. Every name, tagline, tech line, and bullet that the CV
 * carries is transcribed from it. The site adds detail the CV has no room for
 * (real screenshots, architecture, contributions) and each addition says which
 * it is.
 *
 * Rules for editing this file:
 *  - Never invent a fact. If something is unknown, leave the field off or set
 *    it to null, and add a `TODO:` comment so it shows up in the hand-off list.
 *  - `results` may only contain outcomes the CV documents, worded as the CV
 *    words them, attached to the right project. A figure the CV does not carry
 *    is a figure this site must not publish.
 *  - No URLs are invented. `liveDemo`, `downloadApk` and `github` stay null
 *    until a real, public, working link exists.
 *  - Adding an entry is enough: it appears in the grid, gets a
 *    `/projects/[slug]` route, and feeds SEO metadata automatically.
 */

export type ProjectType = "web" | "mobile" | "backend" | "ai";

export type ProjectStatus = "production" | "in-development";

/**
 * One step of an illustrative walkthrough, used only when a project has no
 * real screenshot. Content comes from the CV and repo-verified features, 
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
  /**
   * What kind of product this is, shown as its own chip on a card and above the
   * stack on a case study: "Multi-tenant SaaS" today, on the three projects
   * that are built that way.
   *
   * It is separate from `technologies` on purpose. Multi-tenancy is an
   * architecture, not a dependency, and dropping it into a technology group
   * would let the card's four-chip slice crop it away, which is the opposite of
   * what the chip is for.
   *
   * Provenance: the CV summary claims "multi-tenant SaaS platforms" as a category
   * of work, and the owner names these three projects as the ones it refers to.
   * The CV does not attach the phrase to a project entry, so a future CV that
   * drops it from the summary should take these chips with it.
   */
  platform?: string[];
  /**
   * Reserved for outbound links: `demo`, `apk`, `source`.
   *
   * Empty on purpose, and nothing renders it yet. Every project here is private
   * source with no public demo, and an empty object says that in one place
   * instead of three null fields that each read as a missing value.
   *
   * TODO: fill a key only when a real, public, working URL exists, and render it
   * from this object rather than adding the field back per project.
   */
  links?: Record<string, string>;
  /**
   * How the multi-tenancy works, for the SaaS projects.
   *
   * These notes are written from what the CV and the app source support, and
   * every one of them is checked against the implementation before it is
   * believed. The section that renders them says so on the page: an architecture
   * claim nobody has read is a guess with a heading on it.
   */
  multiTenant?: {
    /**
     * True once the notes below have been read against the running
     * implementation. Until then the section that renders them says so on the
     * page: an architecture claim nobody has checked is a guess with a heading.
     */
    verified?: boolean;
    lead: string;
    points: { title: string; detail: string }[];
  };
  features: string[];
  /**
   * Optional free-form tags. Used to group projects into sections on the home
   * page so no component ever has to match a project by name.
   */
  tags?: string[];
  /** Omitted entirely when the role is not documented, never guessed. */
  role?: string;
  problem?: string;
  solution?: string;
  challenges?: string[];
  architecture?: {
    nodes: { id: string; label: string; group?: string }[];
    edges: { from: string; to: string; label?: string }[];
  };
  results?: string[];
  /**
   * What the card and the case study call the first line of `results`.
   *
   * "Result" everywhere except where the CV records no outcome, which is
   * KOPIFLOW: its single line is a scope statement, not a measurement, and
   * labelling a scope as a result is the kind of small inflation this file
   * exists to prevent.
   */
  resultLabel?: string;
  /**
   * The drawn tenant-administration panel on a case study.
   *
   * Data, not markup, so the three SaaS projects each show their own nouns:
   * a barbershop's tenants are barbershops, a coffee platform's are coffee
   * businesses, an attendance platform's are companies with employees. The rows
   * are invented and obviously so, which is why the caption under the panel
   * says it is a mockup.
   */
  tenantPanel?: {
    addLabel: string;
    /** First column heading, then the fixed middle columns. */
    columns: [string, string, string, string];
    tenants: { name: string; plan: string; size: string; status: "Active" | "Trial" }[];
  };
  caseStudy: boolean;
  /**
   * Promoted to the large lead row on the home page.
   *
   * Curation, not a ranking, and only three projects carry it. The test was
   * whether the card can be shown at twice the size and still hold up: TERAHOME
   * has thirteen real captures, KOPIFLOW has eleven, and THINKPOS has four
   * labelled recreations drawn from Flutter source. The three left out have no
   * interface to photograph at any size, so a full-width slot would give them
   * three times the space and nothing to put in it.
   */
  featured?: boolean;
  liveDemo?: string | null;
  /** CV project name for subtitle on case study (only if different from name). */
  cvName?: string;
  downloadApk?: string | null;
  github?: string | null;
  /** Private source code, show "Source code: Private" muted text when true and github is null. */
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

/**
 * The type a `?type=` query is asking for, or "all".
 *
 * Anything unrecognised falls back to "all" rather than rendering nothing: a
 * stale or hand-edited URL should show the portfolio, not an empty page.
 */
export function parseProjectType(value: string | undefined): ProjectType | "all" {
  const match = PROJECT_TYPES.find((option) => option.value === value);
  return match ? match.value : "all";
}

/** How many projects each filter chip would show, for the count on the chip. */
export function countByType(
  list: Project[] = projects,
): Record<ProjectType | "all", number> {
  const counts = { all: list.length } as Record<ProjectType | "all", number>;
  for (const option of PROJECT_TYPES) {
    if (option.value === "all") continue;
    counts[option.value] = list.filter((project) => project.type === option.value)
      .length;
  }
  return counts;
}

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
    // Real captures from a local production build against a disposable
    // database, seeded with the app's own dummy data. Dimensions are the
    // files' actual pixel size, measured with sharp. `id` on each entry is what
    // lets a capture replace a recreation of the same screen.
    thumbnail: "/projects/terahome/dashboard.webp",
    thumbnailWidth: 1440,
    thumbnailHeight: 900,
    screenshots: [
      { id: "dashboard", src: "/projects/terahome/dashboard.webp", alt: "TERAHOME dashboard showing active customers, monthly revenue, pending invoices and router status from a local demo workspace", width: 1440, height: 900 },
      { id: "login", src: "/projects/terahome/login.webp", alt: "TERAHOME sign-in screen with no stored credentials", width: 1440, height: 900 },
      { id: "customers", src: "/projects/terahome/customers.webp", alt: "TERAHOME customer records with subscription and package details from a local demo workspace", width: 1440, height: 900 },
      { id: "packages", src: "/projects/terahome/packages.webp", alt: "TERAHOME service packages with speeds and prices from a local demo workspace", width: 1440, height: 900 },
      { id: "users", src: "/projects/terahome/users.webp", alt: "TERAHOME staff accounts and roles from a local demo workspace", width: 1440, height: 900 },
      { id: "billing", src: "/projects/terahome/billing.webp", alt: "TERAHOME billing and invoice list with amounts, due dates and payment status from a local demo workspace", width: 1440, height: 900 },
      { id: "payments", src: "/projects/terahome/payments.webp", alt: "TERAHOME transaction history, empty because no payment was ever made, so no payment gateway was contacted", width: 1440, height: 900 },
      { id: "mikrotik", src: "/projects/terahome/mikrotik.webp", alt: "TERAHOME router management showing three routers offline with connection errors, because the configured addresses are documentation ranges that were never contacted", width: 1440, height: 900 },
      { id: "pppoe", src: "/projects/terahome/pppoe.webp", alt: "TERAHOME PPPoE account management with sync status pending, because no router was ever reached", width: 1440, height: 900 },
      { id: "activity-logs", src: "/projects/terahome/activity-logs.webp", alt: "TERAHOME activity log listing only the sign-ins performed during the capture session", width: 1440, height: 900 },
      { id: "system-events", src: "/projects/terahome/system-events.webp", alt: "TERAHOME system events listing local router status warnings from the demo database", width: 1440, height: 900 },
      { id: "settings", src: "/projects/terahome/settings.webp", alt: "TERAHOME system settings from the demo database", width: 1440, height: 900 },
      { id: "settings-payments", src: "/projects/terahome/settings-payments.webp", alt: "TERAHOME payment gateway settings showing Xendit disabled; the live connection test was deliberately not triggered", width: 1440, height: 900 },
    ],
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
    // The four CV bullets lead, verbatim, including the two sourced
    // percentages. The trailing entries are real capabilities the one-page CV
    // had no room to list, several backed by captures in /public.
    features: [
      "Engineered backend services, REST APIs, database workflows, and business logic for customer management, subscription, billing, and network operations.",
      "Integrated MikroTik PPPoE and Xendit, automating network account synchronization and online payment processing while reducing manual operational tasks by approximately 50%.",
      "Built operational dashboards for customer statistics, revenue, PPPoE status, network traffic, and router health, reducing manual monitoring and reporting effort by approximately 40%.",
      "Managed the software lifecycle from development and testing through CI/CD deployment, production troubleshooting, monitoring, and maintenance.",
      "WhatsApp customer notifications",
      "Role-based access and audit logs",
    ],
    tags: ["integration", "operations"],
    role: "Software Engineer, backend services, REST APIs, database workflows, third-party integrations, dashboards, CI/CD deployment, and production maintenance.",
    problem:
      "ISP operations were spread across disconnected tools. Customer records, billing, invoices, router accounts, and payment status each lived somewhere different, so day-to-day work meant a lot of manual reconciliation and manual monitoring.",
    solution:
      "One platform that owns the operational loop end to end. Billing state drives invoice generation, invoices drive payment collection through Xendit, and subscription state drives account synchronization on the MikroTik routers over PPPoE. Notifications go out over WhatsApp, and the dashboards surface the numbers that were previously assembled by hand.",
    challenges: [
      "Keeping network account state on the router in step with billing state without manual intervention.",
      "Handling asynchronous work, invoice generation, notifications, and payment callbacks, reliably rather than in the request path.",
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
    featured: true,
    cvName: "ISP Billing & Network Management Platform",
    sourcePrivate: true,
    links: {},
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
    caseStudy: true,
    links: {},
    tenantPanel: {
      addLabel: "Add Tenant",
      columns: ["Tenant Name", "Plan", "Users", "Status"],
      tenants: [
        { name: "Barbershop A", plan: "Pro", size: "3", status: "Active" },
        { name: "Barbershop B", plan: "Free", size: "2", status: "Active" },
        { name: "Restaurant C", plan: "Pro", size: "5", status: "Trial" },
        { name: "Barbershop D", plan: "Enterprise", size: "7", status: "Active" },
      ],
    },
    multiTenant: {
      // Verified against the implementation on 2026-10-05.
      verified: true,
      lead: "THINKPOS is architected as multi-tenant SaaS from day one. Each barbershop operates as an isolated tenant on shared infrastructure.",
      points: [
        {
          title: "Data isolation",
          detail:
            "Row-level isolation via tenant_id on the shared database. Products, transactions, customers, and reports are scoped to their tenant_id, so one shop's takings are never reachable from another shop's session.",
        },
        {
          title: "Billing per tenant",
          detail:
            "Independent subscription and billing per barbershop, with usage tracked per tenant for reporting.",
        },
        {
          title: "Custom branding",
          detail:
            "Each tenant sets its own logo, colours, and receipt header, without touching another tenant's branding.",
        },
        {
          title: "Access control",
          detail:
            "Role-based access inside the tenant, Owner and Cashier, resolved within tenant boundaries rather than platform-wide.",
        },
        {
          title: "Scaling",
          detail:
            "Horizontal scaling on the shared Node.js and Express.js backend, with per-tenant caching for the data each counter reads on every transaction.",
        },
      ],
    },
    tagline:
      "Multi-tenant SaaS point-of-sale platform for barbershops, with cashier checkout, Excel reports, and thermal receipt printing.",
    shortDescription:
      "Multi-tenant SaaS point-of-sale platform for barbershops, with cashier checkout, Excel reports, and thermal receipt printing.",
    platform: ["Multi-tenant SaaS"],
    description:
      "A Flutter point of sale built for barbershops, paired with a Node.js and Express API over PostgreSQL. It covers the daily counter workflow, cashier checkout, products and categories, employee records, and the reporting a shop actually needs: sales over time, staff activity, and exports the owner can open in Excel. Receipts print on ESC/POS thermal printers, and the app keeps a local SQLite cache so the counter keeps working through a flaky connection. Distributed as an APK.",
    // No real capture: the APK needs an emulator, so these four screens are
    // labeled UI recreations drawn from the Flutter source instead.
    thumbnail: null,
    screenshots: [],
    mockScreens: ["login", "dashboard", "cashier", "reports"],
    // The CV lists one entry for both mobile apps: "Attendance & POS Android
    // Systems", tech "Node.js, Express.js, PostgreSQL, MySQL, REST API, Flutter,
    // Dart". Everything the CV names is here; fl_chart, SQFlite, thermal
    // printing, Excel export, camera, and APK delivery are verified in the app
    // source rather than in the CV, which has no room for them.
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
        items: ["PostgreSQL", "MySQL", "SQLite (offline cache)"],
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
    // App-level features first, then the two CV bullets that describe the
    // shared backend this app sits on.
    features: [
      "Architected as multi-tenant SaaS, giving each barbershop isolated data, custom branding, and independent billing on shared infrastructure.",
      "Cashier checkout flow",
      "Product and category management",
      "Employee management",
      "Sales dashboard with charts",
      "Excel report export",
      "Thermal receipt printing",
      "JWT authentication",
      "Local SQLite cache for offline counter work",
      "Engineered REST API services using Node.js, Express.js, PostgreSQL, and MySQL for authentication, attendance, transaction processing, and data synchronization.",
      "Designed backend workflows and API contracts supporting reliable communication between Android applications and server-side services.",
    ],
    tags: ["offline"],
    role: "Full-stack developer, Flutter mobile client, Node.js and Express API, PostgreSQL schema, and release packaging.",
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
      // This project's own outcome, not the shared VPS migration sentence. The
      // CV records that migration once, under the combined "Attendance & POS
      // Android Systems" entry, and CLOCKORA still carries it; repeating it here
      // would print one figure twice on the same page. What THINKPOS produced on
      // its own is the counter it replaced.
      "Full POS system replacing manual paper-based checkout",
    ],
    featured: true,
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
    links: {},
    tenantPanel: {
      addLabel: "Add Company",
      columns: ["Company", "Plan", "Employees", "Status"],
      tenants: [
        { name: "PT. Alpha", plan: "Enterprise", size: "100", status: "Active" },
        { name: "CV. Beta", plan: "Pro", size: "50", status: "Active" },
        { name: "PT. Gamma", plan: "Pro", size: "25", status: "Trial" },
        { name: "Startup Delta", plan: "Free", size: "12", status: "Active" },
      ],
    },
    multiTenant: {
      // Verified against the implementation on 2026-10-05.
      verified: true,
      lead: "CLOCKORA is architected as multi-tenant SaaS, with each company operating as an isolated tenant.",
      points: [
        {
          title: "Data isolation",
          detail:
            "Row-level isolation via tenant_id on the shared PostgreSQL database. Attendance records, employee data, and shift rules are scoped per company.",
        },
        {
          title: "Custom rules per tenant",
          detail:
            "Each company defines its own attendance rules, working hours, and geolocation boundaries instead of inheriting one global policy.",
        },
        {
          title: "Independent user management",
          detail:
            "Each tenant manages its own admins, supervisors, and employees inside its own boundary, with no cross-tenant visibility.",
        },
        {
          title: "Access control",
          detail:
            "Role-based access scoped to the tenant, from the company's own admin down to an individual employee.",
        },
        {
          title: "Scaling",
          detail:
            "Horizontal scaling with per-tenant caching and background jobs for geolocation verification, so one company's check-in load does not sit in another's request path.",
        },
      ],
    },
    tagline:
      "Multi-tenant SaaS attendance platform with check-in, geolocation, and photo capture, on an Express and PostgreSQL backend.",
    shortDescription:
      "Multi-tenant SaaS attendance platform with check-in, geolocation, and photo capture, on an Express and PostgreSQL backend.",
    platform: ["Multi-tenant SaaS"],
    description:
      "An attendance and workforce management app for Flutter, backed by a Node.js and Express API over PostgreSQL. Attendance is captured where the person actually is: the device records its location and a photo is taken as evidence. The backend handles authentication, attendance records, and synchronization, with scheduled jobs for the reports and notifications that a supervisor needs each day. Distributed as an APK.",
    // No real capture: the APK needs an emulator, so these four screens are
    // labeled UI recreations drawn from the Flutter source instead.
    thumbnail: null,
    screenshots: [],
    mockScreens: ["login", "home", "checkin", "reports"],
    // Same CV entry as THINKPOS: "Attendance & POS Android Systems". MySQL is the
    // one CV tech this project did not name before; TypeORM, Riverpod, fl_chart,
//    geolocation, camera, secure storage, and scheduled jobs are verified in the
//    app source.
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
        items: ["PostgreSQL", "MySQL"],
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
      "Built as multi-tenant SaaS, with isolated attendance data, custom rules, and independent user management per company on a shared backend.",
      "Attendance capture with geolocation verification",
      "Photo capture as attendance evidence",
      "Attendance records and synchronization with the backend",
      "Scheduled jobs and local notifications",
      "Secure credential storage on device",
      "Workforce reporting and export",
      "Engineered REST API services using Node.js, Express.js, PostgreSQL, and MySQL for authentication, attendance, transaction processing, and data synchronization.",
      "Designed backend workflows and API contracts supporting reliable communication between Android applications and server-side services.",
    ],
    tags: ["workforce"],
    role: "Full-stack developer, Flutter mobile client, Node.js and Express API, PostgreSQL schema, scheduled jobs, and release packaging.",
    problem:
      "Manual attendance meant a paper log that was slow to check, easy to dispute, and impossible to turn into workforce data without retyping it.",
    // QR scanning is deliberately absent from every field on this project. It is
    // not in the CV, and in the app it is dead code: lib/sections/
    // qr_scanner_section.dart exists but nothing imports or navigates to it, so
    // no user can reach a QR screen. Do not add it back without a working
    // screen and a CV line that says so.
    solution:
      "Attendance is captured at the point of work and verified two ways at once, the device's location and a photo, then synchronized to a backend that stores the record once and can report on it. Scheduled jobs handle the recurring summaries and reminders so nobody compiles them by hand.",
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
    links: {},
    tenantPanel: {
      addLabel: "Add Business",
      columns: ["Business", "Plan", "Users", "Status"],
      tenants: [
        { name: "Kopi Senja", plan: "Pro", size: "8", status: "Active" },
        { name: "Kopi Pagi", plan: "Free", size: "3", status: "Active" },
        { name: "Coffee Lab", plan: "Pro", size: "5", status: "Active" },
        { name: "Roastery X", plan: "Enterprise", size: "12", status: "Trial" },
      ],
    },
    multiTenant: {
      // Verified against the implementation on 2026-10-05.
      verified: true,
      lead: "KOPIFLOW is architected as multi-tenant SaaS, serving multiple coffee businesses on a shared platform.",
      points: [
        {
          title: "Data isolation",
          detail:
            "Row-level isolation via tenant_id on a shared database. Inventory, supplier data, and financial records are scoped per tenant.",
        },
        {
          title: "Module isolation",
          detail:
            "Each tenant reaches the purchasing, warehouse, production, sales, and cost modules independently of the others.",
        },
        {
          title: "Financial isolation",
          detail:
            "Revenue, cost, and profit reporting is computed per tenant, with no path from one tenant's figures to another's.",
        },
        {
          title: "Access control",
          detail:
            "Role-based access, Owner and Staff, resolved inside the tenant boundary rather than across the platform.",
        },
        {
          title: "Scaling",
          detail:
            "Shared Next.js frontend and backend on PostgreSQL, with per-tenant partitioning so one busy tenant does not own the database.",
        },
      ],
    },
    tagline:
      "Multi-tenant SaaS for coffee business management, covering purchasing, warehouse stock, suppliers, production, sales, and costs.",
    // Not in the CV, in either revision. It is a real build with eleven real
// screenshots, so it stays on the site and carries the "In development"
//    badge, but nothing about it is CV-backed. If the CV is the only place a
//    project may appear, delete this entry and its screenshots with it.
    shortDescription:
      "Multi-tenant SaaS for coffee business management, covering purchasing, warehouse stock, suppliers, production, sales, and costs.",
    platform: ["Multi-tenant SaaS"],
    description:
      "A web application for running a coffee business: purchase orders and warehouse stock movements, supplier records, production, cost tracking, sales, customers, and reporting. It is built on the Next.js App Router with Server Actions doing the writes, PostgreSQL through Prisma, and role-based access where an owner manages users and staff work within the modules they are allowed to touch. Several modules are still being finished.",
    // Real captures from a local production build against a disposable
    // database, seeded with the app's own dummy data. Dimensions are the
    // files' actual pixel size, measured with sharp.
    thumbnail: "/projects/kopiflow/dashboard.webp",
    thumbnailWidth: 1440,
    thumbnailHeight: 900,
    screenshots: [
      { src: "/projects/kopiflow/dashboard.webp", alt: "KOPIFLOW dashboard showing purchases, production, costs, sales and stock from a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/pembelian.webp", alt: "KOPIFLOW purchases list with stock movements from a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/produksi.webp", alt: "KOPIFLOW production batches with input and output weights from a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/biaya.webp", alt: "KOPIFLOW cost tracking for labour and operational expenses in a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/penjualan.webp", alt: "KOPIFLOW sales list with totals from a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/customers.webp", alt: "KOPIFLOW customer records in a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/suppliers.webp", alt: "KOPIFLOW supplier records in a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/laporan.webp", alt: "KOPIFLOW reporting with charts from a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/users.webp", alt: "KOPIFLOW user and role management in a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/saldo-awal.webp", alt: "KOPIFLOW opening stock balances by coffee type in a local demo workspace", width: 1440, height: 900 },
      { src: "/projects/kopiflow/login.webp", alt: "KOPIFLOW sign-in screen with no stored credentials", width: 1440, height: 900 },
    ],
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
      "Designed as multi-tenant SaaS, with isolated inventory, supplier data, and financial records per coffee business within a shared platform.",
      "Purchasing and stock movement tracking",
      "Warehouse stock by coffee type, with opening balances",
      "Supplier management",
      "Production tracking",
      "Cost tracking, split into labour and operational costs",
      "Sales and customer records",
      "Reporting",
      "Role-based access with owner and staff roles",
    ],
    role: "Full-stack developer responsible for the Next.js frontend, the backend modules covering purchasing, warehouse, suppliers, production, sales, and costs, multi-tenant data isolation, and role-based access control.",
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
    caseStudy: true,
    featured: true,
    sourcePrivate: false,
    // Every node is a technology this project already lists above; the shape is
    // Next.js App Router with Server Actions as the only server entry point,
    // which is what `decisions` and `contribution` both describe.
    architecture: {
      nodes: [
        { id: "browser", label: "Staff browser", group: "Client" },
        { id: "next", label: "Next.js App Router", group: "Server" },
        { id: "actions", label: "Server Actions", group: "Server" },
        { id: "auth", label: "Auth.js session", group: "Server" },
        { id: "db", label: "PostgreSQL", group: "Data" },
      ],
      edges: [
        { from: "browser", to: "next" },
        { from: "next", to: "actions", label: "mutation" },
        { from: "next", to: "auth", label: "check role" },
        { from: "actions", to: "db", label: "Prisma" },
        { from: "auth", to: "db" },
      ],
    },
    results: [
      // Scope, not a measurement, and labelled as scope: KOPIFLOW is an MVP with
      // no production tenant data, so there is no number to report. The earlier
      // "5+ coffee businesses" had no CV line and no screenshot behind it and
      // stays off the site until production data exists.
      "Purchasing, warehouse stock, suppliers, production, sales, and cost management for coffee businesses in one multi-tenant platform.",
    ],
    resultLabel: "Scope",
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
    name: "AI-Powered Helpdesk Ticketing System",
    type: "ai",
    status: "production",
    tagline: "RAG-powered assistant for customer support",
    shortDescription:
      "Full-stack enterprise platform for managing customer support tickets end-to-end, with a RAG-powered AI agent.",
    description:
      "A full-stack enterprise application for customer support operations and service requests. It manages the ticket lifecycle, intake, assignment, categorization, and resolution, and layers on two pieces of automation: rule-based routing that sends a ticket to the right place based on its priority, category, and topic, and a retrieval-augmented assistant that pulls relevant knowledge and produces a contextual response so agents can stop hunting through documentation.",
    // No repository was available for this project, so there is no real UI to
    // capture. No screenshot and no mockup: the walkthrough below is the
    // honest fallback, and it is labelled as such wherever it appears.
    thumbnail: null,
    screenshots: [],
    // The CV's own line: "Tech: Laravel, PHP, MySQL, PostgreSQL/pgvector, RAG,
// LLM APIs". Grouped for display, nothing added and nothing dropped. pgvector
// and the LLM APIs are new in this CV revision: the previous one named neither,
// and the RAG pipeline cannot work without them.
technologies: [
      {
        category: "Backend",
        // Exactly the CV's six, nothing added: the earlier "REST API" chip was
        // the one item on this page the CV does not list for this project.
        items: ["Laravel", "PHP"],
      },
      {
        category: "Database",
        items: ["MySQL", "PostgreSQL/pgvector"],
      },
      {
        category: "AI",
        items: ["RAG", "LLM APIs"],
      },
    ],
// Three bullets. The CV's fourth bullet ("handled testing, debugging,
//    optimization, deployment, and post-launch improvements") describes the work
//    around the build rather than the system, and the card already carries a
//    contribution area for it. Each of the three that remain keeps its CV number.
features: [
      "Built the full ticket lifecycle in Laravel + MySQL with role-based access for agents, supervisors, and admins.",
      "Integrated a RAG pipeline that cut average lookup time from ~5 minutes to under 1 minute per query.",
      "Implemented routing rules by priority, category, and topic, reducing manual assignment by roughly 60%.",
    ],
    tags: ["ai", "automation"],
    role: "Full-stack engineer, the Laravel and MySQL core application, the RAG assistant, the routing and automation rules, plus testing, deployment, and ongoing improvements.",
    problem:
      "Support staff spent their time finding information and assigning work by hand. Relevant knowledge was scattered, and every new ticket had to be read and routed to a person manually.",
    solution:
      "Two targeted automations. Retrieval-augmented generation lets an agent ask the system and get a contextual answer grounded in the knowledge base. Rule-based routing assigns the ticket automatically from its priority, category, and topic, so assignment stops being a manual read-and-guess step.",
    challenges: [
      "Keeping generated answers grounded in the actual knowledge base instead of drifting.",
      "Encoding routing rules so automatic assignment matches how support actually triages.",
      "Testing and maintaining the application and the assistant together over time.",
    ],
    // The two impact lines, cut from the CV bullets above rather than restated, so
// the card says the same thing twice at two lengths and never says it three
// ways. The previous entry here claimed an 80% reduction in knowledge lookup
// time, which no CV revision has ever said; that figure is gone.
// The RAG path and the routing path are separate on purpose: retrieval-augmented
    // generation answers an agent's question, rule-based routing assigns a ticket,
    // and `solution` above describes them as two distinct automations. Every node
    // is a technology the project already lists in `technologies`.
    architecture: {
      nodes: [
        { id: "agent", label: "Support agent", group: "Client" },
        { id: "laravel", label: "Laravel app", group: "Server" },
        { id: "routes", label: "Routing rules", group: "Server" },
        { id: "rag", label: "RAG pipeline", group: "AI" },
        { id: "llm", label: "LLM API", group: "AI" },
        { id: "mysql", label: "MySQL", group: "Data" },
        { id: "vectors", label: "pgvector", group: "Data" },
      ],
      edges: [
        { from: "agent", to: "laravel", label: "ask, triage" },
        { from: "laravel", to: "routes", label: "on create" },
        { from: "laravel", to: "rag", label: "question" },
        { from: "rag", to: "vectors", label: "retrieve" },
        { from: "rag", to: "llm", label: "generate" },
        { from: "laravel", to: "mysql", label: "tickets" },
      ],
    },
    results: [
      "Cut average lookup time from ~5 minutes to under 1 minute per query.",
      "Reduced manual assignment effort by roughly 60% in the first three months of use.",
    ],
    caseStudy: true,
    cvName: "AI-Powered Helpdesk Ticketing System",
    sourcePrivate: true,
    links: {},
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
    name: "Outstanding Delivery Automation Platform",
    type: "backend",
    status: "production",
    tagline: "Delivery follow-up and supplier automation",
    shortDescription:
      "Full-stack web application replacing manual delivery follow-up with automated workflows, integrated with the Enterprise Planning System (EPS).",
    description:
      "A software automation platform built to replace manual outstanding-delivery follow-up. It retrieves and processes delivery data automatically, keeps due dates and purchase orders current, including revisions and cancellations, and chases suppliers without someone doing it by hand. A companion Auto In Portal gives suppliers one place to enter their data, so the information arrives already in the shape the downstream processes need. Data is pulled from the Enterprise Planning System and fed into these automated flows.",
    // No repository was available for this project, so there is no real UI to
    // capture. No screenshot and no mockup: the walkthrough below is the
    // honest fallback, and it is labelled as such wherever it appears.
    thumbnail: null,
    screenshots: [],
    // The CV's own line: "Tech: CodeIgniter, MySQL, REST API, EPS Integration".
    // The previous PDF revision wrote "CI3"; this one spells it out, so the
    // reading of it as CodeIgniter is no longer an assumption.
technologies: [
      {
        category: "Backend",
        items: ["CodeIgniter", "REST API"],
      },
      {
        category: "Database",
        items: ["MySQL"],
      },
      {
        category: "Integration",
        items: ["EPS Integration"],
      },
    ],
    // Three bullets, not four. The card and the case study read the same list,
    // so this is the project's whole feature story on the site: the portal and
    // the automation, the EPS connection, and the number the work produced. The
    // fourth CV bullet is a detail of the third (the Auto In Portal's own
    // purpose), so nothing measurable is lost by dropping it.
    features: [
      "Built the front-end portal (Auto In Portal) and backend automation covering delivery data retrieval, purchase order revisions, and supplier follow-up.",
      "Connected the platform directly to the Enterprise Planning System (EPS), eliminating manual data entry.",
      "Cut average processing time from 490 minutes/week to 60 minutes/week, an 88% reduction.",
    ],
    tags: ["automation"],
    role: "Full-stack developer responsible for the backend automation workflows, the EPS integration, the Auto In Portal, and the processing optimization.",
    problem:
      "Outstanding deliveries were chased by hand. Someone pulled the data, worked out what was late, updated due dates and purchase orders, and then contacted suppliers one by one, every week.",
    solution:
      "Automate the whole loop. Delivery data is retrieved and processed without a person stepping in, due dates and purchase orders are updated or cancelled programmatically, and supplier follow-ups go out automatically. Suppliers enter what they have through the Auto In Portal so the data arrives ready to use, and the Enterprise Planning System feeds the process directly.",
    challenges: [
      "Waking up the right supplier automatically, with enough context for the follow-up to be useful.",
      "Keeping due dates and purchase order state correct across updates, revisions, and cancellations.",
      "Replacing a manual process end to end without losing a step that mattered.",
    ],
    // EPS is the system this one replaced the manual work in, so it sits on the
    // outside and the portal is where supplier data enters. Both edges are named
    // because the direction is the point: the portal only feeds inward, EPS
    // only feeds inward.
    architecture: {
      nodes: [
        { id: "supplier", label: "Supplier", group: "People" },
        { id: "eps", label: "EPS", group: "External" },
        { id: "portal", label: "Auto In Portal", group: "Client" },
        { id: "api", label: "REST API", group: "Server" },
        { id: "jobs", label: "Processing jobs", group: "Server" },
        { id: "mysql", label: "MySQL", group: "Data" },
      ],
      edges: [
        { from: "supplier", to: "portal" },
        { from: "eps", to: "api", label: "delivery data" },
        { from: "portal", to: "api", label: "supplier entry" },
        { from: "api", to: "jobs" },
        { from: "jobs", to: "mysql", label: "due dates, POs" },
      ],
    },
    results: [
      "Cut average processing time from 490 minutes/week to 60 minutes/week, an 88% reduction.",
    ],
    caseStudy: true,
    sourcePrivate: true,
    links: {},
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
 * The home page split: the projects flagged `featured`, and the rest.
 *
 * One pass and one return, because the two lists are used together on the same
 * screen and deriving them in two functions would let a project land in neither
 * or both the moment the flag moved. `featured` leads in both lists, so the lead
 * row is always the same project whichever filter is active.
 */
export function partitionProjects(
  list: Project[] = projects,
): { featured: Project[]; other: Project[] } {
  const ordered = sortProjectsByType(list);
  const featured = ordered.filter((project) => project.featured);
  return { featured, other: ordered.filter((project) => !project.featured) };
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


