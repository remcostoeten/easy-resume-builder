import { useAtomValue } from 'jotai/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { resumeAtomWithMigration } from '@/store/resume-store';

type TSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type TProps = {
  throttleMs?: number;
};

const STORAGE_KEY = 'resume-builder-data';
const TIMESTAMP_KEY = 'resume-builder-last-saved';

export function useResumePersistence({ throttleMs = 1000 }: TProps = {}) {
  const resumeData = useAtomValue(resumeAtomWithMigration);
  const [saveStatus, setSaveStatus] = useState<TSaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  const saveToLocalStorage = useCallback((data: typeof resumeData): void => {
    if (typeof window === 'undefined') {
      setSaveStatus('error');
      return;
    }

    try {
      setSaveStatus('saving');
      const now = new Date();
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serialized);
      localStorage.setItem(TIMESTAMP_KEY, now.toISOString());
      lastSavedRef.current = serialized;
      setLastSavedAt(now);
      setSaveStatus('saved');
    } catch (error) {
      console.warn('Failed to save resume data to localStorage:', error);
      setSaveStatus('error');
    }
  }, []);

  const manualSave = useCallback((): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    saveToLocalStorage(resumeData);
  }, [resumeData, saveToLocalStorage]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !lastSavedAt) {
      const savedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
      if (savedTimestamp) {
        try {
          const parsedDate = new Date(savedTimestamp);
          setLastSavedAt(parsedDate);
        } catch (error) {
          console.warn('Invalid timestamp in localStorage:', savedTimestamp);
        }
      }
    }
  }, []);

  useEffect(() => {
    const currentSerialized = JSON.stringify(resumeData);

    if (currentSerialized === lastSavedRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSaveStatus('idle');

    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage(resumeData);
      timeoutRef.current = null;
    }, throttleMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [resumeData, throttleMs, saveToLocalStorage]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    saveStatus,
    manualSave,
    lastSavedAt,
  };
}
