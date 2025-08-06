import { auth } from '../auth';
import type { TAuthResult, TSignInEmailData } from './types';

type TSignInEmailInput = {
	email: string;
	password: string;
	rememberMe?: boolean;
};

export async function signInEmail(
	input: TSignInEmailInput
): Promise<TAuthResult<TSignInEmailData>> {
	try {
		const result = await auth.api.signInEmail({
			body: {
				email: input.email,
				password: input.password,
				rememberMe: input.rememberMe ?? true,
			},
		});

		if (!result) {
			return {
				success: false,
				data: null,
				error: {
					message: 'Invalid credentials',
					code: 'INVALID_CREDENTIALS',
				},
			};
		}

		return {
			success: true,
			data: {
				user: result.user,
				session: {
					id: result.token || '',
					userId: result.user.id,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
				},
			},
			error: null,
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

		return {
			success: false,
			data: null,
			error: {
				message: errorMessage,
				code: 'SIGNIN_ERROR',
			},
		};
	}
}
