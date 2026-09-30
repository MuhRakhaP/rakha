import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProjectArchitecture } from "@/components/projects/project-architecture";
import { ProjectBadges } from "@/components/projects/project-badges";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectCtas } from "@/components/projects/project-ctas";
import { DeviceFrame } from "@/components/projects/device-frame";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { getProject, getRelatedProjects, projects } from "@/data/projects";
import { site } from "@/lib/site";

type Params = Promise<{ slug: string }>;

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

  const title = `${project.name} — ${site.name}`;

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

/** Section wrapper. Only rendered when there is something to show. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const related = getRelatedProjects(project.slug);
  const framed = project.type === "mobile";
  const heroImage = project.thumbnail ?? project.screenshots[0]?.src ?? null;

  return (
    <article className="flex flex-col gap-10">
      <Link
        href="/projects"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden="true" />
        All projects
      </Link>

      {/* Hero */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <ProjectBadges project={project} />
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.name}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {project.tagline}
          </p>
        </div>

        {heroImage && (
          <div className={framed ? "flex justify-center py-4" : undefined}>
            {framed ? (
              <DeviceFrame className="w-full max-w-64">
                <Image
                  src={heroImage}
                  alt={`${project.name} interface`}
                  width={1080}
                  height={1920}
                  priority
                  className="h-auto w-full"
                />
              </DeviceFrame>
            ) : (
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-border">
                <Image
                  src={heroImage}
                  alt={`${project.name} interface`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 960px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )}

        {!heroImage && (
          <div className="flex aspect-16/5 w-full items-center justify-center rounded-lg border border-border bg-muted">
            <span className="font-heading text-xl font-medium tracking-tight text-muted-foreground">
              {project.name}
            </span>
          </div>
        )}

        <ProjectCtas project={project} size="lg" />
      </header>

      {/* Overview */}
      <Section title="Overview">
        <p className="max-w-2xl">{project.description}</p>
      </Section>

      {project.problem && (
        <Section title="Problem">
          <p className="max-w-2xl">{project.problem}</p>
        </Section>
      )}

      {project.solution && (
        <Section title="Solution">
          <p className="max-w-2xl">{project.solution}</p>
        </Section>
      )}

      {project.features.length > 0 && (
        <Section title="Key Features">
          <ul className="grid gap-3 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="rounded-lg border border-border bg-card p-4 text-sm"
              >
                {feature}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {project.technologies.length > 0 && (
        <Section title="Tech Stack">
          <TechStack technologies={project.technologies} />
        </Section>
      )}

      {project.role && (
        <Section title="My Role">
          <p className="max-w-2xl">{project.role}</p>
        </Section>
      )}

      {project.architecture && (
        <Section title="Architecture">
          <ProjectArchitecture architecture={project.architecture} />
        </Section>
      )}

      {project.challenges && project.challenges.length > 0 && (
        <Section title="Challenges">
          <ul className="flex max-w-2xl flex-col gap-3">
            {project.challenges.map((challenge) => (
              <li key={challenge} className="flex gap-3 text-sm">
                <span aria-hidden="true" className="text-muted-foreground">
                  —
                </span>
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {project.results && project.results.length > 0 && (
        <Section title="Results">
          <ul className="flex max-w-2xl flex-col gap-3">
            {project.results.map((result) => (
              <li key={result} className="flex gap-3 text-sm">
                <span aria-hidden="true" className="text-muted-foreground">
                  —
                </span>
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {project.screenshots.length > 0 && (
        <Section title="Gallery">
          <ProjectGallery
            screenshots={project.screenshots}
            type={project.type}
          />
        </Section>
      )}

      {related.length > 0 && (
        <section className="border-t border-border pt-8">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            More Projects
          </h2>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug} className="flex">
                <ProjectCard project={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
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
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
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
