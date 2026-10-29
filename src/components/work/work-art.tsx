import type { Project } from "@/content/projects";

/** Generated typographic / diagram art, used in place of screenshots. */
export function WorkArt({
  art,
  className = "",
}: {
  art: Project["art"];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 220"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      {art === "rack" && (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} transform={`translate(80 ${30 + i * 27})`}>
              <rect width="160" height="21" rx="3" />
              <circle
                cx="14"
                cy="10.5"
                r="2.5"
                fill="currentColor"
                opacity={i % 2 ? 0.4 : 1}
              />
              <circle
                cx="24"
                cy="10.5"
                r="2.5"
                fill="currentColor"
                opacity={i % 3 ? 1 : 0.4}
              />
              <path d={`M110 6v9M118 6v9M126 6v9M134 6v9M142 6v9`} opacity="0.5" />
            </g>
          ))}
        </g>
      )}
      {art === "shield" && (
        <g>
          <path d="M160 26 220 48v52c0 40-26 70-60 86-34-16-60-46-60-86V48z" />
          <path
            d="M160 46 204 62v38c0 30-19 52-44 64-25-12-44-34-44-64V62z"
            opacity="0.45"
          />
          <rect x="140" y="96" width="40" height="32" rx="4" />
          <path d="M148 96v-10a12 12 0 0 1 24 0v10" />
          <circle cx="160" cy="112" r="3" fill="currentColor" />
        </g>
      )}
      {art === "grid" && (
        <g>
          {Array.from({ length: 24 }, (_, i) => {
            const x = 52 + (i % 6) * 38;
            const y = 40 + Math.floor(i / 6) * 38;
            const filled = [2, 7, 9, 14, 15, 20].includes(i);
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="30"
                height="30"
                rx="4"
                fill={filled ? "currentColor" : "none"}
                opacity={filled ? 0.85 : 0.5}
              />
            );
          })}
        </g>
      )}
      {art === "link" && (
        <g>
          <rect x="54" y="88" width="96" height="44" rx="22" />
          <rect x="170" y="88" width="96" height="44" rx="22" />
          <path d="M126 110h68" strokeWidth="2.5" />
          <path d="M40 186c40-30 80 10 120-20s80-10 120-50" opacity="0.5" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={64 + i * 48}
              cy={186 - i * 14}
              r="3"
              fill="currentColor"
            />
          ))}
        </g>
      )}
      {art === "orbit" && (
        <g>
          <circle cx="160" cy="110" r="22" fill="currentColor" opacity="0.85" />
          <ellipse cx="160" cy="110" rx="110" ry="40" opacity="0.5" />
          <ellipse
            cx="160"
            cy="110"
            rx="70"
            ry="80"
            opacity="0.5"
            transform="rotate(30 160 110)"
          />
          <circle cx="270" cy="110" r="5" fill="currentColor" />
          <circle cx="112" cy="40" r="5" fill="currentColor" />
          <circle cx="96" cy="160" r="4" fill="currentColor" />
        </g>
      )}
    </svg>
  );
}
