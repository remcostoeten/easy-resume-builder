import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WelcomeModalProvider } from '../welcome-provider';
import * as storage from '@/utils/storage';

vi.mock('@/utils/storage', () => ({
	hasSeenWelcomeModal: vi.fn(),
	setStorageOnClick: vi.fn(),
	setStorageOnBlur: vi.fn(),
	markWelcomeModalAsSeen: vi.fn(),
	resetWelcomeModal: vi.fn(),
	forceShowWelcomeModal: vi.fn(),
}));

vi.mock('@/utils/storage/welcome-storage', () => ({
	hasSeenWelcomeModal: vi.fn(),
	setStorageOnClick: vi.fn(),
}));

function mockEnvironment() {
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

	Object.defineProperty(window, 'open', {
		value: vi.fn(),
		writable: true,
	});

	Object.defineProperty(window, 'scrollTo', {
		value: vi.fn(),
		writable: true,
	});
}

function TestApp() {
	return (
		<div>
			<button data-testid="page-button">Page Button</button>
			<WelcomeModalProvider>
				<div>App Content</div>
			</WelcomeModalProvider>
		</div>
	);
}

describe('WelcomeModal Integration Tests', () => {
	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		user = userEvent.setup();
		vi.clearAllMocks();
		mockEnvironment();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	describe('Focus Management Requirements', () => {
		it('should trap focus within the modal', async () => {
			vi.mocked(storage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestApp />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const getStartedButton = screen.getByText('Start Building Now');
			const registerButton = screen.getByLabelText('Create a new account');
			const loginButton = screen.getByLabelText('Sign in to your account');
			const closeButton = screen.getByLabelText('Close welcome modal');

			await waitFor(() => {
				expect(getStartedButton).toHaveFocus();
			});

			await user.tab();
			expect([registerButton, loginButton, closeButton]).toContain(document.activeElement);

			let currentElement = document.activeElement;
			for (let i = 0; i < 10; i++) {
				await user.tab();
				const newElement = document.activeElement;
				expect([getStartedButton, registerButton, loginButton, closeButton]).toContain(newElement);
				if (newElement === currentElement) break;
				currentElement = newElement;
			}
		});

		it('should focus the first button when modal opens', async () => {
			vi.mocked(storage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestApp />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const firstButton = screen.getByText('Start Building Now');
			await waitFor(() => {
				expect(firstButton).toHaveFocus();
			});
		});
	});

	describe('Keyboard Navigation Requirements', () => {
		it('should close modal and restore focus when Escape is pressed', async () => {
			vi.mocked(storage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestApp />);

			const pageButton = screen.getByTestId('page-button');
			pageButton.focus();

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			await user.keyboard('{Escape}');

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});

			await waitFor(() => {
				expect(pageButton).toHaveFocus();
			}, { timeout: 100 });
		});
	});

	describe('Storage Integration Requirements', () => {
		it('should toggle storage flag when get-started is clicked', async () => {
			vi.mocked(storage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestApp />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});

			const getStartedButton = screen.getByText('Start Building Now');
			await user.click(getStartedButton);

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});

			await waitFor(() => {
				expect(storage.setStorageOnClick).toHaveBeenCalledTimes(1);
			});
		});

		it('should not show modal when storage flag indicates user has seen it', () => {
			vi.mocked(storage.hasSeenWelcomeModal).mockReturnValue(true);

			render(<TestApp />);

			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			expect(screen.getByText('App Content')).toBeInTheDocument();
		});

		it('should show modal when storage flag indicates user has not seen it', async () => {
			vi.mocked(storage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestApp />);

			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeInTheDocument();
			});
		});
	});

	describe('Complete User Journey', () => {
		it('should handle the complete onboarding flow', async () => {
			vi.mocked(storage.hasSeenWelcomeModal).mockReturnValue(false);

			render(<TestApp />);

			const pageButton = screen.getByTestId('page-button');
			pageButton.focus();

			expect(screen.getByRole('dialog')).toBeInTheDocument();

			const firstButton = screen.getByText('Start Building Now');
			await waitFor(() => {
				expect(firstButton).toHaveFocus();
			});

			await user.tab();
			await user.tab();
			await user.tab();
			
			expect(document.activeElement).toBeTruthy();
			expect([
				screen.getByText('Start Building Now'),
				screen.getByLabelText('Create a new account'),
				screen.getByLabelText('Sign in to your account'),
				screen.getByLabelText('Close welcome modal'),
			]).toContain(document.activeElement);

			await user.click(firstButton);

			await waitFor(() => {
				expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
			});

			expect(storage.setStorageOnClick).toHaveBeenCalled();

			await waitFor(() => {
				expect(pageButton).toHaveFocus();
			}, { timeout: 100 });
		});
	});
});
