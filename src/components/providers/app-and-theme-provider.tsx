'use client';

import type React from 'react';
import { WelcomeModalProvider } from '@/src/features/welcome/components/welcome-provider';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'
			enableSystem
			disableTransitionOnChange
		>
			<WelcomeModalProvider>{children}</WelcomeModalProvider>
		</ThemeProvider>
	);
}
