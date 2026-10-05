/**
 * The three figures under the hero.
 *
 * Every number here is traceable, and the `proof` line travels with it so no
 * figure on the page stands on its own:
 *
 *  - 4+ years is the CV's own figure and matches the dated roles in
 *    `lib/experience.ts`, which run from 09/2022 to present.
 *  - 88% is the CV's Outstanding Delivery figure, and the 490 to 60 minutes a
 *    week behind it is in `data/projects.ts` under the same project.
 *  - The system count is counted from the project data rather than typed, so
 *    adding a project updates it and it can never drift from what the page
 *    actually shows.
 *
 * Nothing here is invented, and nothing is a placeholder. If a figure stops
 * being true, delete the entry rather than softening the wording: an empty
 * slot reads as "not measured", which is honest, where a vague one does not.
 */
import { projects } from "@/data/projects";

export interface ImpactMetric {
  /** Held as a number so the count-up animates real digits rather than a string. */
  value: number;
  suffix: string;
  /** What the figure measures, in words a recruiter will scan for. */
  label: string;
  /** The evidence behind it. Never empty: a number with nothing behind it is a claim. */
  proof: string;
}

export const impactMetrics: ImpactMetric[] = [
  {
    value: 4,
    suffix: "+",
    label: "Years in production engineering roles",
    proof: "Four employers, September 2022 to present",
  },
  {
    value: 88,
    suffix: "%",
    label: "Cut in manual processing time",
    proof: "490 to 60 minutes a week, one account",
  },
  {
    value: projects.filter((project) => project.status === "production").length,
    suffix: "",
    label: "Systems built and maintained",
    proof: "Web, mobile, backend, and AI, plus one in development",
  },
];