'use client';

import { Provider as JotaiProvider } from 'jotai/react';
import { Profiler, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type React from 'react';
import { PerformanceMonitor } from '../../shared/components/performance-monitor';
import { SettingsProvider } from '../../contexts/settings-context';
import { ViewTransitionStyleProvider, useViewTransitionStyle } from '../../shared/contexts/view-transition-style';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { WelcomeModal } from '../../features/welcome/components/welcome-modal';
import { hasSeenWelcomeModal, setStorageOnClick } from '@/utils/storage';
import { AuthProvider } from '@/features/auth/providers/auth-provider';

type TProps = { children: React.ReactNode };

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

function VTStyleMirror() {
	const [style] = useViewTransitionStyle();
	useLayoutEffect(function sync() {
		if (typeof document === 'undefined') {
			return;
		}
		document.documentElement.dataset.vtStyle = style;
	}, [style]);
	return null;
}

function Welcome({ children }: TProps) {
	const [isVisible, setIsVisible] = useState(false);
	const previousActiveElementRef = useRef<Element | null>(null);

	useEffect(function checkStatus() {
		const hasSeen = hasSeenWelcomeModal();
		const shouldShow = !hasSeen;
		if (shouldShow) {
			previousActiveElementRef.current = document.activeElement;
		}
		setIsVisible(shouldShow);
	}, []);

	function onGetStarted() {
		setIsVisible(false);
	}

	function onClose() {
		setIsVisible(false);
	}

	function onExitComplete() {
		setStorageOnClick();
		setTimeout(function restoreFocus() {
			if (previousActiveElementRef.current instanceof HTMLElement) {
				previousActiveElementRef.current.focus();
			}
		}, 50);
	}

	function onGetStartedExitComplete() {
		onExitComplete();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	return (
		<>
			{children}
			{isVisible && (
				<WelcomeModal
					isOpen={isVisible}
					onClose={onClose}
					onGetStarted={onGetStarted}
					onExitComplete={onExitComplete}
					onGetStartedExitComplete={onGetStartedExitComplete}
				/>
			)}
		</>
	);
}

export function Providers({ children }: TProps) {
	if (process.env.NODE_ENV === 'development') {
	return (
		<JotaiProvider>
			<NextThemesProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange={false}>
				<AuthProvider>
					<SettingsProvider>
						<ViewTransitionStyleProvider>
							<Welcome>
								<Profiler id='App' onRender={onRenderCallback}>
									<PerformanceMonitor enabled />
									<VTStyleMirror />
									{children}
								</Profiler>
							</Welcome>
						</ViewTransitionStyleProvider>
					</SettingsProvider>
				</AuthProvider>
			</NextThemesProvider>
		</JotaiProvider>
	);
	}

	return (
		<JotaiProvider>
			<NextThemesProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange={false}>
				<AuthProvider>
					<SettingsProvider>
						<ViewTransitionStyleProvider>
							<Welcome>
								<VTStyleMirror />
								{children}
							</Welcome>
						</ViewTransitionStyleProvider>
					</SettingsProvider>
				</AuthProvider>
			</NextThemesProvider>
		</JotaiProvider>
	);
}
