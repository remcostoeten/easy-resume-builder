import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'has_seen_popup';

type TProps = {
	isVisible: boolean;
	hasSeenBefore: boolean;
};

export type TModalState = TProps;
export type TModalActions = {
	showModal: () => void;
	hideModal: () => void;
	markAsSeen: () => void;
	resetSeen: () => void;
};

export type TWelcomeModal = TModalState & TModalActions;

/**
 * Custom hook to manage welcome modal visibility and persistence
 * Automatically shows modal on first visit and remembers user preference
 */
export function useWelcomeModal(): TWelcomeModal {
	const [isVisible, setIsVisible] = useState(false);
	const [hasSeenBefore, setHasSeenBefore] = useState(false);

	// Initialize state from localStorage on mount
	useEffect(() => {
		try {
			const hasSeenPopup = localStorage.getItem(STORAGE_KEY) === 'true';
			setHasSeenBefore(hasSeenPopup);

			// Show modal if user hasn't seen it before
			if (!hasSeenPopup) {
				// Longer delay to ensure all components are loaded and page is stable
				const timer = setTimeout(() => {
					setIsVisible(true);
				}, 1000);

				return () => clearTimeout(timer);
			}
		} catch (_error) {
			// Fallback if localStorage is not available - don't show modal by default
			console.warn('localStorage not available, welcome modal disabled');
			setHasSeenBefore(true); // Treat as seen to avoid showing every time
		}
	}, []);

	const showModal = useCallback(() => {
		setIsVisible(true);
	}, []);

	const hideModal = useCallback(() => {
		setIsVisible(false);
	}, []);

	const markAsSeen = useCallback(() => {
		try {
			localStorage.setItem(STORAGE_KEY, 'true');
			setHasSeenBefore(true);
			setIsVisible(false);
		} catch (_error) {
			console.warn('Could not save welcome modal state to localStorage');
			setIsVisible(false);
		}
	}, []);

	const resetSeen = useCallback(() => {
		try {
			localStorage.removeItem(STORAGE_KEY);
			setHasSeenBefore(false);
		} catch (_error) {
			console.warn('Could not reset welcome modal state in localStorage');
		}
	}, []);

	return {
		isVisible,
		hasSeenBefore,
		showModal,
		hideModal,
		markAsSeen,
		resetSeen,
	};
}
