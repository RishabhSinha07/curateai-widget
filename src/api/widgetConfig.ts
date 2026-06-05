import type { CurateAIWidgetConfig } from '../types';

interface WidgetConfigResponse {
  theme?: Partial<CurateAIWidgetConfig>;
}

/**
 * Fetch tenant-specific theme/branding from the backend.
 * Returns an empty object on any failure (network, timeout, non-2xx, bad JSON);
 * callers should treat the result as overrides on top of local config.
 */
export async function fetchWidgetConfig(
  apiUrl: string,
  clientId: string,
  timeoutMs: number,
): Promise<Partial<CurateAIWidgetConfig>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${apiUrl.replace(/\/$/, '')}/widget/config?client_id=${encodeURIComponent(clientId)}`;
    const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn(`[CurateAI] /widget/config returned ${res.status}; using local config`);
      return {};
    }
    const data = (await res.json()) as WidgetConfigResponse;
    return (data && data.theme) || {};
  } catch (err) {
    console.warn('[CurateAI] /widget/config fetch failed; using local config', err);
    return {};
  } finally {
    clearTimeout(timer);
  }
}
