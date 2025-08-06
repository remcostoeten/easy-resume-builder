import { auth } from '../auth';
import type { TAuthResult, TLinkOAuthAccountData } from './types';

type TLinkOAuthAccountInput = {
	provider: 'google' | 'github';
	accessToken?: string;
	idToken?: string;
};

export async function linkOAuthAccount(
	input: TLinkOAuthAccountInput
): Promise<TAuthResult<TLinkOAuthAccountData>> {
	try {
		// TODO: Implement OAuth account linking once better-auth API is stable
		return {
			success: false,
			data: null,
			error: {
				message: 'OAuth account linking not yet implemented',
				code: 'NOT_IMPLEMENTED',
			},
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

		return {
			success: false,
			data: null,
			error: {
				message: errorMessage,
				code: 'LINK_ACCOUNT_ERROR',
			},
		};
	}
}
