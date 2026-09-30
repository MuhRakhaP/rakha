import { ImageResponse } from "next/og";

import { getProject, projects } from "@/data/projects";
import { site } from "@/lib/site";

export const alt = "Project overview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Static for every project slug — one generated image per case study. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

const TYPE_LABEL: Record<string, string> = {
  web: "Web",
  mobile: "Mobile",
  backend: "Backend",
  ai: "AI",
};

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  const name = project?.name ?? site.name;
  const eyebrow = project ? (TYPE_LABEL[project.type] ?? project.type) : site.role;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              border: "1px solid #3f3f3f",
              borderRadius: 8,
              padding: "6px 16px",
              fontSize: 28,
              color: "#a3a3a3",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>
            {name}
          </div>
          {project ? (
            <div style={{ fontSize: 36, color: "#a3a3a3", lineHeight: 1.3 }}>
              {project.tagline}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", fontSize: 32, color: "#737373" }}>
          {site.name}
        </div>
      </div>
    ),
    size,
  );
}
