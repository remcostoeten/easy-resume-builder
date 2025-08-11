'use client';

import React from 'react';
import { cn } from '../../shared/utilities/cn';

type TStartPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

type TVariant = 'default' | 'circle' | 'circle-blur' | 'polygon' | 'gif';

type TProps = {
  theme: 'light' | 'dark';
  onClick: () => void;
  showLabel?: boolean;
  variant?: TVariant;
  start?: TStartPosition;
  url?: string;
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
  variant = 'default',
  start = 'top-left',
  url,
  className 
}: TProps): React.ReactElement {
  
  function getAnimationClasses(): string {
    switch (variant) {
      case 'circle':
        return 'relative overflow-hidden transition-colors duration-300';
      case 'circle-blur':
        return 'relative overflow-hidden transition-colors duration-300 backdrop-blur-sm';
      case 'polygon':
        return 'relative overflow-hidden transition-all duration-500 clip-polygon';
      case 'gif':
        return 'relative overflow-hidden';
      default:
        return 'transition-colors duration-200';
    }
  }

  function getStartPositionClasses(): string {
    if (variant !== 'circle' && variant !== 'circle-blur') return '';
    
    switch (start) {
      case 'top-right':
        return 'origin-top-right';
      case 'bottom-left':
        return 'origin-bottom-left';
      case 'bottom-right':
        return 'origin-bottom-right';
      case 'center':
        return 'origin-center';
      default:
        return 'origin-top-left';
    }
  }

  function renderContent(): React.ReactNode {
    if (variant === 'gif' && url) {
      return (
        <div className="w-full h-full rounded-lg overflow-hidden">
          <img 
            src={url} 
            alt="Theme toggle animation"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

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

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'relative w-16 h-16 rounded-lg border-2 border-border',
          'hover:shadow-md active:scale-95 transition-transform',
          'bg-background hover:bg-muted',
          getAnimationClasses(),
          getStartPositionClasses(),
          className
        )}
      >
        {renderContent()}
        
        {variant === 'circle' || variant === 'circle-blur' ? (
          <div className={cn(
            'absolute inset-0 w-full h-full rounded-lg scale-0 transition-transform duration-300',
            theme === 'light' ? 'bg-slate-900' : 'bg-yellow-400',
            'hover:scale-110'
          )} />
        ) : null}
      </button>
      
      {showLabel ? (
        <span className="text-xs text-muted-foreground capitalize">
          {theme} mode
        </span>
      ) : null}
    </div>
  );
}
