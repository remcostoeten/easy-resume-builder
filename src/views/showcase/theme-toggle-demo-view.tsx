'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { ThemeToggleButton, useThemeTransition } from '../../components/showcase/theme-toggle-button';

type TProps = {};

export function ThemeToggleDemoView({}: TProps): React.ReactElement {
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
            variant="gif"
            url="https://media.giphy.com/media/KBbr4hHl9DSahKvInO/giphy.gif?cid=790b76112m5eeeydoe7et0cr3j3ekb1erunxozyshuhxx2vl&ep=v1_stickers_search&rid=giphy.gif&ct=s"
          />
          
          <ThemeToggleButton
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel
            variant="gif"
            url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
          />
          
          <ThemeToggleButton
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel
            variant="gif"
            url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3JwcXdzcHd5MW92NWprZXVpcTBtNXM5cG9obWh0N3I4NzFpaDE3byZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/WgsVx6C4N8tjy/giphy.gif"
          />
          
          <ThemeToggleButton
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel
            variant="gif"
            url="https://media.giphy.com/media/ArfrRmFCzYXsC6etQX/giphy.gif?cid=ecf05e47kn81xmnuc9vd5g6p5xyjt14zzd3dzwso6iwgpvy3&ep=v1_stickers_search&rid=giphy.gif&ct=s"
          />

          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
          />
          
          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            variant="circle-blur" 
            start="top-right" 
          />
          
          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            variant="circle-blur" 
            start="bottom-left" 
          />
          
          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            variant="circle-blur" 
            start="bottom-right" 
          />

          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            variant="circle" 
            start="top-left" 
          />
          
          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            variant="circle" 
            start="top-right" 
          />
          
          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            variant="circle" 
            start="bottom-left" 
          />
          
          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            variant="circle" 
            start="bottom-right" 
          />

          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            variant="circle" 
            start="center" 
          />
          
          <ThemeToggleButton 
            theme={currentTheme}
            onClick={handleThemeToggle}
            showLabel 
            variant="polygon" 
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
