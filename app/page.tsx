import type { Metadata } from "next";

import { ClosingCta } from "@/components/closing-cta";
import { EducationSection } from "@/components/education-section";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilter } from "@/components/projects/project-filter";
import { SkillsGrid } from "@/components/skills-grid";
import {
  countByType,
  parseProjectType,
  partitionProjects,
  projects,
  sortProjectsByType,
} from "@/data/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Hero copy, transcribed from the CV's PROFESSIONAL SUMMARY.
 *
 * The CV paragraph is the source, first three sentences: "4+ years" is the CV's
 * own figure and matches the dated roles in `lib/experience.ts`, which run from
 * 09/2022 to present. "multi-tenant SaaS platforms" is the CV's phrase for the
 * work behind KOPIFLOW, THINKPOS, and CLOCKORA, and it names the category here
 * because that is where the claim is made. The headline below the name comes
 * from `site.headline`, which is the CV's headline line verbatim.
 */
const heroSummary =
  "Full Stack Developer with 4+ years of experience building business applications, multi-tenant SaaS platforms, backend services, and AI-powered systems. Specialized in Laravel, Node.js, TypeScript, PostgreSQL, and React/Next.js. Proven track record of reducing manual business processes by up to 88% through enterprise integrations and automation.";

/** Real status from the CV owner. Nothing on the page implies it otherwise. */
const heroAvailability = "Available for full-stack and backend roles";

/**
 * The section headings, in one place.
 *
 * Every section on the page is `<h2>` at the same size, and they are written out
 * once here so the home page, the scroll-spy in the header, and any future
 * anchor link all read the same string. The id is what the spy watches and what
 * a footer link would target.
 */
const SECTIONS = {
  projects: "What I build",
  experience: "Experience",
  skills: "Skills",
  education: "Education & certifications",
} as const;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filter = parseProjectType(type);

  // Filtering happens on the server from the query string, so the lead row and
  // the grid below it always agree about what is on the page, and a filtered
  // home page is a link somebody can send.
  const visible =
    filter === "all"
      ? projects
      : projects.filter((project) => project.type === filter);
  const { featured, other } = partitionProjects(visible);
  const [lead, ...featuredRest] = featured;

  return (
    <div className="flex flex-col">
      <Hero
        summary={heroSummary}
        availability={heroAvailability}
      />

      {/* Projects. One lead card at full width, the rest of the featured set in
          a pair, then a three-up grid, which is 3 + 3 across the six projects:
          no row ever ends with one card stranded beside empty space. */}
      <section
        id="projects"
        className="py-section border-t border-border"
        aria-labelledby="projects-heading"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2
              id="projects-heading"
              className="font-heading text-section font-semibold tracking-[-0.015em]"
            >
              {SECTIONS.projects}
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Six systems across web, mobile, backend, and AI. Each one states the
              problem it was built for and what it changed.
            </p>
          </div>

          <ProjectFilter counts={countByType()} basePath="/" />
        </div>

        {lead ? (
          <ul className="mt-8 flex flex-col gap-6">
            <li className="flex">
              {/* Priority on this one card only: it is the first project image
                  in the document and the LCP element on a phone. */}
              <ProjectCard
                project={lead}
                headingLevel={3}
                variant="featured"
                priority
              />
            </li>
            {featuredRest.length > 0 ? (
              <li className="grid gap-6 sm:grid-cols-2">
                {featuredRest.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </li>
            ) : null}
          </ul>
        ) : null}

        {other.length > 0 ? (
          <div className={lead ? "mt-12" : "mt-8"}>
            <h3 className="font-heading mb-4 text-lg font-semibold tracking-tight">
              More projects
            </h3>
            <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortProjectsByType(other).map((project) => (
                <li key={project.slug} className="flex">
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Every type has at least one project today, so this only shows if the
            data changes. It says which filter is empty rather than showing a
            blank half-page. */}
        {lead === undefined && other.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            No projects in this category yet.
          </p>
        ) : null}
      </section>

      {/* Employer list and experience teaser were the same four roles twice.
          This is the one place they appear on the home page, and /experience
          renders the same timeline with every highlight rather than three. */}
      <section
        id="experience"
        className="py-section border-t border-border"
        aria-labelledby="experience-heading"
      >
        <div className="flex flex-col gap-2">
          <h2
            id="experience-heading"
            className="font-heading text-section font-semibold tracking-[-0.015em]"
          >
            {SECTIONS.experience}
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Four roles since 2022, newest first, with the work each one owned.
          </p>
        </div>

        <div className="mt-10">
          <ExperienceTimeline limit={3} />
        </div>
      </section>

      <section
        id="skills"
        className="py-section border-t border-border"
        aria-labelledby="skills-heading"
      >
        <div className="flex flex-col gap-2">
          <h2
            id="skills-heading"
            className="font-heading text-section font-semibold tracking-[-0.015em]"
          >
            {SECTIONS.skills}
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Grouped as the CV groups them. No levels, no percentages, no bars.
          </p>
        </div>

        <div className="mt-10">
          <SkillsGrid />
        </div>
      </section>

      <EducationSection
        id="education"
        heading={SECTIONS.education}
      />

      <ClosingCta />
    </div>
  );
}