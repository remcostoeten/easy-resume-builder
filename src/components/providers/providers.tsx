'use client';

import type React from 'react';
import { Provider as JotaiProvider } from 'jotai/react';
import { ThemeProvider } from './theme-provider';
import { WelcomeModalProvider } from '../../features/welcome/components/welcome-provider';
import { SaveStatusProvider } from './save-status-provider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<JotaiProvider>
			<ThemeProvider attribute='class' defaultTheme='dark'>
				<SaveStatusProvider>
					<WelcomeModalProvider>
						<Toaster position='top-right' richColors />
						{children}
					</WelcomeModalProvider>
				</SaveStatusProvider>
			</ThemeProvider>
		</JotaiProvider>
	);
}
