import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WelcomeModalProvider } from '../welcome-provider';
import * as welcomeStorage from '@/utils/storage/welcome-storage';

vi.mock('@/utils/storage/welcome-storage', () => ({
	hasSeenWelcomeModal: vi.fn(),
	setStorageOnClick: vi.fn(),
}));

function TestComponent() {
	return (
		<div>
			<button data-testid="existing-button">Existing Button</button>
			<WelcomeModalProvider>
				<div data-testid="child-content">Child Content</div>
			</WelcomeModalProvider>
		</div>
	);
}

function mockStorage() {
	const storage = new Map();
	Object.defineProperty(window, 'localStorage', {
		value: {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => storage.set(key, value),
			removeItem: (key: string) => storage.delete(key),
			clear: () => storage.clear(),
		},
		writable: true,
	});
	return storage;
}

describe('WelcomeModalProvider', () => {
	let user: ReturnType<typeof userEvent.setup>;
	let mockActiveElement: HTMLElement;

	beforeEach(() => {
		user = userEvent.setup();
		vi.clearAllMocks();
		mockStorage();

		Object.defineProperty(window, 'open', {
			value: vi.fn(),
			writable: true,
		});

		Object.defineProperty(window, 'scrollTo', {
			value: vi.fn(),
			writable: true,
		});
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	describe('Storage Integration', () => {
		it('should not show modal when user has already seen it', () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(true);

			render(<TestComponent />);

			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			expect(screen.getByTestId('child-content')).toBeInTheDocument();
		});

		it('should show modal when user has not seen it', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});
			expect(screen.getByTestId('child-content')).toBeInTheDocument();
		});

		it('should toggle storage flag when get-started is clicked', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const getStartedButton = screen.getByText('Start Building Now');
			await user.click(getStartedButton);

			await waitFor(() => {
				expect(welcomeStorage.setStorageOnClick).toHaveBeenCalledTimes(1);
			});
		});

		it('should mark modal as seen when closed normally', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const closeButton = screen.getByLabelText('Close welcome modal');
			await user.click(closeButton);

			await waitFor(() => {
				expect(welcomeStorage.setStorageOnClick).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('Focus Restoration', () => {
		it('should capture and restore focus after modal closes', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			const existingButton = screen.getByTestId('existing-button');
			existingButton.focus();
			expect(existingButton).toHaveFocus();

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const firstButton = screen.getByText('Start Building Now');
			await waitFor(() => {
				expect(firstButton).toHaveFocus();
			});

			const closeButton = screen.getByLabelText('Close welcome modal');
			await user.click(closeButton);

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});

			await waitFor(() => {
				expect(existingButton).toHaveFocus();
			}, { timeout: 100 });
		});

		it('should restore focus after get-started is clicked', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			const existingButton = screen.getByTestId('existing-button');
			existingButton.focus();

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const getStartedButton = screen.getByText('Start Building Now');
			await user.click(getStartedButton);

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});

			await waitFor(() => {
				expect(existingButton).toHaveFocus();
			}, { timeout: 100 });
		});

		it('should scroll to top when get-started is clicked', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const getStartedButton = screen.getByText('Start Building Now');
			await user.click(getStartedButton);

			await waitFor(() => {
				expect(window.scrollTo).toHaveBeenCalledWith({
					top: 0,
					behavior: 'smooth',
				});
			});
		});

		it('should not scroll to top when modal is closed normally', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const closeButton = screen.getByLabelText('Close welcome modal');
			await user.click(closeButton);

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});

			expect(window.scrollTo).not.toHaveBeenCalled();
		});

		it('should handle missing activeElement gracefully', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			Object.defineProperty(document, 'activeElement', {
				value: null,
				configurable: true,
			});

			const { container } = render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const closeButton = screen.getByLabelText('Close welcome modal');
			await user.click(closeButton);

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});

			expect(() => container).not.toThrow();
		});
	});

	describe('Modal State Management', () => {
		it('should hide modal when close is called', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			await user.keyboard('{Escape}');

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});
		});

		it('should hide modal when get-started is called', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const getStartedButton = screen.getByText('Start Building Now');
			await user.click(getStartedButton);

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});
		});

		it('should always render children regardless of modal state', () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(true);

			render(<TestComponent />);

			expect(screen.getByTestId('child-content')).toBeInTheDocument();
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	describe('Escape Key Behavior', () => {
		it('should close modal and restore focus when Escape is pressed', async () => {
			vi.mocked(welcomeStorage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestComponent />);

			const existingButton = screen.getByTestId('existing-button');
			existingButton.focus();

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			await user.keyboard('{Escape}');

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});

			await waitFor(() => {
				expect(welcomeStorage.setStorageOnClick).toHaveBeenCalledTimes(1);
			});

			await waitFor(() => {
				expect(existingButton).toHaveFocus();
			}, { timeout: 100 });
		});
	});
});
