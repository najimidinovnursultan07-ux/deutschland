/** Rectangular DE + US + LB logo — shared by UI and PWA export */
export const LOGO_VIEWBOX = "0 0 500 350";
export const LOGO_ASPECT = 350 / 500;

export const LOGO_COLORS = {
  panel: "#0f172a",
  cyan: "#22d3ee",
};

export function logoHeightForWidth(width: number): number {
  return Math.round(width * LOGO_ASPECT);
}

export function buildLogoFilterDefs(prefix: string): string {
  return `
  <filter id="${prefix}-panel-glow" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${LOGO_COLORS.cyan}" flood-opacity="0.65"/>
    <feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="${LOGO_COLORS.cyan}" flood-opacity="0.35"/>
  </filter>
  <filter id="${prefix}-text-glow" x="-50%" y="-50%" width="200%" height="200%">
    <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${LOGO_COLORS.cyan}" flood-opacity="1"/>
    <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="${LOGO_COLORS.cyan}" flood-opacity="0.6"/>
  </filter>`;
}

export function buildLogoMarkSvg(prefix: string): string {
  return `
  <g id="germany-side">
    <rect x="0" y="0" width="250" height="116.6" fill="#1e1b4b" opacity="0.95"/>
    <rect x="0" y="116.6" width="250" height="116.6" fill="#ef4444"/>
    <rect x="0" y="233.2" width="250" height="116.8" fill="#eab308"/>
  </g>
  <g id="usa-side" transform="translate(250, 0)">
    <rect x="0" y="0" width="250" height="350" fill="#ffffff"/>
    <path d="M0 0 H250 V50 H0 Z M0 100 H250 V150 H0 Z M0 200 H250 V250 H0 Z M0 300 H250 V350 H0 Z" fill="#ef4444"/>
    <rect x="0" y="0" width="135" height="185" fill="#1d4ed8"/>
    <g fill="#ffffff">
      <circle cx="25" cy="30" r="3.5"/>
      <circle cx="55" cy="30" r="3.5"/>
      <circle cx="85" cy="30" r="3.5"/>
      <circle cx="115" cy="30" r="3.5"/>
      <circle cx="40" cy="65" r="3.5"/>
      <circle cx="70" cy="65" r="3.5"/>
      <circle cx="100" cy="65" r="3.5"/>
      <circle cx="25" cy="100" r="3.5"/>
      <circle cx="55" cy="100" r="3.5"/>
      <circle cx="85" cy="100" r="3.5"/>
      <circle cx="115" cy="100" r="3.5"/>
      <circle cx="40" cy="135" r="3.5"/>
      <circle cx="70" cy="135" r="3.5"/>
      <circle cx="100" cy="135" r="3.5"/>
      <circle cx="55" cy="165" r="3.5"/>
      <circle cx="85" cy="165" r="3.5"/>
    </g>
  </g>
  <rect x="180" y="110" width="140" height="130" rx="16" fill="${LOGO_COLORS.panel}" stroke="${LOGO_COLORS.cyan}" stroke-width="4" filter="url(#${prefix}-panel-glow)"/>
  <text x="250" y="178" fill="${LOGO_COLORS.cyan}" font-size="72" font-weight="900" font-family="system-ui,-apple-system,sans-serif" text-anchor="middle" dominant-baseline="middle" letter-spacing="1" filter="url(#${prefix}-text-glow)">LB</text>`;
}

export function buildLogoSvg(options: { width?: number } = {}): string {
  const width = options.width ?? 500;
  const height = logoHeightForWidth(width);
  const prefix = "lb";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}" width="${width}" height="${height}" fill="none">
  <defs>${buildLogoFilterDefs(prefix)}</defs>
  ${buildLogoMarkSvg(prefix)}
</svg>`;
}
