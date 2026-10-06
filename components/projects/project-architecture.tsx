import type { Project } from "@/data/projects";

const NODE_W = 168;
const NODE_H = 58;
const COL_GAP = 80;
const ROW_GAP = 24;
const PAD = 14;

interface Placed {
  id: string;
  label: string;
  group: string;
  layer: number;
  order: number;
}

/**
 * Longest-path layering: a node sits one column right of its furthest
 * predecessor. That guarantees every edge travels left to right, which is
 * what stops arrows crossing over unrelated nodes — the old group-based
 * layout put the client apps in one column and the printer three columns
 * away, so that edge ran straight through the middle of the diagram.
 */
function assignLayers(architecture: NonNullable<Project["architecture"]>) {
  const ids = architecture.nodes.map((node) => node.id);
  const incoming = new Map(ids.map((id) => [id, [] as string[]]));
  const outgoing = new Map(ids.map((id) => [id, [] as string[]]));

  for (const edge of architecture.edges) {
    // Ignore edges that reference a node which is not declared.
    if (!incoming.has(edge.to) || !outgoing.has(edge.from)) continue;
    incoming.get(edge.to)!.push(edge.from);
    outgoing.get(edge.from)!.push(edge.to);
  }

  const layer = new Map<string, number>();
  // Iterative relaxation. Bounded by node count, so a cycle in the data
  // terminates instead of hanging the render.
  for (let pass = 0; pass < ids.length; pass++) {
    let changed = false;
    for (const id of ids) {
      if (layer.has(id)) continue;
      const deps = incoming.get(id)!;
      if (deps.every((dep) => layer.has(dep))) {
        layer.set(id, deps.length === 0 ? 0 : Math.max(...deps.map((d) => layer.get(d)!)) + 1);
        changed = true;
      }
    }
    if (!changed) break;
  }
  // Anything left is part of a cycle — park it after its resolved neighbours.
  for (const id of ids) {
    if (!layer.has(id)) {
      const deps = incoming.get(id)!;
      const known = deps.filter((dep) => layer.has(dep)).map((dep) => layer.get(dep)!);
      layer.set(id, known.length ? Math.max(...known) + 1 : 0);
    }
  }
  return layer;
}

/**
 * Order nodes inside each layer by the average position of the neighbours
 * they connect to, which keeps edges short and stops them crossing.
 */
function orderLayers(
  architecture: NonNullable<Project["architecture"]>,
  layer: Map<string, number>,
): Placed[] {
  const placed: Placed[] = [];
  const layers = Math.max(...[...layer.values()]) + 1;
  const positions = new Map<string, number>();

  for (let l = 0; l < layers; l++) {
    const inLayer = architecture.nodes.filter((node) => layer.get(node.id) === l);

    const score = new Map<string, number>();
    for (const node of inLayer) {
      const neighbours = [
        ...architecture.edges.filter((e) => e.from === node.id).map((e) => e.to),
        ...architecture.edges.filter((e) => e.to === node.id).map((e) => e.from),
      ]
        .filter((id) => positions.has(id))
        .map((id) => positions.get(id)!);

      // No already-placed neighbours yet: push it to the end for now.
      score.set(
        node.id,
        neighbours.length
          ? neighbours.reduce((a, b) => a + b, 0) / neighbours.length
          : Number.MAX_SAFE_INTEGER,
      );
    }

    inLayer
      .slice()
      .sort((a, b) => (score.get(a.id) ?? 0) - (score.get(b.id) ?? 0))
      .forEach((node, index) => {
        positions.set(node.id, index);
        placed.push({
          id: node.id,
          label: node.label,
          group: node.group ?? "",
          layer: l,
          order: index,
        });
      });
  }

  return placed;
}

function layout(architecture: NonNullable<Project["architecture"]>) {
  const layer = assignLayers(architecture);
  const placed = orderLayers(architecture, layer);

  const layers = Math.max(...placed.map((n) => n.layer)) + 1;
  const perLayer = new Array(layers).fill(0);

  const nodes = placed.map((node) => {
    const row = perLayer[node.layer]++;
    const x = PAD + node.layer * (NODE_W + COL_GAP);
    const y = PAD + row * (NODE_H + ROW_GAP);
    return {
      ...node,
      x,
      y,
      right: x + NODE_W,
      cy: y + NODE_H / 2,
      cx: x + NODE_W / 2,
    };
  });

  const tallest = Math.max(...perLayer, 1);

  return {
    nodes,
    width: PAD * 2 + layers * NODE_W + (layers - 1) * COL_GAP,
    height: PAD * 2 + tallest * NODE_H + (tallest - 1) * ROW_GAP,
  };
}

export function ProjectArchitecture({
  architecture,
}: {
  architecture: NonNullable<Project["architecture"]>;
}) {
  const { nodes, width, height } = layout(architecture);
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    // Rendered at 1:1 and scrolled, never scaled down: shrinking the SVG
    // would push the 9px group label below the legibility floor.
    <div
      tabIndex={0}
      role="group"
      aria-label="System architecture diagram, scroll horizontally to see the full flow"
      className="w-full overflow-x-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label="System architecture diagram"
        className="h-auto shrink-0"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9.5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-brand" />
          </marker>
        </defs>

        {/* edges first so nodes sit on top */}
        {architecture.edges.map((edge) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;

          const x1 = from.right;
          const x2 = to.x;
          const midX = (x1 + x2) / 2;

          return (
            <g key={`${edge.from}->${edge.to}`}>
              <path
                d={`M ${x1} ${from.cy} C ${midX} ${from.cy}, ${midX} ${to.cy}, ${x2} ${to.cy}`}
                fill="none"
                className="stroke-brand"
                strokeWidth={1.5}
                markerEnd="url(#arrow)"
              />
              {edge.label && (
                <text
                  x={midX}
                  y={(from.cy + to.cy) / 2 - 7}
                  textAnchor="middle"
                  className="fill-foreground text-[12px]"
                  /* Halo so the label stays legible where it crosses a line. */
                  stroke="var(--background)"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((node) => (
          <g key={node.id}>
            {/* Tinted fill with a branded stroke — never a solid brand fill,
                which would drop the label text to ~1.35:1. */}
            <rect
              x={node.x}
              y={node.y}
              width={NODE_W}
              height={NODE_H}
              rx={6}
              className="fill-brand-weak stroke-brand"
              strokeWidth={1}
            />
            <text
              x={node.cx}
              y={node.cy - 8}
              textAnchor="middle"
              className="fill-foreground text-[13px] font-medium"
            >
              {node.label}
            </text>
            {node.group && (
              /* fill-foreground, not muted: muted on the tint is only 3.9:1. */
              <text
                x={node.cx}
                y={node.cy + 10}
                textAnchor="middle"
                className="fill-foreground text-[12px] tracking-[0.08em] uppercase opacity-70"
              >
                {node.group}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
