'use client';

import { useKeyboardShortcut } from '@/hooks';
import Link from 'next/link';
import React from 'react';

type TProps = {};

export function DevRouteNav({}: TProps): React.ReactElement {
  const [state, setState] = React.useState<{ open: boolean; routes: string[] }>({ open: false, routes: [] });

  const handleToggle = React.useCallback(function handleToggle(): void {
    setState((prevState) => ({ ...prevState, open: !prevState.open }));
  }, []);


  async function loadRoutes(): Promise<void> {
    try {
      const res = await fetch('/api/dev/routes', { cache: 'no-store' });
      const data = await res.json();
      const list: string[] = Array.isArray(data.routes) ? data.routes : [];
      setState((prevState) => ({ ...prevState, routes: list }));
    } catch {
      setState((prevState) => ({ ...prevState, routes: [] }));
    }
  }

  function onEffect(): void {
    if (process.env.NODE_ENV === 'development') {
      void loadRoutes();
    }
  }

  React.useEffect(onEffect, []);

  useKeyboardShortcut({
    shortcut: { key: '/', shift: true },
    callback: handleToggle,
  });

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      <div className="flex flex-col items-end gap-2">
        {state.open ? (
          <div className="max-h-[60vh] w-64 overflow-auto rounded-lg border border-border bg-background/95 p-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/75">
            <div className="mb-2 text-sm font-semibold">Routes</div>
            <ul className="space-y-1 text-sm">
              {state.routes
                .filter(function filterStaticRoutes(route) {
                  return !route.includes('[') && !route.includes(']');
                })
                .map(function renderItem(route) {
                  return (
                    <li key={route}>
                      <Link className="block rounded px-2 py-1 hover:bg-muted" href={route}>
                        {route}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : null}
        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow hover:opacity-90"
        >
          <span>{state.open ? 'Close' : 'Routes'}</span>
          {!state.open && (
            <kbd className="ml-2 rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Shift+/
            </kbd>
          )}
        </button>
      </div>
    </div>
  );
}
