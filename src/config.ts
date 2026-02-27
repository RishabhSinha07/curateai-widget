import type { CurateAIWidgetConfig } from './types';

const DEFAULTS: Omit<CurateAIWidgetConfig, 'apiUrl'> = {
  // Theme — dark futuristic with emerald/teal accents
  primaryColor: '#10b981',
  accentColor: '#10b981',
  backgroundColor: '#0b1015',
  userBubbleColor: '',       // derived as teal gradient if empty
  assistantBubbleColor: 'rgba(255,255,255,0.06)',
  textColor: '#e2e8f0',
  textSecondaryColor: '#94a3b8',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  borderRadius: 16,
  headerGradient: '',        // derived as dark glass gradient if empty

  // Layout
  position: 'bottom-right',
  offsetX: 20,
  offsetY: 20,
  zIndex: 999999,
  width: 400,
  height: 600,
  bubbleSize: 60,

  // Content
  title: 'Noeticex',
  subtitle: 'Your personal wellness guide',
  welcomeMessage: 'Hi there!',
  placeholder: 'What is on your mind?',
  poweredByText: 'Powered by Noeticex',
  poweredByUrl: 'https://noeticex.com',

  // Behavior
  openOnLoad: false,
  persistSession: true,
  showPoweredBy: true,
};

/** Parse data-* attributes from the widget script tag */
function parseDataAttributes(script: HTMLScriptElement): Partial<CurateAIWidgetConfig> {
  const config: Record<string, unknown> = {};
  const booleans = new Set(['openOnLoad', 'persistSession', 'showPoweredBy', 'requireAuth']);
  const numbers = new Set(['offsetX', 'offsetY', 'zIndex', 'width', 'height', 'bubbleSize', 'borderRadius']);

  for (const attr of Array.from(script.attributes)) {
    if (!attr.name.startsWith('data-')) continue;
    // Convert data-api-url → apiUrl
    const key = attr.name
      .slice(5)
      .replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    if (booleans.has(key)) {
      config[key] = attr.value !== 'false';
    } else if (numbers.has(key)) {
      config[key] = Number(attr.value);
    } else {
      config[key] = attr.value;
    }
  }

  return config as Partial<CurateAIWidgetConfig>;
}

/** Deep-merge config sources: defaults ← data-attrs ← window.CurateAIConfig */
export function resolveConfig(): CurateAIWidgetConfig {
  const script = document.currentScript as HTMLScriptElement | null;
  const dataAttrs = script ? parseDataAttributes(script) : {};
  const windowConfig = (window as any).CurateAIConfig as Partial<CurateAIWidgetConfig> | undefined;

  const merged = {
    ...DEFAULTS,
    ...dataAttrs,
    ...(windowConfig || {}),
  } as CurateAIWidgetConfig;

  // Derive defaults for gradient fields if not set
  if (!merged.userBubbleColor) {
    merged.userBubbleColor = `linear-gradient(135deg, #10b981, #059669)`;
  }
  if (!merged.headerGradient) {
    merged.headerGradient = `linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))`;
  }

  if (!merged.apiUrl) {
    console.error('[Noeticex] apiUrl is required. Set data-api-url or window.CurateAIConfig.apiUrl');
  }

  // Derive cognitoRegion from userPoolId if not explicitly set
  if (merged.cognitoUserPoolId && !merged.cognitoRegion) {
    const match = merged.cognitoUserPoolId.match(/^([a-z]+-[a-z]+-\d+)_/);
    if (match) merged.cognitoRegion = match[1];
  }

  // Default requireAuth to true when cognito config is present
  if (merged.requireAuth === undefined && merged.cognitoUserPoolId && merged.cognitoClientId) {
    merged.requireAuth = true;
  }

  return merged;
}

/** Lighten a hex color by a percentage */
function lighten(hex: string, pct: number): string {
  return adjustColor(hex, pct);
}

/** Darken a hex color by a percentage */
function darken(hex: string, pct: number): string {
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
