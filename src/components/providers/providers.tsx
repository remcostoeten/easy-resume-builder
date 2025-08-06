'use client';

import { Provider as JotaiProvider } from 'jotai/react';
import type React from 'react';
import { Toaster } from 'sonner';
import { WelcomeModalProvider } from '../../features/welcome/components/welcome-provider';

import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<JotaiProvider>
			<ThemeProvider attribute='class' defaultTheme='dark'>
				<WelcomeModalProvider>
					<Toaster position='top-right' richColors />
					{children}
				</WelcomeModalProvider>
			</ThemeProvider>
		</JotaiProvider>
	);
}
