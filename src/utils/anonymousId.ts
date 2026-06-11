/**
 * Stable per-visitor ID minted on first widget load and persisted in
 * localStorage. The backend uses it (per tenant) to count free messages
 * before requiring the visitor to fill out the lead-capture form.
 *
 * Namespaced by apiUrl so a browser visiting two different widget
 * deployments doesn't share a quota across them.
 *
 * Bypassable by clearing storage / incognito — accepted tradeoff for
 * frictionless first-message UX.
 */

function getStorageKey(apiUrl: string): string {
  let hash = 0;
  for (let i = 0; i < apiUrl.length; i++) {
    hash = ((hash << 5) - hash + apiUrl.charCodeAt(i)) | 0;
  }
  return `curateai_anon_${Math.abs(hash).toString(36)}`;
}

export function getOrCreateAnonymousId(apiUrl: string): string {
  const key = getStorageKey(apiUrl);
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;

    const fresh = crypto.randomUUID();
    localStorage.setItem(key, fresh);
    return fresh;
  } catch {
    // localStorage unavailable (private mode + storage blocked, etc).
    // Fall back to a per-tab ephemeral ID — the user will get the full
    // free quota each new tab, which is fine.
    return crypto.randomUUID();
  }
}
