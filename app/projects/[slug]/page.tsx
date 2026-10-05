import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProjectArchitecture } from "@/components/projects/project-architecture";
import { ProjectBadges } from "@/components/projects/project-badges";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectCtas } from "@/components/projects/project-ctas";
import { ProjectFrame } from "@/components/projects/project-frame";
import { ProjectGallery } from "@/components/projects/project-gallery";
import {
  ShowcaseStrip,
  resolveShowcaseScreens,
} from "@/components/projects/mock-screens/showcase-strip";
import { WalkthroughPanel } from "@/components/projects/walkthrough-panel";
import { AdminPanelMockup } from "@/components/sections/admin-panel-mockup";
import { MultiTenantArchitecture } from "@/components/sections/multi-tenant-architecture";
import {
  SectionNav,
  type SectionLink,
} from "@/components/projects/section-nav";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/ui/count-up";
import { getProject, getRelatedProjects, projects } from "@/data/projects";
import { site } from "@/lib/site";
import { ClosingCta } from "@/components/closing-cta";
import {
  DevicePreview,
  hasDevice,
  preferredScreen,
} from "@/components/projects/device-preview";

type Params = Promise<{ slug: string }>;

/**
 * True when two strings say the same thing once case, punctuation and
 * whitespace are discounted. Used to drop the CV-name subtitle when it
 * would just repeat the tagline immediately above it.
 *
 * Accented characters are folded, so "Cafe" and "Café" compare equal.
 * "&" becomes "and" before punctuation is dropped, so a tagline written
 * out in words matches a CV title that uses the ampersand.
 */
