import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import type { Walkthrough } from "@/data/projects";

/**
 * The permanent caption. Exported so the harness and any future caller assert
 * against this exact string instead of a separately typed copy that could
 * drift away from what actually renders.
 */
export const WALKTHROUGH_CAPTION =
  "Illustrative walkthrough. Not actual app screenshots.";

/**
 * Illustrative walkthrough for a project with no real screenshot.
 *
 * This is NOT a mockup and must never look like one. It is a neutral grey
 * wireframe in the warm palette: neutral greys and outlines only, no brand
 * accent used as if it were the app's own colour, no invented labels, no
 * invented numbers, no logo. It deliberately does not imitate the real app's
 * layout, because imitating it would be a fake screenshot.
 *
 * The caption is permanent, visible, and exposed to assistive technology as a
 * note. The harness fails if a panel renders without it.
 *
 * Interaction lives only in the tabs, which are keyboard accessible and
 * honour prefers-reduced-motion.
 */
export function WalkthroughPanel({
  projectName,
  steps,
}: {
  projectName: string;
  steps: Walkthrough[];
}) {
  if (steps.length === 0) return null;

  return (
    <div data-testid="walkthrough-panel" className="flex flex-col gap-4">
      {/* Non-removable caption. role="note" so it is announced as an aside. */}
              <p
                role="note"
                data-testid="walkthrough-caption"
                className="text-xs text-muted-foreground"
              >
                {WALKTHROUGH_CAPTION}
              </p>

      <Tabs defaultValue={steps[0].title} className="gap-4">
        <TabsList aria-label={`${projectName} walkthrough steps`}>
          {steps.map((step) => (
            <TabsTrigger key={step.title} value={step.title}>
              {step.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {steps.map((step) => (
          <TabsContent
            key={step.title}
            value={step.title}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
              {step.steps && step.steps.length > 0 ? (
                <ol className="flex flex-col gap-1.5">
                  {step.steps.map((line, i) => (
                    <li
                      key={line}
                      className="flex gap-2.5 text-sm text-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-[0.625rem] text-muted-foreground"
                      >
                        {i + 1}
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>

            {/* Neutral grey wireframe. Abstract blocks only: no text, no
                brand colour, no resemblance to any specific app screen. */}
            <div
              aria-hidden="true"
              className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-4"
            >
              <div className="flex gap-2">
                <div className="h-2 w-16 rounded-full bg-border" />
                <div className="h-2 flex-1 rounded-full bg-border/60" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-10 rounded border border-border bg-card/60" />
                <div className="h-10 rounded border border-border bg-card/60" />
                <div className="h-10 rounded border border-border bg-card/60" />
              </div>
              <div className="flex h-14 items-end gap-1.5 rounded border border-border bg-card/40 px-2 pt-2">
                {[40, 65, 30, 80, 55, 70].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-t-sm bg-border"
                  />
                ))}
              </div>
            </div>

          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
