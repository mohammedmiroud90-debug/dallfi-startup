"use client";

export default function HeroPaintCorners() {
  return (
    <div className="hero-paint pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {/* Left corner only — black & grey-brown */}
      <div className="hero-paint-corner hero-paint-left">
        <svg viewBox="0 0 280 400" className="h-full w-full" preserveAspectRatio="xMinYMin meet">
          <defs>
            <filter id="paint-soft-l" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="paint-ink" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#111111" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#2a2a2a" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="paint-char" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#3d342c" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#5c4f42" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="paint-taupe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b5e52" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8a7a6b" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="paint-ash" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a4540" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2c2a28" stopOpacity="0.48" />
            </linearGradient>
          </defs>

          <g filter="url(#paint-soft-l)" className="hero-paint-layer hero-paint-layer-a">
            <path
              d="M-10 40 C40 20, 90 70, 70 130 C50 190, 20 210, -10 250 Z"
              fill="url(#paint-ink)"
            />
            <path
              d="M0 180 C55 160, 110 200, 95 260 C80 320, 30 350, -5 390 Z"
              fill="url(#paint-char)"
              opacity="0.9"
            />
            <path
              d="M20 90 C80 100, 120 140, 100 190 C85 230, 40 240, 10 220 Z"
              fill="url(#paint-taupe)"
              opacity="0.75"
            />
            <path
              d="M-5 300 C45 290, 90 330, 75 380 C60 420, 15 430, -10 410 Z"
              fill="url(#paint-ash)"
              opacity="0.7"
            />
            <ellipse cx="48" cy="155" rx="18" ry="7" fill="#1a1a1a" opacity="0.55" transform="rotate(-28 48 155)" />
            <ellipse cx="72" cy="310" rx="22" ry="6" fill="#7a6a5a" opacity="0.5" transform="rotate(18 72 310)" />
            <ellipse cx="36" cy="250" rx="12" ry="5" fill="#4a4038" opacity="0.45" transform="rotate(-12 36 250)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
