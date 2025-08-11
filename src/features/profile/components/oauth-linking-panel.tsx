'use client';

import { ExternalLink, Github, Unlink } from 'lucide-react';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/features/auth/client/auth-client';
import {
	listOAuthAccounts,
	unlinkOAuthAccount,
} from '@/features/profile/server/actions/profile-actions';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';

type TOAuthAccount = {
	id: string;
	providerId: string;
	accountId: string;
	accessToken?: string | null;
	createdAt: Date;
	updatedAt: Date;
};

type TProps = {
	userId: string;
	initialAccounts?: TOAuthAccount[];
	onAccountLinked?: (provider: string) => void;
	onAccountUnlinked?: (provider: string) => void;
	onError?: (error: string) => void;
};

export function OAuthLinkingPanel({
	userId,
	initialAccounts = [],
	onAccountLinked,
	onAccountUnlinked,
	onError,
}: TProps) {
	const [accounts, setAccounts] = useState<TOAuthAccount[]>(initialAccounts);
	const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

	const loadAccounts = useCallback(
		function loadAccounts() {
			startTransition(async () => {
				try {
					const accountList = await listOAuthAccounts(userId);
					setAccounts(accountList);
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : 'Failed to load accounts';
					onError?.(errorMessage);
				}
			});
		},
		[userId, onError]
	);

	useEffect(() => {
		loadAccounts();
	}, [loadAccounts]);

	function isLinked(provider: string) {
		return accounts.some((account) => account.providerId === provider);
	}

	function handleLinkAccount(provider: 'google' | 'github') {
		setIsLoading({ ...isLoading, [provider]: true });

		startTransition(async () => {
			try {
				await authClient.signIn.social({
					provider,
					callbackURL: `/profile/settings?link=${provider}`,
					errorCallbackURL: '/profile/settings?error=linking_failed',
				});

				onAccountLinked?.(provider);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : `Failed to link ${provider} account`;

				toast.error('Linking failed', {
					description: errorMessage,
				});

				onError?.(errorMessage);
				setIsLoading({ ...isLoading, [provider]: false });
			}
		});
	}

	function handleUnlinkAccount(provider: 'google' | 'github') {
		setIsLoading({ ...isLoading, [provider]: true });

		startTransition(async () => {
			try {
				await unlinkOAuthAccount(provider);

				toast.success('Account unlinked', {
					description: `Your ${provider} account has been successfully unlinked.`,
				});

				loadAccounts();
				onAccountUnlinked?.(provider);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : `Failed to unlink ${provider} account`;

				toast.error('Unlinking failed', {
					description: errorMessage,
				});

				onError?.(errorMessage);
			} finally {
				setIsLoading({ ...isLoading, [provider]: false });
			}
		});
	}

	const providers = [
		{
			id: 'google',
			name: 'Google',
			icon: (
				<svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
					<path
						d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
						fill='#4285F4'
					/>
					<path
						d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
						fill='#34A853'
					/>
					<path
						d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
						fill='#FBBC05'
					/>
					<path
						d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
						fill='#EA4335'
					/>
				</svg>
			),
		},
		{
			id: 'github',
			name: 'GitHub',
			icon: <Github className='w-5 h-5' />,
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Connected Accounts</CardTitle>
				<CardDescription>
					Link your social accounts to enable additional sign-in options
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				{providers.map((provider) => {
					const linked = isLinked(provider.id);
					const loading = isLoading[provider.id];

					return (
						<div
							key={provider.id}
							className='flex items-center justify-between p-4 border rounded-lg'
						>
							<div className='flex items-center space-x-3'>
								{provider.icon}
								<div>
									<p className='font-medium'>{provider.name}</p>
									<p className='text-sm text-muted-foreground'>
										{linked ? 'Connected' : 'Not connected'}
									</p>
								</div>
							</div>

							{linked ? (
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										handleUnlinkAccount(provider.id as 'google' | 'github')
									}
									disabled={loading}
								>
									{loading ? (
										<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current' />
									) : (
										<>
											<Unlink className='w-4 h-4 mr-2' />
											Unlink
										</>
									)}
								</Button>
							) : (
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										handleLinkAccount(provider.id as 'google' | 'github')
									}
									disabled={loading}
								>
									{loading ? (
										<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current' />
									) : (
										<>
											<ExternalLink className='w-4 h-4 mr-2' />
											Connect
										</>
									)}
								</Button>
							)}
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
