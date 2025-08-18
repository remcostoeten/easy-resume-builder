import type React from 'react';
import { cn } from 'utilities';

type TProps = {
  mode?: 'parent' | 'screen' | 'absolute' | 'fixed';
  axis?: 'both' | 'x' | 'y';
  strategy?: 'grid' | 'flex';
  className?: string;
  children: React.ReactNode;
};

function buildDisplayAndAxisClasses(strategy: 'grid' | 'flex', axis: 'both' | 'x' | 'y'): string {
  if (strategy === 'grid') {
    if (axis === 'both') return 'grid place-items-center';
    if (axis === 'x') return 'grid justify-center';
    return 'grid items-center';
  }
  if (axis === 'both') return 'flex items-center justify-center';
  if (axis === 'x') return 'flex justify-center';
  return 'flex items-center';
}

function buildModeClasses(mode: 'parent' | 'screen' | 'absolute' | 'fixed'): string {
  if (mode === 'screen') return 'min-h-screen w-screen';
  if (mode === 'absolute') return 'absolute inset-0';
  if (mode === 'fixed') return 'fixed inset-0 z-[60] pointer-events-none [&_*]:pointer-events-auto';
  return '';
}

export function Center({ children, className, mode = 'parent', axis = 'both', strategy = 'grid' }: TProps) {
  const displayAndAxis = buildDisplayAndAxisClasses(strategy, axis);
  const position = buildModeClasses(mode);
  return <div className={cn(displayAndAxis, position, className)}>{children}</div>;
}

