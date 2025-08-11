'use client';

import { Provider as JotaiProvider } from 'jotai/react';
import type React from 'react';
import { Toaster } from 'sonner';
import { WelcomeModalProvider } from '../../features/welcome/components/welcome-provider';
import { SettingsProvider } from '../../contexts/settings-context';

import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<JotaiProvider>
			<ThemeProvider attribute='class' defaultTheme='dark'>
				<SettingsProvider>
					<WelcomeModalProvider>
						<Toaster position='top-right' />
						{children}
					</WelcomeModalProvider>
				</SettingsProvider>
			</ThemeProvider>
		</JotaiProvider>
	);
}
