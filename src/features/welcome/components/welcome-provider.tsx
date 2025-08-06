import type React from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { hasSeenWelcomeModal, setStorageOnClick } from '@/utils/storage';

function importWelcomeModal() {
	return import('./welcome-modal').then(function handleImport(m) {
		return { default: m.WelcomeModal };
	});
}

const WelcomeModal = lazy(importWelcomeModal);

type TProps = {
	children: React.ReactNode;
};

export function WelcomeModalProvider({ children }: TProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(function checkWelcomeModalStatus() {
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
