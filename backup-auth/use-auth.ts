'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import { authClient } from '@/features/auth/client/auth-client';
import type { TSession } from '@/features/auth/types';

async function fetchSession(): Promise<TSession | null> {
	try {
		const session = await authClient.getSession();
		return session.data || null;
	} catch {
		return null;
	}
}

export function useSession() {
	return useSWR<TSession | null>('auth/session', fetchSession, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		dedupingInterval: 60000,
	});
}

export function useRequireAuth() {
	const router = useRouter();
	const { data: session, isLoading } = useSession();

	useEffect(
		function redirectIfUnauthenticated() {
			if (!isLoading && !session) {
				router.push('/login');
			}
		},
		[session, isLoading, router]
	);

	return { session, isLoading };
}
