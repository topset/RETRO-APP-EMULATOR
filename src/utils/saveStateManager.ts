// Persistent Save States manager for retro emulators via IndexedDB
const DB_NAME = 'RetroEmulatorSaveDB';
const STORE_NAME = 'save_states';
const DB_VERSION = 1;

export interface SaveStateRecord {
  id: string; // e.g. "snes_Super_Mario_World_1720000000"
  consoleId: string;
  gameTitle: string;
  slot: number;
  timestamp: string;
  formattedDate: string;
  dataBase64?: string; // Serialized state if dumped
  notes?: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('consoleId', 'consoleId', { unique: false });
        store.createIndex('gameTitle', 'gameTitle', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getSaveStatesForGame(consoleId: string, gameTitle: string): Promise<SaveStateRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const all: SaveStateRecord[] = request.result || [];
        const filtered = all
          .filter((item) => item.consoleId === consoleId && item.gameTitle.toLowerCase() === gameTitle.toLowerCase())
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(filtered);
      };
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    console.error('Error fetching save states:', err);
    return [];
  }
}

export async function saveGameState(
  consoleId: string,
  gameTitle: string,
  slot: number,
  notes?: string
): Promise<SaveStateRecord> {
  const db = await openDB();
  const now = new Date();
  const id = `${consoleId}_${gameTitle.replace(/\s+/g, '_')}_slot${slot}_${now.getTime()}`;

  const record: SaveStateRecord = {
    id,
    consoleId,
    gameTitle,
    slot,
    timestamp: now.toISOString(),
    formattedDate: now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: notes || `Ranura de guardado #${slot}`,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(record);

    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteSaveState(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}
