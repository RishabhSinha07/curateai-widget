import type { CurateAIWidgetConfig } from './types';

const DEFAULTS: Omit<CurateAIWidgetConfig, 'apiUrl'> = {
  // Theme
  primaryColor: '#7fa389',
  accentColor: '#e38b75',
  backgroundColor: '#f5f3f7',
  userBubbleColor: '',       // derived from accentColor gradient if empty
  assistantBubbleColor: '#ffffff',
  textColor: '#2d2d2d',
  textSecondaryColor: '#6b6b6b',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  borderRadius: 16,
  headerGradient: '',        // derived from primaryColor if empty

  // Layout
  position: 'bottom-right',
  offsetX: 20,
  offsetY: 20,
  zIndex: 999999,
  width: 400,
  height: 600,
  bubbleSize: 60,

  // Content
  title: 'CurateAI',
  subtitle: 'Your personal wellness guide',
  welcomeMessage: 'Hi! I can help you find the right wellness products. What are you looking for today?',
  placeholder: 'Type your message...',
  poweredByText: 'Powered by CurateAI',
  poweredByUrl: 'https://curateai.com',

  // Behavior
  openOnLoad: false,
  persistSession: true,
  showPoweredBy: true,
};

/** Parse data-* attributes from the widget script tag */
function parseDataAttributes(script: HTMLScriptElement): Partial<CurateAIWidgetConfig> {
  const config: Record<string, unknown> = {};
  const booleans = new Set(['openOnLoad', 'persistSession', 'showPoweredBy']);
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
    merged.userBubbleColor = `linear-gradient(135deg, ${lighten(merged.accentColor, 15)}, ${merged.accentColor})`;
  }
  if (!merged.headerGradient) {
    merged.headerGradient = `linear-gradient(135deg, ${merged.primaryColor}, ${darken(merged.primaryColor, 15)})`;
  }

  if (!merged.apiUrl) {
    console.error('[CurateAI] apiUrl is required. Set data-api-url or window.CurateAIConfig.apiUrl');
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
