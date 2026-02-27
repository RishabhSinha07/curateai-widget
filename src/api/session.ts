const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredSession {
  sessionId: string;
  timestamp: number;
}

function getStorageKey(apiUrl: string): string {
  // Simple hash of apiUrl to namespace sessions
  let hash = 0;
  for (let i = 0; i < apiUrl.length; i++) {
    hash = ((hash << 5) - hash + apiUrl.charCodeAt(i)) | 0;
  }
  return `curateai_session_${Math.abs(hash).toString(36)}`;
}

export function loadSession(apiUrl: string): string | null {
  try {
    const key = getStorageKey(apiUrl);
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const stored: StoredSession = JSON.parse(raw);
    if (Date.now() - stored.timestamp > SESSION_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return stored.sessionId;
  } catch {
    return null;
  }
}

export function saveSession(apiUrl: string, sessionId: string): void {
  try {
    const key = getStorageKey(apiUrl);
    const stored: StoredSession = { sessionId, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(stored));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function clearSession(apiUrl: string): void {
  try {
    const key = getStorageKey(apiUrl);
    localStorage.removeItem(key);
  } catch {
    // silently ignore
  }
}
