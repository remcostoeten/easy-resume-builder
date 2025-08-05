import LZString from 'lz-string';
import { compress, decompress } from '../../shared/utilities/compression';

type TMeta = {
  compression?: boolean;
  version?: string;
  encrypt?: boolean;
};

const DEFAULT_OPTIONS: Required<TMeta> = {
  compression: true,
  version: '1.0',
  encrypt: false,
};

async function getItem<T>(key: string): Promise<T | null> {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const decompressed = await decompress(stored);
    if (!decompressed) return null;

    return JSON.parse(decompressed);
  } catch (error) {
    console.warn(`Failed to get item "${key}":`, error);
    return null;
  }
}

async function setItem<T>(key: string, value: T, options: TMeta = {}): Promise<void> {
  if (typeof window === 'undefined') return;

  const { compression, version, encrypt } = { ...DEFAULT_OPTIONS, ...options };

  try {
    let serialized = JSON.stringify(value);
    
    if (compression) {
      serialized = await compress(serialized);
    }

    localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn(`Failed to set item "${key}":`, error);
  }
}

function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

function clear(): void {
  if (typeof window === 'undefined') return;
  localStorage.clear();
}

function subscribe(key: string, callback: (newValue: any) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  function handleStorageChange(event: StorageEvent) {
    if (event.key === key) {
      const newValue = event.newValue ? getItem(event.newValue) : null;
      callback(newValue);
    }
  }

  window.addEventListener('storage', handleStorageChange);
  
  return () => window.removeEventListener('storage', handleStorageChange);
}

function getItemSync<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const decompressed = LZString.decompressFromUTF16(stored);
    if (!decompressed) return null;

    return JSON.parse(decompressed);
  } catch (error) {
    console.warn(`Failed to get item "${key}":`, error);
    return null;
  }
}

function setItemSync<T>(key: string, value: T, options: TMeta = {}): void {
  if (typeof window === 'undefined') return;

  const { compression, version, encrypt } = { ...DEFAULT_OPTIONS, ...options };

  try {
    let serialized = JSON.stringify(value);
    
    if (compression) {
      serialized = LZString.compressToUTF16(serialized);
    }

    localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn(`Failed to set item "${key}":`, error);
  }
}

export { getItem, setItem, removeItem, clear, subscribe, getItemSync, setItemSync };
export type { TMeta };
