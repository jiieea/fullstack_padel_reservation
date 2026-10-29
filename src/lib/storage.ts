export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ((JSON.parse(raw) as T) ?? fallback) : fallback;
  } catch {
    return fallback;
  }
}
export function saveRaw(key: string, json: string): void {
  try { window.localStorage.setItem(key, json); } catch { /* storage unavailable */ }
}
