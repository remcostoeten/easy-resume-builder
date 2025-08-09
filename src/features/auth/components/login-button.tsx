'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { SignInForm } from './sign-in-form';
import { useSession } from '@/features/auth/hooks/hooks';

type TProps = {
	useModal?: boolean;
	className?: string;
	children?: React.ReactNode;
};

function LoginButton({ useModal = false, className, children }: TProps) {
	const router = useRouter();
	const { data: session } = useSession();
	const isLoggedIn = useMemo(function computeIsLoggedIn() { return Boolean(session); }, [session]);
	const [isOpen, setIsOpen] = useState(false);

	function handleClick() {
		if (useModal) {
			setIsOpen(true);
		} else {
			router.push('/login');
		}
	}

	function handleModalSuccess() {
		setIsOpen(false);
	}

	useEffect(function attachShortcut() {
		function isEditableTarget(target: EventTarget | null) {
			if (!(target instanceof HTMLElement)) return false;
			const tag = target.tagName.toLowerCase();
			const editable = target.isContentEditable;
			return editable || tag === 'input' || tag === 'textarea' || tag === 'select';
		}

		function onKeyDown(e: KeyboardEvent) {
			if (isLoggedIn) return;
			if (isEditableTarget(e.target)) return;
			const key = e.key;
			if (e.shiftKey && (key === 'L' || key === 'l')) {
				e.preventDefault();
				if (useModal) {
					setIsOpen(true);
				} else {
					router.push('/login');
				}
			}
		}

		window.addEventListener('keydown', onKeyDown);
		return function cleanup() {
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [isLoggedIn, router, useModal]);

	return (
		<>
			<Button onClick={handleClick} className={className}>
				{children || 'Login'}
				{!isLoggedIn && (
					<span
						aria-hidden='true'
						className='ml-2 rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground'
					>
						Shift+L
					</span>
				)}
			</Button>

			{useModal && (
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogContent className='w-full max-w-sm mx-auto'>
						<DialogHeader>
							<DialogTitle>Sign In</DialogTitle>
						</DialogHeader>
						<SignInForm onSuccess={handleModalSuccess} />
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}

// File-scoped default export
export default LoginButton;

// Named export for interoperability
export { LoginButton };
