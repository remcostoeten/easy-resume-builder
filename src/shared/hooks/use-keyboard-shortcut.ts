'use client';

import React from 'react';

type TShortcutKey = {
  key: string;
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
};

type TProps = {
  shortcut: TShortcutKey;
  callback: () => void;
  preventDefault?: boolean;
};

export function useKeyboardShortcut({ shortcut, callback, preventDefault = true }: TProps): void {
  React.useEffect(function setupKeyboardListener() {
    function handleKeyDown(event: KeyboardEvent): void {
      const matches = 
        event.key === shortcut.key &&
        (shortcut.shift === undefined || event.shiftKey === shortcut.shift) &&
        (shortcut.ctrl === undefined || event.ctrlKey === shortcut.ctrl) &&
        (shortcut.alt === undefined || event.altKey === shortcut.alt) &&
        (shortcut.meta === undefined || event.metaKey === shortcut.meta);

      if (matches) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcut, callback, preventDefault]);
}
