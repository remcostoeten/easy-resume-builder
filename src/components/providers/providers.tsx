'use client';

import type React from 'react';
import { ThemeProvider } from './theme-provider';
import { WelcomeModalProvider } from '../../features/welcome/components/welcome-provider';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='dark'
		>
				<WelcomeModalProvider>{children}</WelcomeModalProvider>
		</ThemeProvider>
	);
}5
