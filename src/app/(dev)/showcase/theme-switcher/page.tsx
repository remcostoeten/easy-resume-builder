'use client';

import React from 'react';

export default function ThemeSwitcherShowcase() {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Theme Switcher with Reducer</h1>
          <p className="text-muted-foreground">
            Theme switcher using useReducer with smooth transitions
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-semibold">ThemeSwitcher Component</h2>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-lg font-semibold">HeaderThemeToggle Component</h2>
          </div>
        </div>

        <div className="mt-12 p-6 border rounded-lg space-y-4">
          <h3 className="font-semibold">Implementation Details:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Uses useReducer with themeReducer for state management</li>
            <li>Implements smooth theme transition with temporary CSS class</li>
            <li>Applies theme-transition class for 75ms to prevent flash</li>
            <li>Uses requestAnimationFrame for smooth DOM updates</li>
            <li>All DOM manipulation wrapped in applyTransitionHack function</li>
            <li>Fully functional style with named functions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
