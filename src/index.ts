import { render, h } from 'preact';
import { resolveConfig } from './config';
import { buildStyles } from './styles';
import { WidgetRoot } from './components/WidgetRoot';
import type { CurateAIPublicAPI } from './types';

function init(): void {
  const config = resolveConfig();
  if (!config.apiUrl) return;

  // Create host element
  const host = document.createElement('div');
  host.id = 'curateai-widget-host';
  document.body.appendChild(host);

  // Attach Shadow DOM
  const shadow = host.attachShadow({ mode: 'open' });

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = buildStyles(config);
  shadow.appendChild(styleEl);

  // Mount container
  const mountPoint = document.createElement('div');
  shadow.appendChild(mountPoint);

  // API ref for programmatic control
  let apiRef: CurateAIPublicAPI | null = null;

  const setApi = (api: CurateAIPublicAPI) => {
    apiRef = api;
    // Expose global API
    (window as any).CurateAI = api;
  };

  render(h(WidgetRoot, { config, onApiReady: setApi }), mountPoint);

  // Auto-open if configured
  if (config.openOnLoad) {
    // Allow a tick for component to mount
    requestAnimationFrame(() => apiRef?.open());
  }
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
