/**
 * Skills exactly as grouped and worded in the CV's "Skills & Competencies"
 * section. Grouped, never rated — no levels, no percentages, no bars.
 */

export interface SkillGroup {
  category: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "PHP", "SQL"] },
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "Vue.js"],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "Express.js",
      "Laravel",
      "CodeIgniter",
      "FastAPI",
    ],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase"],
  },
  {
    category: "API & Integration",
    items: ["REST API", "Webhooks", "Xendit", "MikroTik", "PPPoE"],
  },
  {
    category: "DevOps",
    items: ["Git", "Docker", "CI/CD", "VPS", "PM2", "Caddy", "Coolify"],
  },
];
