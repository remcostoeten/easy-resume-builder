import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WelcomeModal } from '../welcome-modal';

vi.mock('@/utils/storage', () => ({
	setStorageOnBlur: vi.fn(),
}));

const mockOnClose = vi.fn();
const mockOnGetStarted = vi.fn();
const mockOnExitComplete = vi.fn();
const mockOnGetStartedExitComplete = vi.fn();

function createMockProps(overrides = {}) {
	return {
		isOpen: true,
		onClose: mockOnClose,
		onGetStarted: mockOnGetStarted,
		onExitComplete: mockOnExitComplete,
		onGetStartedExitComplete: mockOnGetStartedExitComplete,
		...overrides,
	};
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

describe('WelcomeModal', () => {
	let user: ReturnType<typeof userEvent.setup>;
	let mockActiveElement: HTMLElement;

	beforeEach(() => {
		user = userEvent.setup();
		mockActiveElement = document.createElement('button');
		document.body.appendChild(mockActiveElement);
		mockActiveElement.focus();
		
		vi.clearAllMocks();
		mockStorage();
		
		Object.defineProperty(window, 'open', {
			value: vi.fn(),
			writable: true,
		});
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	describe('Focus Management', () => {
		it('should trap focus within the modal', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const modal = screen.getByRole('dialog');
			expect(modal).toBeInTheDocument();
			
			const firstButton = screen.getByText('Start Building Now');
			const registerButton = screen.getByLabelText('Create a new account');
			const loginButton = screen.getByLabelText('Sign in to your account');
			const closeButton = screen.getByLabelText('Close welcome modal');
			
			await waitFor(() => {
				expect(firstButton).toHaveFocus();
			});

			await user.tab();
			expect(registerButton).toHaveFocus();
			
			await user.tab();
			expect(loginButton).toHaveFocus();
			
			await user.tab();
			expect(closeButton).toHaveFocus();
			
			await user.tab();
			expect(firstButton).toHaveFocus();
		});

		it('should focus the first button when modal opens', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const firstButton = screen.getByText('Start Building Now');
			
			await waitFor(() => {
				expect(firstButton).toHaveFocus();
			});
		});

		it('should handle reverse tab navigation', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const firstButton = screen.getByText('Start Building Now');
			const closeButton = screen.getByLabelText('Close welcome modal');
			
			await waitFor(() => {
				expect(firstButton).toHaveFocus();
			});

			await user.tab({ shift: true });
			expect(closeButton).toHaveFocus();
			
			await user.tab({ shift: true });
			expect(screen.getByLabelText('Sign in to your account')).toHaveFocus();
		});
	});

	describe('Keyboard Navigation', () => {
		it('should close modal and call onClose when Escape is pressed', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			await user.keyboard('{Escape}');
			
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('should handle arrow key navigation between auth buttons', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const registerButton = screen.getByLabelText('Create a new account');
			const loginButton = screen.getByLabelText('Sign in to your account');
			
			registerButton.focus();
			
			await user.keyboard('{ArrowRight}');
			expect(loginButton).toHaveFocus();
			
			await user.keyboard('{ArrowLeft}');
			expect(registerButton).toHaveFocus();
			
			loginButton.focus();
			
			await user.keyboard('{ArrowLeft}');
			expect(registerButton).toHaveFocus();
			
			await user.keyboard('{ArrowRight}');
			expect(loginButton).toHaveFocus();
		});

		it('should prevent default behavior for Enter key on focus scope', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const modal = screen.getByRole('dialog');
			
			const enterEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				bubbles: true,
				cancelable: true,
			});
			
			Object.defineProperty(enterEvent, 'target', {
				value: modal.querySelector('[data-radix-focus-scope]') || modal,
			});
			Object.defineProperty(enterEvent, 'currentTarget', {
				value: modal.querySelector('[data-radix-focus-scope]') || modal,
			});
			
			const preventDefault = vi.spyOn(enterEvent, 'preventDefault');
			const stopPropagation = vi.spyOn(enterEvent, 'stopPropagation');
			
			modal.dispatchEvent(enterEvent);
			
			expect(preventDefault).toHaveBeenCalled();
			expect(stopPropagation).toHaveBeenCalled();
		});
	});

	describe('Modal Interactions', () => {
		it('should call onGetStarted when "Start Building Now" button is clicked', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const getStartedButton = screen.getByText('Start Building Now');
			await user.click(getStartedButton);
			
			expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
		});

		it('should call onClose when close button is clicked', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const closeButton = screen.getByLabelText('Close welcome modal');
			await user.click(closeButton);
			
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('should call onClose when backdrop is clicked', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const backdrop = screen.getByRole('dialog').parentElement;
			await user.click(backdrop!);
			
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('should not call onClose when modal content is clicked', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const modalContent = screen.getByRole('document');
			await user.click(modalContent);
			
			expect(mockOnClose).not.toHaveBeenCalled();
		});

		it('should open register page in new tab', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const registerButton = screen.getByLabelText('Create a new account');
			await user.click(registerButton);
			
			expect(window.open).toHaveBeenCalledWith('/register', '_blank', 'noopener,noreferrer');
		});

		it('should open login page in new tab', async () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const loginButton = screen.getByLabelText('Sign in to your account');
			await user.click(loginButton);
			
			expect(window.open).toHaveBeenCalledWith('/login', '_blank', 'noopener,noreferrer');
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes', () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			const modal = screen.getByRole('dialog');
			
			expect(modal).toHaveAttribute('aria-modal', 'true');
			expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
			expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
			expect(modal).toHaveAttribute('aria-live', 'polite');
		});

		it('should have accessible title and description', () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			expect(screen.getByText('Welcome to Resume Builder! 🚀')).toHaveAttribute('id', 'modal-title');
			expect(screen.getByText(/Create professional, ATS-optimized resumes/)).toHaveAttribute('id', 'modal-description');
		});

		it('should have proper button labeling', () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			expect(screen.getByLabelText('Create a new account')).toBeInTheDocument();
			expect(screen.getByLabelText('Sign in to your account')).toBeInTheDocument();
			expect(screen.getByLabelText('Close welcome modal')).toBeInTheDocument();
		});

		it('should have semantic structure with proper headings', () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to Resume Builder! 🚀');
			expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Everything you need to build the perfect resume');
			expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Pro Tips for Success');
		});
	});

	describe('Content Rendering', () => {
		it('should render all feature cards', () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			expect(screen.getByText('Live Preview')).toBeInTheDocument();
			expect(screen.getByText('Pro Templates')).toBeInTheDocument();
			expect(screen.getByText('Export PDF')).toBeInTheDocument();
			expect(screen.getByText('ATS Optimized')).toBeInTheDocument();
		});

		it('should render all tip items', () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			expect(screen.getByText(/Start with personal info and work backwards/)).toBeInTheDocument();
			expect(screen.getByText(/Use action verbs and quantify achievements/)).toBeInTheDocument();
			expect(screen.getByText(/Keep to 1-2 pages for maximum impact/)).toBeInTheDocument();
			expect(screen.getByText(/Tailor skills to match job descriptions/)).toBeInTheDocument();
		});

		it('should display privacy and storage information', () => {
			render(<WelcomeModal {...createMockProps()} />);
			
			expect(screen.getByText('About Data Persistence')).toBeInTheDocument();
			expect(screen.getByText(/Your data stays in memory during this session/)).toBeInTheDocument();
			expect(screen.getByText('No signup required to get started • Your privacy is protected')).toBeInTheDocument();
		});
	});

	describe('Modal State Management', () => {
		it('should not render when isOpen is false', () => {
			render(<WelcomeModal {...createMockProps({ isOpen: false })} />);
			
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});

		it('should handle body overflow styling', () => {
			const { rerender } = render(<WelcomeModal {...createMockProps({ isOpen: true })} />);
			
			expect(document.body.style.overflow).toBe('hidden');
			
			rerender(<WelcomeModal {...createMockProps({ isOpen: false })} />);
			
			expect(document.body.style.overflow).toBe('');
		});
	});

	describe('Error Handling', () => {
		it('should handle auth action errors gracefully', async () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			vi.mocked(window.open).mockImplementation(() => {
				throw new Error('Failed to open');
			});
			
			render(<WelcomeModal {...createMockProps()} />);
			
			const registerButton = screen.getByLabelText('Create a new account');
			await user.click(registerButton);
			
			expect(consoleSpy).toHaveBeenCalledWith('Failed to open register page:', expect.any(Error));
			
			consoleSpy.mockRestore();
		});
	});
});
