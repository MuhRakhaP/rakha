import type { Project } from "@/data/projects";

const NODE_W = 148;
const NODE_H = 44;
const COL_GAP = 72;
const ROW_GAP = 20;
const PAD = 12;

type Layout = {
  nodes: {
    id: string;
    label: string;
    group: string;
    x: number;
    y: number;
    cx: number;
    cy: number;
    column: number;
  }[];
  width: number;
  height: number;
};

/**
 * Lays nodes out in one column per group, in order of first appearance.
 * Everything drawn below comes from the project data — if a node is not in the
 * data it is not on the diagram.
 */
function layout(architecture: NonNullable<Project["architecture"]>): Layout {
  const groups: string[] = [];
  for (const node of architecture.nodes) {
    const group = node.group ?? "";
    if (!groups.includes(group)) groups.push(group);
  }

  const perColumn = groups.map(() => 0);
  const placed = architecture.nodes.map((node) => {
    const group = node.group ?? "";
    const column = groups.indexOf(group);
    const row = perColumn[column]++;
    return { node, group, column, row };
  });

  const tallest = Math.max(...perColumn, 1);

  const nodes = placed.map(({ node, group, column, row }) => {
    const x = PAD + column * (NODE_W + COL_GAP);
    const y = PAD + row * (NODE_H + ROW_GAP);
    return {
      id: node.id,
      label: node.label,
      group,
      column,
      x,
      y,
      cx: x + NODE_W / 2,
      cy: y + NODE_H / 2,
    };
  });

  return {
    nodes,
    width: PAD * 2 + groups.length * NODE_W + (groups.length - 1) * COL_GAP,
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
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label="System architecture diagram"
        className="h-auto w-full min-w-[640px]"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {/* edges first so nodes sit on top */}
        {architecture.edges.map((edge) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;

          const goingRight = to.cx >= from.cx;
          const x1 = goingRight ? from.x + NODE_W : from.x;
          const x2 = goingRight ? to.x : to.x + NODE_W;
          const midX = (x1 + x2) / 2;

          return (
            <g key={`${edge.from}->${edge.to}`}>
              <path
                d={`M ${x1} ${from.cy} C ${midX} ${from.cy}, ${midX} ${to.cy}, ${x2} ${to.cy}`}
                fill="none"
                className="stroke-muted-foreground"
                strokeWidth={1.5}
                markerEnd="url(#arrow)"
              />
              {edge.label && (
                <text
                  x={midX}
                  y={(from.cy + to.cy) / 2 - 6}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={NODE_W}
              height={NODE_H}
              rx={6}
              className="fill-card stroke-border"
              strokeWidth={1}
            />
            <text
              x={node.cx}
              y={node.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-[11px] font-medium"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
