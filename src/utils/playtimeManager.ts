// Playtime tracking and persistence manager using localStorage
const STORAGE_KEY = 'retro_emulator_playtime_records_v1';

export interface PlaytimeRecord {
  seconds: number;
  lastPlayed: string;
  sessionsCount: number;
}

// Map key format: `${consoleId}:${cleanGameName}`
export type PlaytimeStore = Record<string, PlaytimeRecord>;

function getPlaytimeStore(): PlaytimeStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function savePlaytimeStore(store: PlaytimeStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Error saving playtime store:', e);
  }
}

export function getGameKey(consoleId: string, gameName: string): string {
  return `${consoleId.toLowerCase()}:${gameName.trim().toLowerCase()}`;
}

/**
 * Returns the tracked playtime in seconds for a specific game on a specific console.
 */
export function getPlaytimeSeconds(consoleId: string, gameName: string): number {
  const store = getPlaytimeStore();
  const key = getGameKey(consoleId, gameName);
  return store[key]?.seconds || 0;
}

/**
 * Returns full record for a game
 */
export function getGamePlaytimeRecord(consoleId: string, gameName: string): PlaytimeRecord | null {
  const store = getPlaytimeStore();
  const key = getGameKey(consoleId, gameName);
  return store[key] || null;
}

/**
 * Adds elapsed seconds to a game's total playtime record.
 */
export function addPlaytime(consoleId: string, gameName: string, additionalSeconds: number): number {
  if (!gameName || additionalSeconds <= 0) return 0;

  const store = getPlaytimeStore();
  const key = getGameKey(consoleId, gameName);
  const existing = store[key] || {
    seconds: 0,
    lastPlayed: new Date().toISOString(),
    sessionsCount: 0,
  };

  const updated: PlaytimeRecord = {
    seconds: existing.seconds + Math.round(additionalSeconds),
    lastPlayed: new Date().toISOString(),
    sessionsCount: existing.sessionsCount + 1,
  };

  store[key] = updated;
  savePlaytimeStore(store);
  return updated.seconds;
}

/**
 * Human readable formatted string of playtime:
 * - "0 min" (if < 60s)
 * - "X min" (if < 60 min)
 * - "X h Y min" (if >= 1 hour)
 * - "X.X horas"
 */
export function formatPlaytime(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 60) {
    return totalSeconds > 0 ? `${totalSeconds}s` : 'Sin jugar';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} m`;
}

/**
 * Precise hours format (e.g., "1.5 horas jugadas")
 */
export function formatPlaytimeHoursBadge(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 60) {
    return '0 h jugadas';
  }

  const hours = (totalSeconds / 3600).toFixed(1);
  // remove .0 if integer
  const cleanHours = hours.endsWith('.0') ? hours.slice(0, -2) : hours;
  return `${cleanHours} ${cleanHours === '1' ? 'hora jugada' : 'horas jugadas'}`;
}
