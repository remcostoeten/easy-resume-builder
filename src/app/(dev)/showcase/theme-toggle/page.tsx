'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { ThemeToggleButton, useThemeTransition } from '@/app/(dev)/showcase/_components';

type TProps = {};

function ThemeToggleView({}: TProps): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(function handleMount() {
    setMounted(true);
  }, []);

  function handleThemeToggle(): void {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    startTransition(function updateTheme() {
      setTheme(newTheme);
    });
  }

  if (!mounted) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const currentTheme = (theme === 'dark' || theme === 'light') ? theme : 'light';

  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Theme Toggle Animations</h1>
          <p className="text-muted-foreground">
            Various animated theme toggle button styles and effects
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            direction="right-to-left"
          />
          
          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            direction="left-to-right"
          />
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Current theme: <span className="font-semibold capitalize">{currentTheme}</span>
          </p>
          <p className="text-xs text-muted-foreground opacity-60">
            next-themes: {theme} | mounted: {mounted.toString()}
          </p>
          <button
            type="button"
            onClick={handleThemeToggle}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Toggle Theme (Debug)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ThemeTogglePage() {
  return <ThemeToggleView />;
}
