'use client';

import React from 'react';

export type Mode = 'light' | 'dark' | 'system';

type TThemeStyles = {
  light?: Record<string, any>;
  dark?: Record<string, any>;
};

type TTheme = {
  styles?: TThemeStyles;
};

type TSettings = {
  mode: Mode;
  theme: TTheme;
};

type TSettingsContext = {
  settings: TSettings;
  updateSettings: (settings: TSettings) => void;
};

const defaultSettings: TSettings = {
  mode: 'system',
  theme: {
    styles: {
      light: {},
      dark: {}
    }
  }
};

const SettingsContext = React.createContext<TSettingsContext | undefined>(undefined);

type TProps = {
  children: React.ReactNode;
};

export function SettingsProvider({ children }: TProps): React.ReactElement {
  const [settings, setSettings] = React.useState<TSettings>(defaultSettings);

  React.useEffect(function initializeTheme() {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      const currentMode = isDark ? 'dark' : 'light';
      
      if (settings.mode !== currentMode) {
        setSettings(prev => ({
          ...prev,
          mode: currentMode as Mode
        }));
      }
    }
  }, []);

  function updateSettings(newSettings: TSettings): void {
    setSettings(newSettings);
  }

  const value: TSettingsContext = {
    settings,
    updateSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): TSettingsContext {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
