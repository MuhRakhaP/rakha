import { Award, GraduationCap } from "lucide-react";

import { certifications, education } from "@/lib/experience";

/**
 * Education and certification as two columns of the same kind of card.
 *
 * It was a vertical timeline on the left and a single card on the right, with a
 * 15px hollow dot on a 1px hairline holding them together. At the dark values
 * this palette uses, that line measured 1.27 against the page, so the timeline
 * was a column of nearly invisible marks separating two entries from the CV.
 * Two entries do not need a timeline. They need two cards, which is what a
 * reader comparing a degree against a certificate actually wants.
 *
 * Shared by the home, about, and experience pages so the three can never drift
 * apart. It renders no heading of its own beyond the one passed in, because each
 * page words its own section title differently.
 */
export function EducationSection({
  heading,
  id,
}: {
  heading: React.ReactNode;
  /** Set on the home page, where the section is a scroll-spy target. */
  id?: string;
}) {
  return (
    <section
      id={id}
      className="py-section border-t border-border"
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <h2
        id={id ? `${id}-heading` : undefined}
        className="font-heading text-section font-semibold tracking-[-0.015em]"
      >
        {heading}
      </h2>

      {/* Two columns rather than three: there are two schools and two
          certificates, and a third column would leave the last certificate on a
          row of its own across the whole width of a desktop. */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {education.map((entry) => (
          <article
            key={entry.school}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <GraduationCap aria-hidden="true" className="size-5 shrink-0 text-brand" />
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-base font-semibold tracking-[-0.01em]">
                {entry.school}
              </h3>
              <p className="text-sm text-foreground">{entry.major}</p>
            </div>
            {/* Same fields in the same order as the certification card below, so
                the two columns can be read across. */}
            <p className="mt-auto text-sm text-muted-foreground tabular-nums">
              {entry.period}
            </p>
            <p className="text-sm text-muted-foreground">{entry.location}</p>
          </article>
        ))}

        {/* Award rather than a generic badge: the card marks a credential that
            was actually issued, so the seal is the meaning, not decoration. */}
        {certifications.map((certification) => (
          <article
            key={certification.name}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <Award aria-hidden="true" className="size-5 shrink-0 text-brand" />
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-base font-semibold tracking-[-0.01em]">
                {certification.name}
              </h3>
              <p className="text-sm text-foreground">{certification.issuer}</p>
            </div>
            <p className="mt-auto text-sm text-muted-foreground tabular-nums">
              {certification.date}
            </p>
            <p className="text-sm text-muted-foreground">Certification</p>
          </article>
        ))}
      </div>
    </section>
  );
}