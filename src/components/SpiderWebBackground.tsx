function round(n: number) {
  return Number(n.toFixed(2));
}

function buildSpiderWeb() {
  const spokes = 14;
  const rings = 7;
  const cx = 200;
  const cy = 200;
  const maxR = 195;

  const circleRadii = Array.from({ length: rings }, (_, ring) => 22 + ring * 28);

  const spokeLines = Array.from({ length: spokes }, (_, i) => {
    const angle = (i / spokes) * Math.PI * 2;
    return {
      key: `spoke-${i}`,
      x2: round(cx + Math.cos(angle) * maxR),
      y2: round(cy + Math.sin(angle) * maxR),
    };
  });

  const webLines: Array<{ key: string; x1: number; y1: number; x2: number; y2: number }> = [];
  for (let ring = 0; ring < rings - 1; ring += 1) {
    const r1 = 22 + ring * 28;
    const r2 = 22 + (ring + 1) * 28;
    for (let i = 0; i < spokes; i += 1) {
      const a1 = (i / spokes) * Math.PI * 2;
      const a2 = ((i + 0.5) / spokes) * Math.PI * 2;
      webLines.push({
        key: `web-${ring}-${i}`,
        x1: round(cx + Math.cos(a1) * r1),
        y1: round(cy + Math.sin(a1) * r1),
        x2: round(cx + Math.cos(a2) * r2),
        y2: round(cy + Math.sin(a2) * r2),
      });
    }
  }

  return { circleRadii, spokeLines, webLines, cx, cy };
}

const SPIDER_WEB = buildSpiderWeb();

type SpiderWebBackgroundProps = {
  className?: string;
  /** Position of the web within the section */
  align?: "right" | "left" | "center";
};

export default function SpiderWebBackground({
  className = "",
  align = "right",
}: SpiderWebBackgroundProps) {
  const { circleRadii, spokeLines, webLines, cx, cy } = SPIDER_WEB;

  const alignClass =
    align === "left"
      ? "left-0 right-auto"
      : align === "center"
        ? "left-1/2 right-auto -translate-x-1/2"
        : "right-0 left-auto";

  return (
    <div
      className={`spider-web-bg pointer-events-none absolute inset-y-0 w-[min(72%,520px)] max-w-xl overflow-hidden ${alignClass} ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="spider-web-bg__svg h-full w-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="400" fill="transparent" />
        <g className="spider-web-bg__spin" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {circleRadii.map((r, ring) => (
            <circle
              key={`ring-${ring}`}
              className="spider-web-bg__line"
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={ring === 0 ? 1.5 : 1.15}
              strokeDasharray={ring % 2 === 0 ? "4 6" : undefined}
            />
          ))}
          {spokeLines.map((line) => (
            <line
              key={line.key}
              className="spider-web-bg__line"
              x1={cx}
              y1={cy}
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth="1.1"
            />
          ))}
          {webLines.map((line) => (
            <line
              key={line.key}
              className="spider-web-bg__dash"
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth="0.95"
              strokeDasharray="5 7"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
