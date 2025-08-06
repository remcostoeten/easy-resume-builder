'use client';

import { startTransition, useState } from 'react';
import { toast } from 'sonner';
import { deleteUserAccount } from '@/features/profile/server/actions/profile-actions';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/components/ui/dialog';

type TProps = {
	userId: string;
	onSuccess?: () => void;
	onError?: (error: string) => void;
};

export function DeleteAccountPanel({ userId, onSuccess, onError }: TProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	function handleDeleteAccount() {
		setIsDeleting(true);
		startTransition(async () => {
			try {
				await deleteUserAccount(userId);

				toast.success('Account deleted', {
					description: 'Your account has been successfully deleted.',
				});

				setIsDialogOpen(false);
				onSuccess?.();
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Failed to delete account';

				toast.error('Deletion failed', {
					description: errorMessage,
				});

				onError?.(errorMessage);
			} finally {
				setIsDeleting(false);
			}
		});
	}

	return (
		<Card className='border-destructive/50 dark:border-destructive/30'>
			<CardHeader>
				<CardTitle>Delete Account</CardTitle>
				<CardDescription>
					Permanently delete your account and all associated data. This action cannot be
					undone.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button variant='destructive'>Delete Account</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant='outline'
								onClick={() => setIsDialogOpen(false)}
								disabled={isDeleting}
							>
								Cancel
							</Button>
							<Button
								variant='destructive'
								onClick={handleDeleteAccount}
								disabled={isDeleting}
							>
								{isDeleting ? 'Deleting...' : 'Delete Account'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}
