/** Lighten a hex color by a percentage (0–100) */
export function lighten(hex: string, pct: number): string {
  return adjustColor(hex, pct);
}

/** Darken a hex color by a percentage (0–100) */
export function darken(hex: string, pct: number): string {
  return adjustColor(hex, -pct);
}

function adjustColor(hex: string, pct: number): string {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + Math.round(255 * pct / 100)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(255 * pct / 100)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(255 * pct / 100)));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
