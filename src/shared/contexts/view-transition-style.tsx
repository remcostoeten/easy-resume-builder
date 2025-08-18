'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
export const styles = ['crossfade', 'morph', 'ease-slow'] as const;

type TStyle = (typeof styles)[number];

type TAction = { type: 'set'; payload: TStyle } | { type: 'next' };

type TContext = [TStyle, Dispatch<TAction>];

const Ctx = createContext<TContext | undefined>(undefined);

function nextStyle(current: TStyle): TStyle {
  const idx = styles.indexOf(current);
  const nextIdx = (idx + 1) % styles.length;
  return styles[nextIdx];
}

function reducer(state: TStyle, action: TAction): TStyle {
  if (action.type === 'set') {
    return action.payload;
  }
  if (action.type === 'next') {
    return nextStyle(state);
  }
  return state;
}

function init(initial: TStyle): TStyle {
  if (typeof window === 'undefined') {
    return initial;
  }
  try {
    const stored = window.localStorage.getItem('view-transition-style');
    if (stored && (styles as readonly string[]).includes(stored)) {
      return stored as TStyle;
    }
  } catch {}
  return initial;
}

type TProps = { children: ReactNode };

export function ViewTransitionStyleProvider({ children }: TProps) {
  const [style, dispatch] = useReducer(reducer, 'crossfade', init);

  useEffect(save(style), [style]);

  const value = useMemo(provide(style, dispatch), [style, dispatch]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function save(style: TStyle) {
  return function run() {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem('view-transition-style', style);
    } catch {}
  };
}

function provide(style: TStyle, dispatch: Dispatch<TAction>) {
  return function value(): TContext {
    return [style, dispatch];
  };
}

export function useViewTransitionStyle(): TContext {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useViewTransitionStyle must be used within ViewTransitionStyleProvider');
  }
  return ctx;
}

