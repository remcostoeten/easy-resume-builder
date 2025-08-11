'use client';

import React from 'react';
import { cn } from '@/shared/utilities/cn';

type TDirection = 'right-to-left' | 'left-to-right';

type TProps = {
  theme: 'light' | 'dark';
  onClick: () => void;
  showLabel?: boolean;
  direction?: TDirection;
  className?: string;
};

export function useThemeTransition() {
  function startTransition(callback: () => void): void {
    React.startTransition(callback);
  }
  
  return { startTransition };
}

export function ThemeToggleButton({ 
  theme, 
  onClick, 
  showLabel = false,
  direction = 'right-to-left',
  className 
}: TProps): React.ReactElement {
  
  function getTransitionClasses(): string {
    return 'relative overflow-hidden transition-all duration-300';
  }

  function renderContent(): React.ReactNode {
    return (
      <div className="flex items-center justify-center">
        <div className={cn(
          'w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center text-lg',
          theme === 'light' 
            ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/30' 
            : 'bg-slate-800 text-slate-100 shadow-lg shadow-slate-800/30',
          'border-2 border-current/20'
        )}>
          {theme === 'light' ? '☀️' : '🌙'}
        </div>
      </div>
    );
  }

  const [isTransitioning, setIsTransitioning] = React.useState(false);

  function handleClick(): void {
    setIsTransitioning(true);
    
    setTimeout(() => {
      onClick();
      setIsTransitioning(false);
    }, 150);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'group relative w-16 h-16 rounded-lg border-2 border-border',
          'hover:shadow-md active:scale-95 transition-transform',
          'bg-background hover:bg-muted overflow-hidden',
          getTransitionClasses(),
          className
        )}
      >
        <div className={cn(
          'relative z-10 transition-opacity duration-300',
          isTransitioning && 'opacity-0'
        )}>
          {renderContent()}
        </div>
        
        <div className={cn(
          'absolute inset-0 w-full h-full rounded-lg transition-all duration-300 ease-in-out',
          theme === 'light' ? 'bg-slate-900' : 'bg-yellow-400',
          direction === 'right-to-left' ? 'translate-x-full' : '-translate-x-full',
          isTransitioning && 'translate-x-0',
          'opacity-90'
        )} />
      </button>
      
      {showLabel ? (
        <span className="text-xs text-muted-foreground capitalize">
          {direction === 'right-to-left' ? 'Right → Left' : 'Left → Right'}
        </span>
      ) : null}
    </div>
  );
}
