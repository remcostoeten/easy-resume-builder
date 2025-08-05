'use client';

import type React from 'react';
import { createContext, useContext } from 'react';
import { useResumePersistence } from '../../hooks/use-resume-persistence';

type TSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type TSaveStatusContext = {
  saveStatus: TSaveStatus;
  manualSave: () => void;
  lastSavedAt: Date | null;
};

type TProps = {
  children: React.ReactNode;
  throttleMs?: number;
};

const SaveStatusContext = createContext<TSaveStatusContext | null>(null);

export function SaveStatusProvider({ children, throttleMs }: TProps) {
  const { saveStatus, manualSave, lastSavedAt } = useResumePersistence({ throttleMs });

  return (
    <SaveStatusContext.Provider value={{ saveStatus, manualSave, lastSavedAt }}>
      {children}
    </SaveStatusContext.Provider>
  );
}

export function useSaveStatus() {
  const context = useContext(SaveStatusContext);
  
  if (!context) {
    throw new Error('useSaveStatus must be used within a SaveStatusProvider');
  }
  
  return context;
}
