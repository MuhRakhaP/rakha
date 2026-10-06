import type { Metadata } from "next";

import { ProjectFilter } from "@/components/projects/project-filter";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Reveal } from "@/components/reveal";
import {
  countByType,
  parseProjectType,
  projects,
  sortProjectsByType,
} from "@/data/projects";
import { SITE_URL, site } from "@/lib/site";

const description =
  "Selected projects: multi-tenant SaaS for coffee business management, point of sale, and attendance, plus ISP billing and network management and support automation.";

// Without this the page inherits the layout's Open Graph title and description,
// so a link to /projects shared into a chat advertised the home page instead.
// `images` is here because a route that defines its own `openGraph` replaces the
// layout's object wholesale, dropping the file-convention image with it: a share
// card needs a picture, not just words.
export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects · ${site.name}`,
    description,
    url: `${SITE_URL}/projects`,
    images: ["/opengraph-image"],
  },
  twitter: { title: `Projects · ${site.name}`, description },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filter = parseProjectType(type);

  // Same category order as the home page: web, mobile, backend, ai. The
  // filter views are single-type, so the sort only matters for "all".
  const visible = sortProjectsByType(
    filter === "all"
      ? [...projects]
      : [...projects].filter((project) => project.type === filter),
  );

  return (
    <div className="flex flex-col pt-6 pb-section">
      <Reveal>
        <header className="max-w-2xl">
          <h1 className="font-heading text-title font-semibold tracking-[-0.02em]">
            Projects
          </h1>
          <p className="mt-3 text-muted-foreground">
            Products and systems I have designed, built, and maintained, across
            web, mobile, backend, and AI.
          </p>
        </header>
      </Reveal>

      <div className="mt-section flex flex-col gap-10">
        <ProjectFilter counts={countByType()} />

        <ProjectGrid projects={visible} />
      </div>
    </div>
  );
}
