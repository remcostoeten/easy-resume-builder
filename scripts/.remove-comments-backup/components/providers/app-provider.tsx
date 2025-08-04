'use client';

import type React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { WelcomeModalProvider } from '@/features/welcome/components/welcome-provider';

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
