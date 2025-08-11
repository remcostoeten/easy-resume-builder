'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { authClient } from '@/features/auth/client/auth-client';
import { AuthModal } from '@/features/auth/components/auth-modal';
import { useSession } from '@/hooks';
import { Avatar } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';

type TProps = {
	className?: string;
};

function getInitials(name?: string | null) {
	if (!name) return 'U';
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

function UserButton({ name, image }: { name?: string | null; image?: string | null }) {
	return (
		<div className='flex items-center gap-2'>
			<Avatar
				src={image ?? undefined}
				alt={name ?? 'User'}
				fallback={getInitials(name ?? undefined)}
				size='sm'
			/>
			<span className='text-sm font-medium hidden sm:inline-block max-w-[12ch] truncate'>
				{name ?? ''}
			</span>
		</div>
	);
}

function MenuItem({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<Link
			href={href}
			className='block w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md'
			role='menuitem'
		>
			{children}
		</Link>
	);
}

function Separator() {
	return <hr className='my-1 h-px border-0 bg-border' />;
}

export function UserDropdown({ className }: TProps) {
	const { data: session, isLoading } = useSession();
	const [open, setOpen] = useState(false);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const handleSignOut = useCallback(async function handleSignOut() {
		try {
			await authClient.signOut();
			setOpen(false);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Sign out failed:', error);
		}
	}, []);

	const handleDocumentClick = useCallback(function handleDocumentClick(event: MouseEvent) {
		if (!menuRef.current) return;
		if (event.target instanceof Node && menuRef.current.contains(event.target)) return;
		setOpen(false);
	}, []);

	useEffect(
		function setupOutsideClick() {
			if (!open) return;
			document.addEventListener('mousedown', handleDocumentClick);
			return function cleanup() {
				document.removeEventListener('mousedown', handleDocumentClick);
			};
		},
		[open, handleDocumentClick]
	);

	useEffect(
		function setupLogoutShortcut() {
			if (!open) return;
			function onKeyDown(e: KeyboardEvent) {
				if (e.shiftKey && (e.key === 'L' || e.key === 'l')) {
					e.preventDefault();
					handleSignOut();
				}
			}
			document.addEventListener('keydown', onKeyDown);
			return function cleanup() {
				document.removeEventListener('keydown', onKeyDown);
			};
		},
		[open, handleSignOut]
	);

	useEffect(
		function setupAuthShortcut() {
			if (session) return;
			function isEditableTarget(target: EventTarget | null) {
				if (!(target instanceof HTMLElement)) return false;
				const tag = target.tagName.toLowerCase();
				const editable = target.isContentEditable;
				return editable || tag === 'input' || tag === 'textarea' || tag === 'select';
			}

			function onKeyDown(e: KeyboardEvent) {
				if (isEditableTarget(e.target)) return;
				if (e.shiftKey && (e.key === 'L' || e.key === 'l')) {
					e.preventDefault();
					setAuthModalOpen(true);
				}
			}

			window.addEventListener('keydown', onKeyDown);
			return function cleanup() {
				window.removeEventListener('keydown', onKeyDown);
			};
		},
		[session]
	);

	if (isLoading) {
		return (
			<div className={className}>
				<div className='flex items-center gap-2'>
					<div
						className='w-8 h-8 rounded-full bg-muted animate-pulse'
						aria-hidden='true'
					/>
					<div
						className='hidden sm:block w-24 h-4 bg-muted rounded animate-pulse'
						aria-hidden='true'
					/>
				</div>
			</div>
		);
	}

	if (!session) {
		return (
			<>
				<div className={className}>
					<Button 
						size='sm' 
						onClick={() => setAuthModalOpen(true)}
						aria-label='Sign in or create account'
					>
						Sign In
						<span
							aria-hidden='true'
							className='ml-2 rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground'
						>
							Shift+L
						</span>
					</Button>
				</div>

				<AuthModal 
					isOpen={authModalOpen} 
					onClose={() => setAuthModalOpen(false)} 
					initialMode='signin' 
					onSuccess={() => setAuthModalOpen(false)} 
				/>
			</>
		);
	}

	const user = session.user;

	return (
		<div className={`${className ? `${className} ` : ''}relative`} ref={menuRef}>
			<button
				type='button'
				className='flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
				aria-haspopup='menu'
				aria-expanded={open}
				aria-label='User menu'
				onClick={function onClick() {
					setOpen(function toggle(v) {
						return !v;
					});
				}}
			>
				<UserButton name={user.name} image={user.image} />
			</button>

			{open && (
				<div
					role='menu'
					aria-label='User options'
					className='absolute right-4 mt-2 w-48 rounded-md border bg-popover text-popover-foreground shadow-md z-50'
				>
					<div className='px-3 py-2'>
						<p className='text-sm font-medium truncate'>{user.name}</p>
						<p className='text-xs text-muted-foreground truncate'>{user.email}</p>
					</div>
					<Separator />
					<div className='p-1'>
						<MenuItem href='/dashboard/profile'>Profile</MenuItem>
						<MenuItem href='/dashboard'>Dashboard</MenuItem>
						<button
							type='button'
							className='flex w-full items-center justify-between text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md'
							role='menuitem'
							onClick={handleSignOut}
						>
							<span>Sign out</span>
							<span aria-hidden='true' className='text-xs text-muted-foreground'>
								<kbd className='rounded border px-1 py-0.5'>Shift</kbd>
								<span className='px-0.5'>+</span>
								<kbd className='rounded border px-1 py-0.5'>L</kbd>
							</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
