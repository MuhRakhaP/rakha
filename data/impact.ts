/**
 * The three figures under the hero.
 *
 * Every number here is traceable, and the `proof` line travels with it so no
 * figure on the page stands on its own:
 *
 *  - `${yearsExperience} years` is interpolated from `lib/site.ts`, not typed
 *    here, and matches the dated roles in `lib/experience.ts`, which run from
 *    09/2022 to present. The numeric `value` parses the same string so the
 *    count-up and the label can never disagree.
 *  - 88% is the CV's Outstanding Delivery figure, and the 490 to 60 minutes a
 *    week behind it is in `data/projects.ts` under the same project, where it is
 *    labelled to that one process: the figure is not a claim about every system
 *    on the site.
 *  - The system count is counted from the project data rather than typed, so
 *    adding a project updates it and it can never drift from what the page
 *    actually shows. It counts `status: "production"` only, so it reads 5 while
 *    `projects` holds 6. A hand-written "6" here would have claimed six live
 *    systems on the strength of one that is still in development.
 *
 * Three, not four. A fourth card would repeat the shape of the 88% one, since
 * the 50% TERAHOME figure is the same claim about a different account, and the
 * strip is three across from `sm` up, so a fourth entry strands one cell on its
 * own row. If a fourth figure with a genuinely different shape is measured
 * later, it goes in here.
 *
 * Nothing here is invented, and nothing is a placeholder. If a figure stops
 * being true, delete the entry rather than softening the wording: an empty
 * slot reads as "not measured", which is honest, where a vague one does not.
 */
import { projects } from "@/data/projects";
import { careerStart, yearsExperience } from "@/lib/site";
import { roles } from "@/lib/experience";

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
    // Parsed from the shared string rather than written twice: the suffix is
    // everything after the digits, so "5+" next year becomes 5/+ with no edit
    // here.
    value: Number.parseInt(yearsExperience, 10),
    suffix: yearsExperience.replace(/\d+/g, ""),
    label: "Years in production engineering roles",
    proof: `Across ${roles.length} companies since ${careerStart}`,
  },
  {
    // The figure is a per-process measurement, so the proof says which process
    // and what it measured. A number without that is a claim about the whole
    // portfolio, which this is not.
    value: 88,
    suffix: "%",
    label: "Cut in delivery follow-up processing time",
    proof: "490 to 60 minutes a week, one delivery process",
  },
  {
    value: projects.filter((project) => project.status === "production").length,
    suffix: "",
    label: "Systems built and maintained",
    proof: "Web, mobile, backend, and AI, plus one in development",
  },
];