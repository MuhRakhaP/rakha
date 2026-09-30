import type { Metadata } from "next";

import { certification, education, roles } from "@/lib/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Work experience as Software Engineer and Full-Stack Developer, including backend services, REST APIs, and business systems.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <div className="flex flex-col gap-12 py-6">
      <header className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Experience
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Four years across backend services, full-stack applications, and
          internal business systems.
        </p>
      </header>

      <ol className="flex flex-col gap-10">
        {roles.map((role) => (
          <li
            key={`${role.company}-${role.period}`}
            className="flex flex-col gap-3 border-t border-border pt-8"
          >
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                {role.title}
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · {role.company}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {role.location}
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span className="tabular-nums">{role.period}</span>
              </p>
            </div>

            <ul className="flex max-w-2xl flex-col gap-2.5">
              {role.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm">
                  <span aria-hidden="true" className="text-muted-foreground">
                    —
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section className="flex flex-col gap-6 border-t border-border pt-10">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Education &amp; Certification
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-medium">{education.school}</p>
            <p className="text-sm text-muted-foreground">
              {education.major} · {education.period} · {education.location}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-medium">{certification.name}</p>
            <p className="text-sm text-muted-foreground">
              {certification.issuer} · {certification.date}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
