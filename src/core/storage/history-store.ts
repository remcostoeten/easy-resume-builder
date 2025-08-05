import { pack, unpack } from '../../shared/utilities/envelope';

type THistoryEntry<T = any> = {
  id: string;
  timestamp: number;
  description: string;
  data: T;
  version: number;
};

type THistorySnapshot<T = any> = {
  id: string;
  description: string;
  savedAt: Date;
  version: number;
  data: T;
};

type THistoryOptions = {
  maxEntries?: number;
  storageKey?: string;
  autoSave?: boolean;
};

function createHistoryStore<T>(options: THistoryOptions = {}) {
  const {
    maxEntries = 50,
    storageKey = 'app-history',
    autoSave = true
  } = options;

  async function saveSnapshot(data: T, description: string): Promise<string> {
    const id = generateSnapshotId();
    const packed = await pack(data);
    
    const entry: THistoryEntry<string> = {
      id,
      timestamp: Date.now(),
      description,
      data: packed,
      version: 1
    };

    const history = await loadHistory();
    history.unshift(entry);

    if (history.length > maxEntries) {
      history.splice(maxEntries);
    }

    if (autoSave) {
      await saveHistoryToStorage(history);
    }

    return id;
  }

  async function loadSnapshot(id: string): Promise<THistorySnapshot<T> | null> {
    const history = await loadHistory();
    const entry = history.find(h => h.id === id);
    
    if (!entry) {
      return null;
    }

    const unpacked = await unpack<T>(entry.data);
    
    return {
      id: entry.id,
      description: entry.description,
      savedAt: new Date(entry.timestamp),
      version: entry.version,
      data: unpacked
    };
  }

  async function getHistoryList(): Promise<Array<Omit<THistorySnapshot<T>, 'data'>>> {
    const history = await loadHistory();
    
    return history.map(entry => ({
      id: entry.id,
      description: entry.description,
      savedAt: new Date(entry.timestamp),
      version: entry.version
    }));
  }

  async function revertToSnapshot(id: string): Promise<T | null> {
    const snapshot = await loadSnapshot(id);
    return snapshot ? snapshot.data : null;
  }

  async function deleteSnapshot(id: string): Promise<boolean> {
    const history = await loadHistory();
    const index = history.findIndex(h => h.id === id);
    
    if (index === -1) {
      return false;
    }

    history.splice(index, 1);
    
    if (autoSave) {
      await saveHistoryToStorage(history);
    }

    return true;
  }

  async function clearHistory(): Promise<void> {
    if (autoSave) {
      await saveHistoryToStorage([]);
    }
  }

  async function loadHistory(): Promise<THistoryEntry<string>[]> {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async function saveHistoryToStorage(history: THistoryEntry<string>[]): Promise<void> {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  function generateSnapshotId(): string {
    return `snapshot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  return {
    saveSnapshot,
    loadSnapshot,
    getHistoryList,
    revertToSnapshot,
    deleteSnapshot,
    clearHistory
  };
}

export { createHistoryStore };
export type { THistorySnapshot, THistoryOptions };