function isRedundantSubtitle(subtitle: string, tagline: string): boolean {
  const normalise = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();

  return normalise(subtitle) === normalise(tagline);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  const title = `${project.name} · ${site.name}`;

  return {
    title: project.name,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description: project.shortDescription,
      url: `/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.shortDescription,
    },
  };
}

/** Section wrapper. Only ever rendered when there is something to show. */
function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section id={id} className="scroll-mt-24 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 font-heading text-xl font-semibold tracking-[-0.015em]">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </section>
    </Reveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    /* Native list markers instead of a decorative glyph: the bullet becomes a
       marker rather than a character assistive tech has to skip. */
    <ul className="flex max-w-2xl list-disc flex-col gap-3 pl-5">
      {items.map((item) => (
        <li key={item} className="text-sm">
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Result lines with the figure counted up.
 *
 * The sentence is left exactly as the CV wrote it and only the number is
 * replaced, so nothing about the claim changes and a reader who never sees the
 * animation still reads the real figure. Counts that appear in the prose are
 * the sourced ones: 88%, 60%, 50%, 40%, 35%, 30%.
 */
function ResultBullets({ items }: { items: string[] }) {
  const percent = /(\d+(?:\.\d+)?)(\s*%)/;

  return (
    <ul className="flex max-w-2xl list-disc flex-col gap-3 pl-5">
      {items.map((item) => {
        const match = percent.exec(item);
        if (!match) {
          return (
            <li key={item} className="text-sm">
              {item}
            </li>
          );
        }
        const [full, value, suffix] = match;
        const before = item.slice(0, match.index);
        const after = item.slice(match.index + full.length);
        return (
          <li key={item} className="text-sm">
            {before}
            <CountUp value={Number(value)} suffix={suffix} />
            {after}
          </li>
        );
      })}
    </ul>
  );
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const related = getRelatedProjects(project.slug);
  const framed = project.type === "mobile";
  // A real capture for a given screen always beats a recreation of it, so this
  // is resolved before anything renders. It is also what stops a screen being
  // shown twice once a capture lands.
  const showcase = resolveShowcaseScreens(project);
  const hasRecreations = showcase.some((s) => s.kind === "recreation");

  // Only sections that actually render appear in the page nav.
  const sections: SectionLink[] = [{ id: "overview", title: "Overview" }];
  if (project.problem) sections.push({ id: "problem", title: "Problem" });
  if (project.solution) sections.push({ id: "solution", title: "Solution" });
  if (project.features.length > 0)
    sections.push({ id: "features", title: "Key Features" });
  if (project.multiTenant) {
    sections.push({ id: "multi-tenant", title: "Multi-Tenant Architecture" });
    sections.push({ id: "tenant-screens", title: "Tenant Screens" });
  }
  if (project.technologies.length > 0)
    sections.push({ id: "stack", title: "Tech Stack" });
  if (project.contribution && project.contribution.length > 0)
    sections.push({ id: "contribution", title: "My Contribution" });
  if (project.architecture)
    sections.push({ id: "architecture", title: "Architecture" });
  if (project.decisions && project.decisions.length > 0)
    sections.push({ id: "decisions", title: "Engineering Decisions" });
  if (project.challenges?.length)
    sections.push({ id: "challenges", title: "Challenges" });
  if (project.results?.length) sections.push({ id: "results", title: "Results" });
  if (showcase.length > 0) sections.push({ id: "showcase", title: "Screens" });
  if (project.screenshots.length > 0)
    sections.push({ id: "gallery", title: "Gallery" });
  if (
    project.screenshots.length === 0 &&
    project.walkthrough &&
    project.walkthrough.length > 0
  )
    sections.push({ id: "walkthrough", title: "Illustrative Walkthrough" });
  if (related.length > 0)
    sections.push({ id: "more", title: "More Projects" });

  return (
    <div className="flex flex-col gap-10">
      {/* Back link and hero span the full container; the case study grid below
          holds the sticky nav and a single capped reading column. */}
      <Link
        href="/projects"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All projects
      </Link>

      {/* Hero */}
      <header className="flex flex-col gap-6">
        <Reveal className="flex flex-col gap-4">
          <ProjectBadges project={project} />
          <h1 className="font-heading text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
            {project.name}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {project.tagline}
          </p>
          {/* CV name subtitle. Hidden when it would only repeat the tagline. */}
          {project.cvName && !isRedundantSubtitle(project.cvName, project.tagline) && (
            <p className="mt-2 text-sm text-muted-foreground">
              {project.cvName}
            </p>
          )}
        </Reveal>

        {/* Real capture in a type-appropriate frame, or the angled device
            cluster for a project whose screens are drawn, or the walkthrough.
            Never a mockup presented as a capture. The cluster leads with a
            working screen: dashboard, transactions, never the sign-in.
            Scaled in rather than slid, because the artwork is the thing being
            introduced. No parallax: scroll-linked motion on a full-bleed image
            is a documented nausea trigger, and the progress bar already
            answers "how far down am I". */}
        <Reveal delay={90}>
          {project.thumbnail ? (
            <ProjectFrame
              project={project}
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
              className={framed ? "max-w-64" : undefined}
            />
          ) : hasDevice(project) ? (
            <div className="mx-auto w-full max-w-2xl">
              <DevicePreview
                project={project}
                screenId={preferredScreen(project)}
              />
            </div>
          ) : (
            <ProjectFrame
              project={project}
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
              className={framed ? "max-w-64" : undefined}
            />
          )}
        </Reveal>

        <ProjectCtas project={project} size="lg" hideCaseStudy />
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <SectionNav sections={sections} />

        <div className="flex min-w-0 flex-1 flex-col gap-10 lg:max-w-3xl">
            <Section id="overview" eyebrow="Overview" title="Overview">
            <p className="max-w-2xl">{project.description}</p>
          </Section>

          {project.problem && (
            <Section id="problem" eyebrow="Context" title="Problem">
              <p className="max-w-2xl">{project.problem}</p>
            </Section>
          )}

          {project.solution && (
            <Section id="solution" eyebrow="Approach" title="Solution">
              <p className="max-w-2xl">{project.solution}</p>
            </Section>
          )}

          {project.features.length > 0 && (
            <Section id="features" eyebrow="Scope" title="Key Features">
              <ul className="grid gap-3 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:border-brand"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {project.multiTenant && (
            <>
              <Section
                id="multi-tenant"
                eyebrow="Platform"
                title="Multi-Tenant Architecture"
              >
                <MultiTenantArchitecture project={project} />
              </Section>

              <Section
                id="tenant-screens"
                eyebrow="Illustration"
                title="Multi-Tenant Screenshots"
              >
                <AdminPanelMockup project={project} />
              </Section>
            </>
          )}

          {project.technologies.length > 0 && (
            <Section id="stack" eyebrow="Built with" title="Tech Stack">
              <TechStack technologies={project.technologies} />
            </Section>
          )}

          {project.contribution && project.contribution.length > 0 && (
            <Section id="contribution" eyebrow="My work" title="My Contribution">
              {project.role && (
                <p className="mb-4 text-sm text-muted-foreground">
                  <span className="font-medium">Role:</span> {project.role}
                </p>
              )}
              <dl className="grid gap-6 sm:grid-cols-2">
                {project.contribution.map((item) => (
                  <div key={item.area}>
                    <dt className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                      {item.area}
                    </dt>
                    <dd className="mt-2 text-sm">{item.detail}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {project.architecture && (
            <Section id="architecture" eyebrow="How it works" title="Architecture">
              <ProjectArchitecture architecture={project.architecture} />
            </Section>
          )}

          {project.decisions && project.decisions.length > 0 && (
            <Section id="decisions" eyebrow="Engineering" title="Engineering Decisions">
              <ul className="flex max-w-2xl flex-col gap-3">
                {project.decisions.map((d) => (
                  <li key={d.title} className="flex gap-3 text-sm">
                    <span className="font-medium">{d.title}</span>
                    <span className="text-muted-foreground">{d.reason}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {project.challenges && project.challenges.length > 0 && (
            <Section id="challenges" eyebrow="Hard parts" title="Challenges">
              <Bullets items={project.challenges} />
            </Section>
          )}

          {project.results && project.results.length > 0 && (
            <Section id="results" eyebrow="Outcome" title="Results">
              <ResultBullets items={project.results} />
            </Section>
          )}

          {project.screenshots.length > 0 && (
            <Section id="gallery" eyebrow="Product" title="Gallery">
              <ProjectGallery
                screenshots={project.screenshots}
                project={project}
              />
            </Section>
          )}
        </div>
      </div>

      {/* The screen showcase gets full container width and sits OUTSIDE the
          case study grid, like the walkthrough below it. Four device frames do
          not fit in the 768px reading column, and squeezing them is what turns
          a clean drawing into clipped text. */}
      {showcase.length > 0 && (
        <Reveal>
          <section
            id="showcase"
            className="scroll-mt-24 border-t border-border pt-8"
          >
            <p className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
              {hasRecreations ? "Design reference" : "Product"}
            </p>
            <h2 className="mt-1.5 font-heading text-xl font-semibold tracking-[-0.015em]">
              Screens
            </h2>
            {hasRecreations ? null : (
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Captured from a local demo build.
              </p>
            )}
            <div className="mt-4">
              <ShowcaseStrip project={project} screens={showcase} />
            </div>
          </section>
        </Reveal>
      )}

      {/* Walkthrough only where there is no real screenshot. Full container
          width and OUTSIDE the case study grid, so it never becomes a third
          grid column that squeezes the reading column. */}
      {project.screenshots.length === 0 &&
        project.walkthrough &&
        project.walkthrough.length > 0 && (
          <Reveal>
            <section
              id="walkthrough"
              className="scroll-mt-24 border-t border-border pt-8"
            >
              <p className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
                How it works
              </p>
              <h2 className="mt-1.5 font-heading text-xl font-semibold tracking-[-0.015em]">
                Illustrative Walkthrough
              </h2>
              <div className="mt-4 max-w-3xl">
                <WalkthroughPanel
                  projectName={project.name}
                  steps={project.walkthrough}
                />
              </div>
            </section>
          </Reveal>
        )}

      {related.length > 0 && (
        <Reveal>
          <section
            id="more"
            data-testid="more-projects"
            className="scroll-mt-24 border-t border-border pt-8"
          >
            {/* More Projects is full container width and sits OUTSIDE the
                case study grid, like the ClosingCta below it. */}
            <p className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
              Keep going
            </p>
            <h2 className="mt-1.5 font-heading text-xl font-semibold tracking-[-0.015em]">
              More Projects
            </h2>
            <ul className="mt-4 grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug} className="flex">
                  <ProjectCard project={item} />
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <ClosingCta />
    </div>
  );
}

/** Grouped technology list — only ever the current project's technologies. */
function TechStack({
  technologies,
}: {
  technologies: { category: string; items: string[] }[];
}) {
  const visible = technologies.filter((group) => group.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <dl className="grid gap-6 sm:grid-cols-2">
      {visible.map((group) => (
        <div key={group.category}>
          <dt className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
            {group.category}
          </dt>
          <dd className="mt-2">
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border px-2 py-0.5 text-xs"
                >
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
