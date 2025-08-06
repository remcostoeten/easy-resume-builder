'use client';

import { format } from 'date-fns';
import { Github, Mail } from 'lucide-react';
import type { TAccount } from '@/features/auth/server/schemas/account';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';

type TProps = {
	accounts: TAccount[];
};

function getProviderIcon(providerId: string) {
	switch (providerId) {
		case 'github':
			return <Github className='h-5 w-5' />;
		case 'google':
			return <Mail className='h-5 w-5' />;
		default:
			return <div className='h-5 w-5 bg-gray-400 rounded' />;
	}
}

function getProviderName(providerId: string) {
	switch (providerId) {
		case 'github':
			return 'GitHub';
		case 'google':
			return 'Google';
		default:
			return providerId.charAt(0).toUpperCase() + providerId.slice(1);
	}
}

function AccountCard({ account }: { account: TAccount }) {
	const hasActiveToken =
		account.accessToken && account.accessTokenExpiresAt
			? new Date(account.accessTokenExpiresAt) > new Date()
			: false;

	return (
		<Card>
			<CardHeader className='pb-3'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						{getProviderIcon(account.providerId)}
						<div>
							<CardTitle className='text-base'>
								{getProviderName(account.providerId)}
							</CardTitle>
							<CardDescription>Account ID: {account.accountId}</CardDescription>
						</div>
					</div>
					<Badge variant={hasActiveToken ? 'default' : 'secondary'}>
						{hasActiveToken ? 'Active' : 'Inactive'}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className='pt-0'>
				<div className='space-y-2 text-sm text-muted-foreground'>
					<div>
						<span className='font-medium'>Connected:</span>
						<span className='ml-2'>{format(account.createdAt, 'PPp')}</span>
					</div>
					{account.accessTokenExpiresAt && (
						<div>
							<span className='font-medium'>Token Expires:</span>
							<span className='ml-2'>
								{format(account.accessTokenExpiresAt, 'PPp')}
							</span>
						</div>
					)}
					{account.scope && (
						<div>
							<span className='font-medium'>Permissions:</span>
							<div className='ml-2 mt-1'>
								{account.scope.split(' ').map((scope) => (
									<Badge
										key={scope}
										variant='outline'
										className='mr-1 mb-1 text-xs'
									>
										{scope}
									</Badge>
								))}
							</div>
						</div>
					)}
				</div>
				<div className='flex space-x-2 mt-4'>
					<Button variant='outline' size='sm' disabled>
						Refresh Token
					</Button>
					<Button variant='destructive' size='sm' disabled>
						Disconnect
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export function ProfileOAuth({ accounts }: TProps) {
	if (accounts.length === 0) {
		return (
			<Card className='border-dashed border-2 border-muted-foreground/25'>
				<CardContent className='flex flex-col items-center justify-center py-12 px-8 text-center'>
					<div className='w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-6'>
						<Github className='h-8 w-8 text-muted-foreground' />
					</div>
					<div className='space-y-3 mb-6'>
						<h3 className='text-lg font-semibold text-foreground'>
							No Connected Accounts
						</h3>
						<p className='text-muted-foreground max-w-md leading-relaxed'>
							You haven't connected any OAuth accounts yet. Connect accounts to enable
							social login and enhance your profile.
						</p>
					</div>
					<Button disabled>Connect Account</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-6'>
			<div>
				<h3 className='text-lg font-medium'>Connected Accounts</h3>
				<p className='text-sm text-muted-foreground'>
					Manage your connected social accounts and their permissions
				</p>
			</div>

			<div className='grid gap-4'>
				{accounts.map((account) => (
					<AccountCard key={account.id} account={account} />
				))}
			</div>

			<div className='pt-4 border-t'>
				<h4 className='text-base font-medium mb-3'>Available Providers</h4>
				<div className='flex space-x-2'>
					<Button variant='outline' size='sm' disabled>
						<Github className='h-4 w-4 mr-2' />
						Connect GitHub
					</Button>
					<Button variant='outline' size='sm' disabled>
						<Mail className='h-4 w-4 mr-2' />
						Connect Google
					</Button>
				</div>
			</div>
		</div>
	);
}
