import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	forceShowWelcomeModal,
	hasSeenWelcomeModal,
	markWelcomeModalAsSeen,
	resetWelcomeModal,
	setStorageOnBlur,
	setStorageOnClick,
} from '../welcome-storage';

function mockStorage() {
	const storage = new Map<string, string>();

	Object.defineProperty(window, 'localStorage', {
		value: {
			getItem: vi.fn((key: string) => storage.get(key) ?? null),
			setItem: vi.fn((key: string, value: string) => {
				storage.set(key, value);
				return undefined;
			}),
			removeItem: vi.fn((key: string) => {
				storage.delete(key);
				return undefined;
			}),
			clear: vi.fn(() => {
				storage.clear();
				return undefined;
			}),
			length: storage.size,
			key: vi.fn((index: number) => Array.from(storage.keys())[index] ?? null),
		},
		writable: true,
	});

	return storage;
}

describe('welcome-storage', () => {
	let storage: Map<string, string>;

	beforeEach(() => {
		storage = mockStorage();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('hasSeenWelcomeModal', () => {
		it('should return false when modal has not been seen', () => {
			const result = hasSeenWelcomeModal();

			expect(result).toBe(false);
			expect(window.localStorage.getItem).toHaveBeenCalledWith('welcome-modal-seen');
		});

		it('should return true when modal has been seen', () => {
			storage.set('welcome-modal-seen', 'true');

			const result = hasSeenWelcomeModal();

			expect(result).toBe(true);
			expect(window.localStorage.getItem).toHaveBeenCalledWith('welcome-modal-seen');
		});

		it('should return false for falsy storage values', () => {
			storage.set('welcome-modal-seen', 'false');

			const result = hasSeenWelcomeModal();

			expect(result).toBe(false);
		});

		it('should handle invalid JSON gracefully', () => {
			storage.set('welcome-modal-seen', 'invalid-json');

			const result = hasSeenWelcomeModal();

			expect(result).toBe(false);
		});

		it('should handle null/undefined values gracefully', () => {
			storage.set('welcome-modal-seen', 'null');

			const result = hasSeenWelcomeModal();

			expect(result).toBe(false);
		});
	});

	describe('markWelcomeModalAsSeen', () => {
		it('should mark modal as seen and return true', () => {
			const result = markWelcomeModalAsSeen();

			expect(result).toBe(true);
			expect(window.localStorage.setItem).toHaveBeenCalledWith('welcome-modal-seen', 'true');
			expect(storage.get('welcome-modal-seen')).toBe('true');
		});

		it('should return true even when already marked as seen', () => {
			storage.set('welcome-modal-seen', 'true');

			const result = markWelcomeModalAsSeen();

			expect(result).toBe(true);
			expect(window.localStorage.setItem).toHaveBeenCalledWith('welcome-modal-seen', 'true');
		});

		it('should handle storage errors gracefully', () => {
			vi.mocked(window.localStorage.setItem).mockImplementation(() => {
				throw new Error('Storage quota exceeded');
			});

			const result = markWelcomeModalAsSeen();

			expect(result).toBe(false);
		});
	});

	describe('resetWelcomeModal', () => {
		it('should remove the storage item and return true', () => {
			storage.set('welcome-modal-seen', 'true');

			const result = resetWelcomeModal();

			expect(result).toBe(true);
			expect(window.localStorage.removeItem).toHaveBeenCalledWith('welcome-modal-seen');
			expect(storage.has('welcome-modal-seen')).toBe(false);
		});

		it('should return true even when item does not exist', () => {
			const result = resetWelcomeModal();

			expect(result).toBe(true);
			expect(window.localStorage.removeItem).toHaveBeenCalledWith('welcome-modal-seen');
		});

		it('should handle storage errors gracefully', () => {
			vi.mocked(window.localStorage.removeItem).mockImplementation(() => {
				throw new Error('Storage error');
			});

			const result = resetWelcomeModal();

			expect(result).toBe(false);
		});
	});

	describe('setStorageOnClick', () => {
		it('should mark modal as seen when called', () => {
			const result = setStorageOnClick();

			expect(result).toBe(true);
			expect(window.localStorage.setItem).toHaveBeenCalledWith('welcome-modal-seen', 'true');
		});

		it('should return same result as markWelcomeModalAsSeen', () => {
			const clickResult = setStorageOnClick();
			storage.clear();
			const directResult = markWelcomeModalAsSeen();

			expect(clickResult).toBe(directResult);
		});
	});

	describe('setStorageOnBlur', () => {
		it('should mark modal as seen when called', () => {
			const result = setStorageOnBlur();

			expect(result).toBe(true);
			expect(window.localStorage.setItem).toHaveBeenCalledWith('welcome-modal-seen', 'true');
		});

		it('should return same result as markWelcomeModalAsSeen', () => {
			const blurResult = setStorageOnBlur();
			storage.clear();
			const directResult = markWelcomeModalAsSeen();

			expect(blurResult).toBe(directResult);
		});
	});

	describe('forceShowWelcomeModal', () => {
		it('should reset the welcome modal state', () => {
			storage.set('welcome-modal-seen', 'true');

			forceShowWelcomeModal();

			expect(window.localStorage.removeItem).toHaveBeenCalledWith('welcome-modal-seen');
			expect(storage.has('welcome-modal-seen')).toBe(false);
		});

		it('should dispatch custom event in browser environment', () => {
			const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

			forceShowWelcomeModal();

			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'force-show-welcome-modal',
				})
			);
		});

		it('should handle missing window gracefully', () => {
			const originalWindow = globalThis.window;
			// @ts-expect-error - Testing undefined window
			delete globalThis.window;

			expect(() => forceShowWelcomeModal()).not.toThrow();

			globalThis.window = originalWindow;
		});

		it('should work even when localStorage is not available', () => {
			vi.mocked(window.localStorage.removeItem).mockImplementation(() => {
				throw new Error('Storage not available');
			});

			expect(() => forceShowWelcomeModal()).not.toThrow();
		});
	});

	describe('Integration scenarios', () => {
		it('should handle complete user journey: first visit -> see modal -> mark as seen', () => {
			expect(hasSeenWelcomeModal()).toBe(false);

			const markResult = markWelcomeModalAsSeen();
			expect(markResult).toBe(true);

			expect(hasSeenWelcomeModal()).toBe(true);
		});

		it('should handle reset and re-show scenario', () => {
			markWelcomeModalAsSeen();
			expect(hasSeenWelcomeModal()).toBe(true);

			const resetResult = resetWelcomeModal();
			expect(resetResult).toBe(true);

			expect(hasSeenWelcomeModal()).toBe(false);
		});

		it('should handle force show scenario', () => {
			markWelcomeModalAsSeen();
			expect(hasSeenWelcomeModal()).toBe(true);

			forceShowWelcomeModal();

			expect(hasSeenWelcomeModal()).toBe(false);
		});

		it('should handle click interaction properly', () => {
			expect(hasSeenWelcomeModal()).toBe(false);

			const clickResult = setStorageOnClick();
			expect(clickResult).toBe(true);

			expect(hasSeenWelcomeModal()).toBe(true);
		});

		it('should handle blur interaction properly', () => {
			expect(hasSeenWelcomeModal()).toBe(false);

			const blurResult = setStorageOnBlur();
			expect(blurResult).toBe(true);

			expect(hasSeenWelcomeModal()).toBe(true);
		});
	});

	describe('Edge cases', () => {
		it('should handle multiple rapid calls gracefully', () => {
			const results = [
				markWelcomeModalAsSeen(),
				markWelcomeModalAsSeen(),
				markWelcomeModalAsSeen(),
			];

			expect(results).toEqual([true, true, true]);
			expect(hasSeenWelcomeModal()).toBe(true);
		});

		it('should handle alternating calls properly', () => {
			expect(markWelcomeModalAsSeen()).toBe(true);
			expect(resetWelcomeModal()).toBe(true);
			expect(markWelcomeModalAsSeen()).toBe(true);
			expect(resetWelcomeModal()).toBe(true);

			expect(hasSeenWelcomeModal()).toBe(false);
		});

		it('should handle invalid storage states', () => {
			storage.set('welcome-modal-seen', '{}');
			expect(hasSeenWelcomeModal()).toBe(false);

			storage.set('welcome-modal-seen', '[]');
			expect(hasSeenWelcomeModal()).toBe(false);

			storage.set('welcome-modal-seen', '1');
			expect(hasSeenWelcomeModal()).toBe(false);

			storage.set('welcome-modal-seen', '0');
			expect(hasSeenWelcomeModal()).toBe(false);

			storage.set('welcome-modal-seen', 'true');
			expect(hasSeenWelcomeModal()).toBe(true);
		});
	});
});
