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
          3+ years of professional experience across backend services, full-stack
          applications, and business automation systems.
        </p>
      </header>

      <ol className="flex flex-col">
        {roles.map((role, index) => (
          <li
            key={`${role.company}-${role.period}`}
            className="relative border-t border-border pt-8 pb-10 last:pb-0 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10"
          >
            {/* Timeline rail: hidden on mobile, a thin line on desktop. */}
            <span
              aria-hidden="true"
              className="absolute top-10 bottom-0 left-0 hidden w-px bg-border lg:block"
            />
            <span
              aria-hidden="true"
              className="absolute top-12 -left-[3px] hidden size-[7px] rounded-full bg-brand lg:block"
            />

            <div className="lg:sticky lg:top-8 lg:self-start lg:pl-6">
              <h2 className="font-heading text-lg font-semibold tracking-[-0.015em]">
                {role.title}
              </h2>
              <p className="mt-1 text-sm font-medium">{role.company}</p>
              <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                {role.period}
              </p>
              <p className="text-sm text-muted-foreground">{role.location}</p>
              <span className="sr-only">
                Role {index + 1} of {roles.length}
              </span>
            </div>

            <ul className="mt-5 flex flex-col gap-2.5 lg:mt-0">
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
