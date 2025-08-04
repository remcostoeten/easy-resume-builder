import { useWelcomeModal } from '../hooks/use-welcome-modal';
import { WelcomeModal } from './welcome-modal';
import type React from 'react';

type TProps = {
	children: React.ReactNode;
};

/**
 * Wrapper component that automatically handles welcome modal state
 * Drop this into any app to add welcome modal functionality
 */
export function WelcomeModalProvider({ children }: TProps) {
	const { isVisible, markAsSeen } = useWelcomeModal();

	function handleGetStarted() {
		markAsSeen();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleClose() {
		markAsSeen();
	}

	return (
		<>
			{children}
			<WelcomeModal
				isOpen={isVisible}
				onClose={handleClose}
				onGetStarted={handleGetStarted}
			/>
		</>
	);
}
