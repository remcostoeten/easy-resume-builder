import type React from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { hasSeenWelcomeModal, setStorageOnClick } from '@/utils/storage';

const WelcomeModal = lazy(() =>
	import('./welcome-modal').then((m) => ({ default: m.WelcomeModal }))
);

type TProps = {
	children: React.ReactNode;
};

/**
 * Wrapper component that automatically handles welcome modal state
 * Drop this into any app to add welcome modal functionality
 */
export function WelcomeModalProvider({ children }: TProps) {
	const [isVisible, setIsVisible] = useState(false);

	// Check if user has seen the welcome modal on mount
	useEffect(() => {
		const hasSeen = hasSeenWelcomeModal();
		setIsVisible(!hasSeen);
	}, []);

	function handleGetStarted() {
		setStorageOnClick(); // Mark as seen in localStorage

		setIsVisible(false);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleClose() {
		setStorageOnClick(); // Mark as seen when closed
		setIsVisible(false);
	}

	return (
		<>
			{children}
			{isVisible && (
				<Suspense fallback={null}>
					<WelcomeModal
						isOpen={isVisible}
						onClose={handleClose}
						onGetStarted={handleGetStarted}
					/>
				</Suspense>
			)}
		</>
	);
}
