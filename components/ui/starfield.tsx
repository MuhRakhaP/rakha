/**
 * A fixed scatter of stars behind the hero.
 *
 * Positions are a literal array rather than a random draw. A random one would
 * differ between the server render and the client and React would discard the
 * markup; a literal list costs nothing and keeps the composition repeatable, so
 * the hero looks the same on every load and in every screenshot.
 *
 * The twinkle is one shared keyframe on a per-star negative delay. No
 * JavaScript, no per-frame work, opacity only, so it costs the compositor
 * nothing and cannot pull the hero off 60fps on a phone.
 */
const STARS: [left: number, top: number, size: number, delay: number][] = [
  [6, 18, 2, -0.4],
  [12, 62, 1, -2.1],
  [17, 34, 2, -3.3],
  [22, 78, 1, -1.2],
  [26, 12, 1, -0.8],
  [31, 48, 2, -2.6],
  [35, 86, 1, -3.9],
  [39, 24, 1, -1.7],
  [43, 68, 2, -0.2],
  [47, 8, 1, -2.9],
  [52, 40, 1, -1.5],
  [56, 74, 2, -3.5],
  [61, 20, 1, -0.6],
  [65, 56, 1, -2.3],
  [69, 90, 2, -1.1],
  [73, 32, 1, -3.1],
  [78, 66, 1, -0.9],
  [82, 16, 2, -2.7],
  [86, 50, 1, -1.8],
  [90, 80, 1, -3.7],
  [94, 28, 1, -0.5],
  [9, 44, 1, -2.4],
  [29, 58, 1, -3.4],
  [49, 88, 1, -1.3],
  [63, 44, 1, -2.8],
  [77, 8, 1, -0.3],
  [87, 92, 1, -3.6],
  [97, 60, 1, -1.6],
  [3, 72, 1, -1.9],
  [11, 30, 1, -3.2],
  [19, 52, 1, -0.6],
  [24, 4, 1, -2.5],
  [33, 70, 1, -3.8],
  [38, 40, 1, -1.4],
  [45, 94, 1, -2.1],
  [58, 6, 1, -3.3],
  [67, 36, 1, -0.9],
  [75, 84, 1, -2.7],
  [84, 62, 1, -1.1],
  [91, 12, 1, -3.5],
  [99, 44, 1, -2.2],
  [7, 88, 1, -3.0],
  [21, 66, 1, -1.7],
  [41, 20, 1, -2.4],
  [55, 52, 1, -0.7],
  [71, 72, 1, -3.4],
  [89, 36, 1, -2.0],
];

export function Starfield() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map(([left, top, size, delay], i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
