import { atom } from 'jotai';

export const isAuthModalOpenAtom = atom(false);

export const authModalTypeAtom = atom<'signin' | 'signup' | 'forgot-password'>('signin');

export const authLoadingAtom = atom(false);

export const authErrorAtom = atom<string | null>(null);

export const redirectAfterAuthAtom = atom<string | null>(null);

type TAuthPreferences = {
	rememberMe: boolean;
	preferredProvider: 'email' | 'google' | 'github' | null;
	showWelcomeMessage: boolean;
};

export const authPreferencesAtom = atom<TAuthPreferences>({
	rememberMe: false,
	preferredProvider: null,
	showWelcomeMessage: true,
});

export function setAuthModal(isOpen: boolean, type: 'signin' | 'signup' | 'forgot-password' = 'signin') {
	return { isOpen, type };
}
