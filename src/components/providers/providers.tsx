'use client';

import type React from 'react';
import { ThemeProvider } from './theme-provider';
import { WelcomeModalProvider } from '../../features/welcome/components/welcome-provider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='dark'
		>
				<WelcomeModalProvider>
					<Toaster position='top-right' richColors/>
					
					{children}</WelcomeModalProvider>
		</ThemeProvider>
	);
}5
