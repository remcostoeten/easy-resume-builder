'use client';

import { Provider as JotaiProvider } from 'jotai/react';
import { Profiler } from 'react';
import type React from 'react';
import { Toaster } from 'sonner';
import { PerformanceMonitor } from '../../shared/components/performance-monitor';
import { WelcomeModalProvider } from '../../features/welcome/components/welcome-provider';
import { SettingsProvider } from '../../contexts/settings-context';

import { ThemeProvider } from './theme-provider';

function onRenderCallback(
	id: string,
	phase: 'mount' | 'update' | 'nested-update',
	actualDuration: number,
	baseDuration: number,
	startTime: number,
	commitTime: number
) {
	console.log(
		`🔬 Profiler: ${id} (${phase}) took ${actualDuration.toFixed(2)}ms (baseline: ${baseDuration.toFixed(2)}ms)`
	);
}

export function Providers({ children }: { children: React.ReactNode }) {
	if (process.env.NODE_ENV === 'development') {
		return (
			<JotaiProvider>
				<ThemeProvider attribute='class' defaultTheme='dark'>
					<SettingsProvider>
						<WelcomeModalProvider>
							<Profiler id='App' onRender={onRenderCallback}>
								<PerformanceMonitor enabled />
								<Toaster position='top-right' />
								{children}
							</Profiler>
						</WelcomeModalProvider>
					</SettingsProvider>
				</ThemeProvider>
			</JotaiProvider>
		);
	}

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
