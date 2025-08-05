import { hasSeenWelcomeModal } from './has-seen-welcome-modal';
import { resetWelcomeModal } from './reset-welcome-modal';

/**
 * Force show the welcome modal (bypasses the seen check)
 * Useful for previewing the modal in development
 */
export function forceShowWelcomeModal(): void {
	resetWelcomeModal();
	// Dispatch a custom event that could be listened to
	window.dispatchEvent(new CustomEvent('force-show-welcome-modal'));
}

// Add to window for easy access in development console
if (typeof window !== 'undefined') {
	(window as any).welcomeModalDevUtils = {
		reset: resetWelcomeModal,
		hasSeenModal: hasSeenWelcomeModal,
		forceShow: forceShowWelcomeModal,
	};

	// Only log in development
	if (typeof window !== 'undefined') {
		console.log('Welcome Modal Dev Utils available at window.welcomeModalDevUtils');
		console.log('Commands: reset(), hasSeenModal(), forceShow()');
	}
}
