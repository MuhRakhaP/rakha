import { yearsExperience } from "@/lib/site";

/**
 * Career content, transcribed from the CV.
 *
 * Source of truth: `CV_Muhammad_Rakha_Putra.pdf` in the repo root, as revised
 * by the owner. Company names, titles, dates, and bullet wording come from the
 * CV as written. Metrics stay attached to the role they belong to. When the CV
 * is replaced, this file is replaced with it.
 *
 * Two places where the owner's supplied revision and the PDF file disagree are
 * recorded inline rather than silently resolved: the school name and the
 * second certification.
 */

export interface Role {
  company: string;
  location: string;
  title: string;
  /** Exactly as the CV states it, `MM/YYYY` on both ends. `Present` is the CV's word. */
  period: string;
  highlights: string[];
}

export const roles: Role[] = [
  {
    company: "PT. Terasys Virtual",
    location: "Jakarta",
    title: "Software Engineer",
    period: "01/2026 – Present",
    highlights: [
      "Cut manual operational work by ~40% by translating business requirements into scalable workflows and application architecture.",
      "Owned the full lifecycle of internal business applications from requirements analysis to production deployment.",
      "Built and managed Docker-based environments and CI/CD pipelines supporting automated build, testing, and deployment.",
      "Maintained production stability across internal applications through ongoing maintenance and improvements.",
    ],
  },
  {
    company: "PT. TD Automotive Compressor Indonesia",
    location: "Cikarang",
    title: "Full Stack Developer",
    period: "11/2024 – 05/2025",
    highlights: [
      "Improved processing efficiency by ~35% by optimizing application performance and database queries.",
      "Built internal business applications end-to-end on HMVC architecture, keeping the codebase maintainable as requirements grew.",
      "Implemented backend services and system integrations to support internal workflows across departments.",
      "Raised reliability through systematic testing, debugging, and continuous improvements.",
    ],
  },
  {
    company: "PT. Satu Produksi Digital",
    location: "Jakarta",
    title: "Backend Developer",
    period: "06/2023 – 10/2024",
    highlights: [
      "Built backend services and REST APIs for an e-commerce platform using Node.js and Firebase.",
      "Sped up backend response times through database indexing and query optimization.",
      "Designed database structures built for performance and reliability as the platform scaled.",
      "Resolved backend incidents quickly through root-cause analysis, fixing underlying problems instead of symptoms.",
    ],
  },
  {
    company: "PT. Metropolitan Land Tbk",
    location: "Jakarta",
    title: "Full Stack Developer",
    period: "09/2022 – 03/2023",
    highlights: [
      "Delivered custom web modules that digitized internal business processes, from development through deployment.",
      "Integrated new modules with existing systems and commercial software packages, avoiding costly rebuilds of working systems.",
      "Improved system performance, maintainability, and application availability through targeted software improvements.",
    ],
  },
];

/**
 * Education, newest first.
 *
 * The school name is "SMK Pariwisata Metland School" from the owner's supplied
 * revision. The PDF file in the repo root still writes "SMK Metland School", so
 * the two disagree until the PDF is updated: TODO, re-check this line against
 * whatever CV is current, because the file is the source of truth.
 */
export interface Education {
  school: string;
  location: string;
  /** Exactly as the CV states it. "present" is the CV's own word. */
  period: string;
  major: string;
}

export const education: Education[] = [
  {
    school: "Universitas Terbuka",
    location: "Jakarta, Indonesia",
    period: "2024 – present",
    // TODO: the owner's revision says "Bachelor of Information Systems (in
    // progress)"; the PDF says "Major in Information Systems". The revision
    // wins here, so fix the PDF.
    major: "Bachelor of Information Systems (in progress)",
  },
  {
    school: "SMK Pariwisata Metland School",
    location: "Jakarta, Indonesia",
    period: "2020 – 2023",
    major: "Software Engineering (Rekayasa Perangkat Lunak)",
  },
];

/**
 * Certifications, newest first.
 *
 * TODO: the owner's supplied revision lists two credentials. The PDF file in
 * the repo root lists only the first one, so the Coding Studio certificate has
 * no line in the file to check against. Confirm the name and year, then update
 * the CV so the two agree.
 */
export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export const certifications: Certification[] = [
  {
    name: "Node.js Application Back-End untuk Pemula",
    issuer: "Coding Studio",
    date: "2025",
  },
  {
    name: "MikroTik Certified Network Associate (MTCNA)",
    issuer: "MikroTik",
    date: "05/2023",
  },
];

/**
 * Verbatim CV PROFESSIONAL SUMMARY, with the years figure read from
 * `lib/site.ts` rather than typed here. Rendered on /about and mirrored in the
 * hero. Updating the figure in one place moves it everywhere, including this
 * sentence, which is otherwise quoted exactly as the CV writes it.
 */
export const summary =
  `Full Stack Developer with ${yearsExperience} years of experience building business applications, multi-tenant SaaS platforms, backend services, and AI-powered systems. Specialized in Laravel, Node.js, TypeScript, PostgreSQL, and React/Next.js. Proven track record of reducing manual business processes by up to 88% through enterprise integrations and automation. Strong problem-solving and organizational skills.`;