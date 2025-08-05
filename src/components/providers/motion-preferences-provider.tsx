'use client';

import type React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { usePrefersReducedMotion } from '../../hooks/use-prefers-reduced-motion';

type TMotionPreferencesContext = {
	prefersReducedMotion: boolean;
};

const MotionPreferencesContext = createContext<TMotionPreferencesContext | undefined>(undefined);

type TProps = {
	children: React.ReactNode;
};

export function MotionPreferencesProvider({ children }: TProps) {
	const prefersReducedMotion = usePrefersReducedMotion();

	const contextValue = useMemo(
		() => ({
			prefersReducedMotion,
		}),
		[prefersReducedMotion]
	);

	return (
		<MotionPreferencesContext.Provider value={contextValue}>
			{children}
		</MotionPreferencesContext.Provider>
	);
}

export function useMotionPreferences(): TMotionPreferencesContext {
	const context = useContext(MotionPreferencesContext);
	if (context === undefined) {
		throw new Error('useMotionPreferences must be used within a MotionPreferencesProvider');
	}
	return context;
}
