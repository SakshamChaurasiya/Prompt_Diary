"use client";

import { useId } from "react";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textSize?: string;
}

export default function Logo({
  size = 36,
  className = "",
  showText = true,
  textSize = "1.25rem",
}: LogoProps) {
  const id = useId();

  const mainGradientId = `${id}-logo-grad-main`;
  const glowGradientId = `${id}-logo-grad-glow`;
  const accentGradientId = `${id}-logo-grad-accent`;
  const bgGlowId = `${id}-logo-bg-glow`;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
      }}
      className={className}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="none"
        width={size}
        height={size}
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={mainGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#4d7cff" />
            <stop offset="100%" stopColor="#b026ff" />
          </linearGradient>

          <linearGradient id={glowGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#b026ff" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id={accentGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffd0" />
            <stop offset="100%" stopColor="#00b3ff" />
          </linearGradient>

          <radialGradient id={bgGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4d7cff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#06070d" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <circle cx="256" cy="256" r="240" fill={`url(#${bgGlowId})`} />

        {/* Outer hexagonal ring */}
        <polygon
          points="256,36 436,140 436,372 256,476 76,372 76,140"
          fill="none"
          stroke={`url(#${glowGradientId})`}
          strokeWidth="2.5"
          opacity="0.5"
        />

        {/* Brain left hemisphere */}
        <path
          d="M256,160 C256,160 230,140 200,145 C170,150 148,175 145,210 C142,245 155,265 145,290 C135,315 120,320 125,350 C130,380 160,395 190,390 C220,385 240,365 256,340"
          stroke={`url(#${mainGradientId})`}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Brain right hemisphere */}
        <path
          d="M256,160 C256,160 282,140 312,145 C342,150 364,175 367,210 C370,245 357,265 367,290 C377,315 392,320 387,350 C382,380 352,395 322,390 C292,385 272,365 256,340"
          stroke={`url(#${mainGradientId})`}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Neural connection lines */}
        <line x1="195" y1="200" x2="256" y2="230" stroke={`url(#${accentGradientId})`} strokeWidth="2.5" opacity="0.7" />
        <line x1="317" y1="200" x2="256" y2="230" stroke={`url(#${accentGradientId})`} strokeWidth="2.5" opacity="0.7" />
        <line x1="175" y1="280" x2="256" y2="260" stroke={`url(#${accentGradientId})`} strokeWidth="2.5" opacity="0.7" />
        <line x1="337" y1="280" x2="256" y2="260" stroke={`url(#${accentGradientId})`} strokeWidth="2.5" opacity="0.7" />
        <line x1="200" y1="350" x2="256" y2="310" stroke={`url(#${accentGradientId})`} strokeWidth="2.5" opacity="0.7" />
        <line x1="312" y1="350" x2="256" y2="310" stroke={`url(#${accentGradientId})`} strokeWidth="2.5" opacity="0.7" />
        <line x1="256" y1="230" x2="256" y2="260" stroke={`url(#${accentGradientId})`} strokeWidth="2.5" opacity="0.7" />
        <line x1="256" y1="260" x2="256" y2="310" stroke={`url(#${accentGradientId})`} strokeWidth="2.5" opacity="0.7" />

        {/* Neural nodes */}
        <circle cx="256" cy="230" r="6" fill={`url(#${mainGradientId})`} />
        <circle cx="256" cy="260" r="5" fill={`url(#${accentGradientId})`} />
        <circle cx="256" cy="310" r="6" fill={`url(#${mainGradientId})`} />
        <circle cx="195" cy="200" r="4" fill="#00e5ff" />
        <circle cx="317" cy="200" r="4" fill="#00e5ff" />
        <circle cx="175" cy="280" r="4" fill="#4d7cff" />
        <circle cx="337" cy="280" r="4" fill="#4d7cff" />
        <circle cx="200" cy="350" r="4" fill="#b026ff" />
        <circle cx="312" cy="350" r="4" fill="#b026ff" />

        {/* Pen/cursor element */}
        <g transform="translate(340, 360) rotate(-45)">
          <rect x="0" y="0" width="12" height="65" rx="3" fill={`url(#${mainGradientId})`} />
          <polygon points="0,65 12,65 6,82" fill="#00e5ff" />
          <rect x="2" y="5" width="3" height="20" rx="1.5" fill="white" opacity="0.3" />
        </g>

        {/* Sparkle dots */}
        <circle cx="130" cy="130" r="3" fill="#00e5ff" opacity="0.6" />
        <circle cx="390" cy="120" r="2.5" fill="#b026ff" opacity="0.5" />
        <circle cx="110" cy="380" r="2" fill="#4d7cff" opacity="0.4" />
        <circle cx="420" cy="400" r="3" fill="#00e5ff" opacity="0.5" />

        {/* Prompt cursor */}
        <rect x="350" y="110" width="4" height="22" rx="2" fill="#00e5ff" opacity="0.8" />
        <text x="310" y="128" fontFamily="monospace" fontSize="18" fill="#00e5ff" opacity="0.5">
          &gt;_
        </text>
      </svg>

      {showText && (
        <span
          style={{
            fontSize: textSize,
            fontWeight: 800,
            letterSpacing: "-0.025em",
          }}
          className="gradient-text"
        >
          Prompt Diary
        </span>
      )}
    </span>
  );
}
