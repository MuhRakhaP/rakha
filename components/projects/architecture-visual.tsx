import type { Project } from "@/data/projects";

/**
 * A project's own architecture, drawn from the `architecture` data in
 * `data/projects.ts`.
 *
 * This replaced two hand-drawn illustrations: a bar chart with seven invented
 * bars for the automation platform, and a fake support chat with invented
 * messages for the assistant. Both looked like screenshots of things that do
 * not exist, and neither had anything to do with the project. The node and edge
 * lists are verifiable, so the card now shows the real shape of the system
 * instead of a mood piece.
 *
 * Two projects have no architecture list yet, only a written `walkthrough`. They
 * render that as a step panel instead of an empty box, because an empty media
 * area on a card is the one thing worse than the illustration it replaced.
 *
 * It renders on the same `.card-stage` as the device cluster and inside the
 * same fixed-ratio box, so a backend card and a web card in one row have the
 * same media weight and the text below them starts on the same line.
 */
export function ArchitectureVisual({ project }: { project: Project }) {
  const architecture = project.architecture;

  if (!architecture || architecture.nodes.length === 0) {
    return <WalkthroughVisual project={project} />;
  }

  const VIEW_W = 320;
  const VIEW_H = 210;
  const PAD_X = 10;
  const COL_GAP = 12;
  const NODE_H = 34;
  const NODE_GAP = 12;

  // Column per group, in the order the groups are first declared.
  const groups: string[] = [];
  for (const node of architecture.nodes) {
    const group = node.group ?? "Components";
    if (!groups.includes(group)) groups.push(group);
  }

  const colW = (VIEW_W - PAD_X * 2 - COL_GAP * (groups.length - 1)) / groups.length;
  const colIndex = new Map(groups.map((group, index) => [group, index]));

  const placed = new Map<
    string,
    { x: number; y: number; w: number; h: number; label: string }
  >();

  for (const node of architecture.nodes) {
    const group = node.group ?? "Components";
    const siblings = architecture.nodes.filter(
      (n) => (n.group ?? "Components") === group,
    );
    const row = siblings.indexOf(node);
    const stackH = siblings.length * NODE_H + (siblings.length - 1) * NODE_GAP;
    const top = (VIEW_H - stackH) / 2;

    placed.set(node.id, {
      x: PAD_X + (colIndex.get(group) ?? 0) * (colW + COL_GAP),
      y: top + row * (NODE_H + NODE_GAP),
      w: colW,
      h: NODE_H,
      label: node.label,
    });
  }

  const edges = architecture.edges.flatMap((edge) => {
    const from = placed.get(edge.from);
    const to = placed.get(edge.to);
    if (!from || !to) return [];

    const forward = to.x >= from.x;
    const x1 = forward ? from.x + from.w : from.x;
    const y1 = from.y + from.h / 2;
    const x2 = forward ? to.x : to.x + to.w;
    const y2 = to.y + to.h / 2;
    const bend = Math.max(18, Math.abs(x2 - x1) / 2);

    return [
      <path
        key={`${edge.from}-${edge.to}`}
        d={`M ${x1} ${y1} C ${x1 + (forward ? bend : -bend)} ${y1}, ${x2 - (forward ? bend : -bend)} ${y2}, ${x2} ${y2}`}
        fill="none"
        stroke="var(--brand)"
        strokeOpacity={0.45}
        strokeWidth={1.5}
      />,
    ];
  });

  const described = architecture.nodes.map((node) => node.label).join(", ");

  return (
    <div className="card-stage relative h-full w-full">
      <span aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${project.name} architecture: ${described}`}
        className="relative h-full w-full p-4"
      >
        {edges}
        {architecture.nodes.map((node) => {
          const box = placed.get(node.id);
          if (!box) return null;
          const group = node.group ?? "Components";
          const siblings = architecture.nodes.filter(
            (n) => (n.group ?? "Components") === group,
          );
          const isFirst = siblings[0]?.id === node.id;
          const lines = wrapLabel(node.label);

          return (
            <g key={node.id}>
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                rx={6}
                fill="var(--card)"
                stroke="var(--border)"
              />
              {isFirst ? (
                <text
                  x={box.x}
                  y={box.y - 6}
                  fill="var(--muted-foreground)"
                  fontSize={9}
                  letterSpacing={0.6}
                >
                  {group.toUpperCase()}
                </text>
              ) : null}
              <text
                x={box.x + box.w / 2}
                y={box.y + box.h / 2 + 3.5}
                fill="var(--card-foreground)"
                fontSize={10.5}
                textAnchor="middle"
              >
                {lines.map((line, index) => (
                  <tspan
                    key={line}
                    x={box.x + box.w / 2}
                    dy={index === 0 ? 0 : 11}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Split a label into at most two lines of at most fifteen characters, on a
 * space where one exists. Anything longer than two lines is left as the first
 * thirty characters: it is a diagram, and the full label is in the accessible
 * name and on the case study.
 */
function wrapLabel(label: string): string[] {
  if (label.length <= 15) return [label];

  const words = label.split(" ");
  let first = words[0];
  for (const word of words) {
    if (`${first} ${word}`.length > 15) break;
    first = `${first} ${word}`;
  }

  const rest = label.slice(first.length).trim();
  if (!rest) return [first];
  return [first, rest.length > 16 ? `${rest.slice(0, 15)}…` : rest];
}

/**
 * The stand-in for a project with neither a capture nor an architecture list.
 *
 * It draws the first step group from the project's own `walkthrough`: the
 * wording there was written from the CV entry and checked against the project,
 * so the card shows the flow the owner documented instead of an invented bar
 * chart. Four steps is what fits the box at card size without clipping.
 *
 * TODO: if the owner supplies a node and edge list for these two, add
 * `architecture` to the entry in `data/projects.ts` and this stops being used.
 */
function WalkthroughVisual({ project }: { project: Project }) {
  const group = project.walkthrough?.[0];
  if (!group) {
    // No capture, no architecture, no walkthrough: say so rather than draw a
    // box. Only reachable if a project is added with nothing to show.
    return (
      <div className="card-stage flex h-full w-full items-center justify-center p-5 text-center text-sm text-muted-foreground">
        No interface to show yet.
      </div>
    );
  }

  return (
    <div className="card-stage relative flex h-full w-full flex-col justify-center gap-3 p-5">
      <span aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <p className="relative text-xs font-medium tracking-[0.08em] text-brand uppercase">
        {group.title}
      </p>
      <ol className="relative flex flex-col gap-2">
        {group.steps?.slice(0, 4).map((step, index) => (
          <li key={step} className="flex items-start gap-2.5 text-xs leading-snug text-muted-foreground">
            <span className="mt-px inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-brand-weak text-xs font-semibold text-brand-lift tabular-nums">
              {index + 1}
            </span>
            <span className="line-clamp-2">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}