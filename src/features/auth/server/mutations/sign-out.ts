import { auth } from '../auth';
import type { TAuthResult, TSignOutData } from './types';

export async function signOut(): Promise<TAuthResult<TSignOutData>> {
	try {
		await auth.api.signOut({
			headers: new Headers(),
		});

		return {
			success: true,
			data: {
				success: true,
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
				code: 'SIGNOUT_ERROR',
			},
		};
	}
}
