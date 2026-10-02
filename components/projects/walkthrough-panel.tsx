import { Fragment } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bell,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Database,
  FileText,
  Folder,
  LayoutGrid,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";

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
 * A small icon for a step, chosen from the step's own wording so the map
 * stays generic: no component ever branches on a project name. Falls back to
 * a neutral dot when nothing matches.
 */
const STEP_ICONS: { match: RegExp; icon: LucideIcon }[] = [
  { match: /question|ask|reply/i, icon: MessageCircle },
  { match: /generat|response|contextual/i, icon: Sparkles },
  { match: /follow|chase/i, icon: Bell },
  { match: /identif|determine/i, icon: Target },
  { match: /retriev|knowledge|\beps\b|enterprise/i, icon: Database },
  { match: /update|revision|cancel/i, icon: RefreshCw },
  { match: /resol|close/i, icon: CheckCircle2 },
  { match: /assign|rout|match/i, icon: Send },
  { match: /categor|filed|folder/i, icon: Folder },
  { match: /intake|record|document|ticket/i, icon: FileText },
  { match: /\bportal\b/i, icon: LayoutGrid },
  { match: /captur|standard/i, icon: ClipboardList },
  { match: /feed|downstream|process/i, icon: Workflow },
];

function stepIcon(line: string): LucideIcon {
  return STEP_ICONS.find(({ match }) => match.test(line))?.icon ?? CircleDot;
}

/**
 * Illustrative walkthrough for a project with no real screenshot.
 *
 * This is NOT a mockup and must never look like one. It is a neutral
 * wireframe in the warm palette: neutral greys and outlines only, no brand
 * accent used as if it were the app's own colour, no invented labels, no
 * invented numbers, no logo. It deliberately does not imitate the real app's
 * layout, because imitating it would be a fake screenshot.
 *
 * Each step is drawn as a node in a flow: an icon chosen from the step's own
 * wording, the step number, and the step text, joined by arrows. The flow is
 * horizontal on wider screens and stacks vertically on mobile so nothing is
 * ever cut off.
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

        {steps.map((step) => {
          const lines = step.steps ?? [];
          return (
            <TabsContent
              key={step.title}
              value={step.title}
              className="flex flex-col gap-4"
            >
              <p className="text-sm text-muted-foreground">{step.description}</p>

              {lines.length > 0 ? (
                /* The flow: one node per step, joined by arrows. Horizontal on
                   sm+ so the steps read left to right; vertical on mobile so
                   the text never gets squeezed or cut off. */
                <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
                  {lines.map((line, i) => {
                    const Icon = stepIcon(line);
                    return (
                      <Fragment key={line}>
                        <li className="flex flex-1 flex-col gap-2 rounded-lg border border-border bg-card/60 p-3">
                          <div className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-weak text-brand"
                            >
                              <Icon className="size-4" />
                            </span>
                            <span className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                              Step {i + 1}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{line}</p>
                        </li>
                        {i < lines.length - 1 ? (
                          <li
                            aria-hidden="true"
                            className="flex shrink-0 items-center justify-center py-1 text-muted-foreground sm:px-1.5 sm:py-0"
                          >
                            <ArrowDown className="size-4 sm:hidden" />
                            <ArrowRight className="hidden size-4 sm:block" />
                          </li>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </ol>
              ) : null}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}