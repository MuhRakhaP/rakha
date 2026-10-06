import type { Metadata } from "next";
import Image from "next/image";

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
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Hero summary, in his own words rather than the CV paragraph.
 *
 * The CV summary opens in the third person and reads like a form field. This is
 * first person and carries no figure, because `ImpactMetrics` below already
 * shows the years with the dated roles as its proof, and a figure repeated on
 * two blocks of one screen is a figure to keep in sync.
 *
 * Two words were changed from the draft wording. "Scalable" is an unevidenced
 * claim, so it came out. "Modern web technologies" names nothing, so it became
 * Next.js, which is on the CV and in `lib/skills.ts`.
 */
const heroSummary =
  "I build production-ready applications, backend services, and automation workflows, then maintain them once they are live.";

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
  about: "About",
  projects: "What I build",
  experience: "Experience",
  skills: "Skills",
  education: "Education & certifications",
} as const;

/**
 * The About block, between the hero and the work.
 *
 * The nav has had an About link pointing at `/about` while the home page had no
 * section to scroll to, so on the one page the scroll-spy actually runs, that
 * link never highlighted. This section is the anchor it was missing.
 *
 * Four sentences, first person, and every claim in them is already stated
 * somewhere on the site: the employer and city from the hero, the four roles
 * and the 2022 start from `lib/experience.ts`, the stack from `lib/skills.ts`,
 * and RAG and LLM integrations from the AI Helpdesk case study. Nothing new is
 * asserted here.
 */
const aboutParagraphs = [
  "I'm Rakha, a Software Engineer at PT. Terasys Virtual in Jakarta.",
  "Four roles since 2022, mostly building the backend for systems a business runs on: ISP billing, point of sale, attendance, delivery automation, and a support desk with a RAG assistant bolted to it.",
  "Day to day that is Laravel, Node.js, TypeScript, and PostgreSQL, with Docker and CI/CD to get it shipped, and maintenance afterwards.",
];

/**
 * Three points, each pinned to a specific piece of work rather than stated as a
 * preference. A point nobody can point at reads as a slogan.
 */
const aboutPoints = [
  {
    title: "Automating repeated manual work",
    detail:
      "The delivery follow-up process dropped from 490 to 60 minutes a week.",
  },
  {
    title: "Wiring systems together",
    detail:
      "MikroTik PPPoE, Xendit, WhatsApp, and EPS integrated into one platform rather than four tabs.",
  },
  {
    title: "Keeping it running after launch",
    detail: "Docker builds, CI/CD pipelines, and production maintenance.",
  },
];

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

      {/* About sits here rather than at the bottom because the nav's About link
          has to land somewhere on the page the scroll-spy runs on. It is the
          one section with a two-column composition, so the page does not read
          as heading, paragraph, heading, paragraph all the way down. */}
      <section
        id="about"
        className="py-section border-t border-border"
        aria-labelledby="about-heading"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2
                id="about-heading"
                className="font-heading text-section font-semibold tracking-[-0.015em]"
              >
                {SECTIONS.about}
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                {aboutParagraphs[0]}
              </p>
            </div>

            <div className="flex max-w-2xl flex-col gap-4">
              {aboutParagraphs.slice(1).map((paragraph) => (
                <p key={paragraph} className="text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* TODO: same placeholder as the hero. One real photograph in
                public/avatar.png covers both places. */}
            <div className="flex items-center gap-4">
              <Image
                src="/avatar.png"
                alt="Muhammad Rakha Putra, initials placeholder until a photograph is supplied"
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-2xl border border-border object-cover"
              />
              <p className="text-sm text-muted-foreground">
                {site.role} at PT. Terasys Virtual
                <br />
                {site.location}
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              {aboutPoints.map((point) => (
                <li
                  key={point.title}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <p className="text-sm font-medium">{point.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {point.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
              Six systems built: five in production, one in development. Across
              web, mobile, backend, and AI.
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
            {/* Two columns, not three. At three the cards run to about 360px and
                a one-sentence problem plus a metric block wraps into four lines
                in each cell, which is the cramped read the two-column grid is
                there to avoid.
                Six projects split as one lead plus five leaves this list with an
                odd count, so the last card spans both columns rather than
                sitting alone in a half-empty row. `items-stretch` plus the
                card's own `flex-col` with `mt-auto` on the CTA is what keeps a
                row equal height when two projects have different numbers of
                sentences. */}
            <ul className="grid items-stretch gap-6 sm:grid-cols-2">
              {sortProjectsByType(other).map((project, index, list) => {
                const orphan = list.length % 2 === 1 && index === list.length - 1;
                return (
                  <li
                    key={project.slug}
                    className={orphan ? "sm:col-span-2" : "flex"}
                  >
                    <ProjectCard project={project} wide={orphan} />
                  </li>
                );
              })}
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