import { useId } from "react";
import {
  LOGO_COLORS,
  LOGO_VIEWBOX,
  logoHeightForWidth,
} from "@/lib/brand/logoMarkSvg";

interface LogoProps {
  className?: string;
  size?: number;
  title?: string;
}

export function Logo({
  className = "",
  size = 60,
  title = "LinguaBridge",
}: LogoProps) {
  const uid = useId().replace(/:/g, "");
  const panelGlowId = `${uid}-panel-glow`;
  const textGlowId = `${uid}-text-glow`;
  const height = logoHeightForWidth(size);

  return (
    <svg
      width={size}
      height={height}
      viewBox={LOGO_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-hidden rounded-lg shadow-xl ${className}`}
      style={{ filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.35))" }}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>

      <defs>
        <filter id={panelGlowId} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={LOGO_COLORS.cyan} floodOpacity="0.65" />
          <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={LOGO_COLORS.cyan} floodOpacity="0.35" />
        </filter>
        <filter id={textGlowId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={LOGO_COLORS.cyan} />
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={LOGO_COLORS.cyan} floodOpacity="0.6" />
        </filter>
      </defs>

      <g id="germany-side">
        <rect x="0" y="0" width="250" height="116.6" fill="#1e1b4b" opacity="0.95" />
        <rect x="0" y="116.6" width="250" height="116.6" fill="#ef4444" />
        <rect x="0" y="233.2" width="250" height="116.8" fill="#eab308" />
      </g>

      <g id="usa-side" transform="translate(250, 0)">
        <rect x="0" y="0" width="250" height="350" fill="#ffffff" />
        <path
          d="M0 0 H250 V50 H0 Z M0 100 H250 V150 H0 Z M0 200 H250 V250 H0 Z M0 300 H250 V350 H0 Z"
          fill="#ef4444"
        />
        <rect x="0" y="0" width="135" height="185" fill="#1d4ed8" />
        <g fill="#ffffff">
          <circle cx="25" cy="30" r="3.5" />
          <circle cx="55" cy="30" r="3.5" />
          <circle cx="85" cy="30" r="3.5" />
          <circle cx="115" cy="30" r="3.5" />
          <circle cx="40" cy="65" r="3.5" />
          <circle cx="70" cy="65" r="3.5" />
          <circle cx="100" cy="65" r="3.5" />
          <circle cx="25" cy="100" r="3.5" />
          <circle cx="55" cy="100" r="3.5" />
          <circle cx="85" cy="100" r="3.5" />
          <circle cx="115" cy="100" r="3.5" />
          <circle cx="40" cy="135" r="3.5" />
          <circle cx="70" cy="135" r="3.5" />
          <circle cx="100" cy="135" r="3.5" />
          <circle cx="55" cy="165" r="3.5" />
          <circle cx="85" cy="165" r="3.5" />
        </g>
      </g>

      <rect
        x="180"
        y="110"
        width="140"
        height="130"
        rx="16"
        fill={LOGO_COLORS.panel}
        stroke={LOGO_COLORS.cyan}
        strokeWidth="4"
        filter={`url(#${panelGlowId})`}
      />

      <text
        x="250"
        y="178"
        fill={LOGO_COLORS.cyan}
        fontSize="72"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        textAnchor="middle"
        dominantBaseline="middle"
        letterSpacing="1"
        filter={`url(#${textGlowId})`}
      >
        LB
      </text>
    </svg>
  );
}

export { LOGO_COLORS };
