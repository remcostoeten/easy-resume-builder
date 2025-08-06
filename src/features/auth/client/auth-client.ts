import { createAuthClient as createBetterAuthClient } from 'better-auth/client';
import { getBaseUrl } from '@/shared/utilities/get-base-url';

function createAuthClient() {
	const baseUrl = getBaseUrl() || process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
	return createBetterAuthClient({
		baseURL: baseUrl,
	});
}

export const authClient = createAuthClient();
