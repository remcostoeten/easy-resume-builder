import { auth } from '../auth';
import type { TAuthResult, TSignUpEmailData } from './types';

type TSignUpEmailInput = {
	email: string;
	password: string;
	name: string;
	image?: string;
};

export async function signUpEmail(
	input: TSignUpEmailInput
): Promise<TAuthResult<TSignUpEmailData>> {
	try {
		const result = await auth.api.signUpEmail({
			body: {
				email: input.email,
				password: input.password,
				name: input.name,
				image: input.image,
			},
		});

		if (!result) {
			return {
				success: false,
				data: null,
				error: {
					message: 'Failed to create account',
					code: 'SIGNUP_FAILED',
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
				code: 'SIGNUP_ERROR',
			},
		};
	}
}
