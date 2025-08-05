'use client';

import { Provider as JotaiProvider } from 'jotai/react';
import type React from 'react';
import { Toaster } from 'sonner';
import { WelcomeModalProvider } from '../../features/welcome/components/welcome-provider';
import { MotionPreferencesProvider } from './motion-preferences-provider';
import { SaveStatusProvider } from './save-status-provider';
import { ThemeProvider } from './theme-provider';

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
