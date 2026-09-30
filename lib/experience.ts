/**
 * Career content, transcribed from the CV.
 *
 * Do not embellish. Company names, titles, dates, and bullet wording come from
 * the CV as written. Metrics stay attached to the role they belong to.
 */

export interface Role {
  company: string;
  location: string;
  title: string;
  /** Exactly as the CV states it. `null` means ongoing. */
  period: string;
  highlights: string[];
}

export const roles: Role[] = [
  {
    company: "PT. Terasys Virtual",
    location: "Jakarta",
    title: "Software Engineer",
    period: "01/2026 — Present",
    highlights: [
      "Design, develop, and maintain full-stack applications and internal software systems based on business requirements.",
      "Design and implement REST APIs, backend services, and database solutions using Laravel, Node.js, TypeScript, and PostgreSQL.",
      "Translate business requirements into technical solutions, application architecture, workflows, and scalable system functionality, reducing manual business processes by approximately 40%.",
      "Build and manage CI/CD pipelines and containerized application environments using Docker, supporting automated build, testing, and deployment workflows.",
    ],
  },
  {
    company: "PT. TD Automotive Compressor Indonesia",
    location: "Cikarang",
    title: "Full-Stack Developer",
    period: "11/2024 — 05/2025",
    highlights: [
      "Designed and developed full-stack internal business applications using HMVC architecture.",
      "Implemented backend services and system integrations to support internal business workflows.",
      "Optimized application performance and database queries, improving processing efficiency by approximately 35%.",
      "Performed application testing, debugging, and continuous improvements to ensure reliability and maintainability.",
    ],
  },
  {
    company: "PT. satu produksi digital",
    location: "Jakarta",
    title: "Backend Developer",
    period: "06/2023 — 10/2024",
    highlights: [
      "Designed and developed backend services and REST APIs for an e-commerce platform using Node.js and Firebase.",
      "Designed and optimized database structures to improve application performance and reliability.",
      "Implemented database indexing and query optimization to improve backend response times.",
      "Investigated and resolved backend issues through debugging and root-cause analysis.",
    ],
  },
  {
    company: "PT. Metropolitan Land Tbk",
    location: "Jakarta",
    title: "Full-Stack Developer",
    period: "09/2022 — 03/2023",
    highlights: [
      "Developed, tested, and deployed custom web application modules for internal business processes.",
      "Implemented software improvements to enhance system performance and maintainability.",
      "Integrated application modules with existing systems and commercial software packages.",
      "Identified and implemented opportunities to improve system performance and application availability.",
    ],
  },
];

export const education = {
  school: "SMK Pariwisata Metland School",
  location: "Jakarta, Indonesia",
  period: "2020 — 2023",
  major: "Computer Science",
};

export const certification = {
  name: "MikroTik Certified Network Associate (MTCNA)",
  issuer: "MikroTik",
  date: "05/2023",
};

/** Verbatim CV summary. */
export const summary = `Software Engineer with 3+ years of professional experience building and maintaining full - stack web applications, backend services, REST APIs, and business automation systems. Experienced with Laravel, Node.js, TypeScript, React.js, Next.js, PostgreSQL, and MySQL, with hands - on experience in API integrations, database design, system deployment, and production troubleshooting. Experienced across the full software development lifecycle, from requirements analysis and system design to development, testing, depl oyment, and maintenance.`;
