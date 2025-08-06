import { forceShowWelcomeModal, hasSeenWelcomeModal, resetWelcomeModal } from '@/utils/storage';

// Re-export the main function
export { forceShowWelcomeModal };

// Add to window for easy access in development console
if (typeof window !== 'undefined') {
	(window as any).welcomeModalDevUtils = {
		forceShow: forceShowWelcomeModal,
		reset: resetWelcomeModal,
		hasSeenModal: hasSeenWelcomeModal,
	};

	// Only log in development
	if (process.env.NODE_ENV === 'development') {
		console.log('Welcome Modal Dev Utils available at window.welcomeModalDevUtils');
		console.log('Commands: forceShow(), reset(), hasSeenModal()');
	}
}
