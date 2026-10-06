import type { Metadata } from "next";

import { EducationSection } from "@/components/education-section";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Reveal } from "@/components/reveal";
import { SITE_URL, site, yearsExperience } from "@/lib/site";

const description =
  "Work experience as Software Engineer and Full-Stack Developer, including backend services, REST APIs, and business systems.";

export const metadata: Metadata = {
  title: "Experience",
  description,
  alternates: { canonical: "/experience" },
  openGraph: {
    title: `Experience · ${site.name}`,
    description,
    url: `${SITE_URL}/experience`,
    images: ["/opengraph-image"],
  },
  twitter: { title: `Experience · ${site.name}`, description },
};

export default function ExperiencePage() {
  return (
    <div className="flex flex-col pt-6">
      <Reveal>
        <header className="flex flex-col gap-4">
          <h1 className="font-heading text-title font-semibold tracking-[-0.02em]">
            Experience
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            {yearsExperience} years of professional experience across backend services, full-stack
            applications, and business automation systems.
          </p>
        </header>
      </Reveal>

      <div className="mt-section">
        {/* Every highlight the CV lists. The home page takes the first three per
            role from this same component. */}
        <ExperienceTimeline headingLevel={2} />
      </div>

      <EducationSection heading="Education & Certification" />
    </div>
  );
}
