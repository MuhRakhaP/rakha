import Link from "next/link";

import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { site } from "@/lib/site";

/**
 * Pass A scope: a holding page that points at the project index.
 * Home, About, Experience, and Contact arrive in Pass B.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          {site.name}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {site.role}. I design and build full-stack applications, backend
          services, REST APIs, business systems, and automation.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg" render={<Link href="/projects" />}>
          View Projects
        </Button>
        <Button
          size="lg"
          variant="outline"
          render={<a href={`mailto:${site.email}`} />}
        >
          Email me
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {projects.length} projects, documented from the source repositories and
        the CV.
      </p>
    </div>
  );
}
