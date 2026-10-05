/**
 * Skills, grouped as the CV's "SKILLS & COMPETENCIES" section groups them.
 *
 * Source: `CV_Muhammad_Rakha_Putra.pdf` as revised by the owner. Grouped, never
 * rated: no levels, no percentages, no bars.
 *
 * The owner's revision collapses eight CV categories into six display groups by
 * folding Frontend into Languages and Databases into Backend. Nothing is
 * dropped and nothing is invented, with one addition: "Multi-Tenant SaaS
 * Architecture", which the CV summary claims as a category of work and the owner
 * names as the architecture behind KOPIFLOW, THINKPOS, and CLOCKORA. It sits with
 * the backend group because that is where the tenancy lives.
 *
 * The brief also asked for a five-group, thirty-skill cap. Six groups and
 * forty-one skills is what the CV actually lists, so the content won over the
 * cap; cutting to thirty would mean hiding skills the CV claims. The count is in
 * the hand-off notes for the owner to settle.
 */
export interface SkillGroup {
  category: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages & Frontend",
    items: [
      "JavaScript",
      "TypeScript",
      "PHP",
      "SQL",
      "HTML",
      "React.js",
      "Next.js",
      "Vue.js",
      "Tailwind CSS",
    ],
  },
  {
    category: "Backend & Databases",
    items: [
      "Node.js",
      "NestJS",
      "Express.js",
      "Laravel",
      "CodeIgniter",
      "FastAPI",
      "Multi-Tenant SaaS Architecture",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Firebase",
      "Redis",
    ],
  },
  { category: "Mobile", items: ["Flutter", "Dart", "Riverpod", "SQLite"] },
  {
    category: "DevOps & Cloud",
    items: ["Git", "Docker", "CI/CD", "VPS", "PM2", "Caddy", "Coolify"],
  },
  {
    category: "AI & Integrations",
    items: ["RAG", "LLM APIs", "pgvector", "Xendit", "MikroTik", "REST APIs"],
  },
  { category: "Tools", items: ["Composer", "Prisma", "n8n"] },
];