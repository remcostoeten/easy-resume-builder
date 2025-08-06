import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { hasSeenWelcomeModal, setStorageOnClick } from '@/utils/storage';
import { WelcomeModal } from './welcome-modal';

type TProps = {
	children: React.ReactNode;
};

export function WelcomeModalProvider({ children }: TProps) {
	const [isVisible, setIsVisible] = useState(false);
	const previousActiveElementRef = useRef<Element | null>(null);

	useEffect(function checkWelcomeModalStatus() {
		const hasSeen = hasSeenWelcomeModal();
		const shouldShow = !hasSeen;
		
		if (shouldShow) {
			previousActiveElementRef.current = document.activeElement;
		}
		
		setIsVisible(shouldShow);
	}, []);

	function handleGetStarted() {
		setIsVisible(false);
	}

	function handleClose() {
		setIsVisible(false);
	}

	function handleExitComplete() {
		setStorageOnClick();
		
		setTimeout(function restoreFocus() {
			if (previousActiveElementRef.current instanceof HTMLElement) {
				previousActiveElementRef.current.focus();
			}
		}, 50);
	}

	function handleGetStartedExitComplete() {
		handleExitComplete();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	return (
		<>
			{children}
			{isVisible && (
				<WelcomeModal
					isOpen={isVisible}
					onClose={handleClose}
					onGetStarted={handleGetStarted}
					onExitComplete={handleExitComplete}
					onGetStartedExitComplete={handleGetStartedExitComplete}
				/>
			)}
		</>
	);
}
