'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from '@/hooks';
import { Button } from '@/shared/components/ui/button';
import { AuthModal } from './auth-modal';

type TProps = {
	useModal?: boolean;
	className?: string;
	children?: React.ReactNode;
};

function LoginButton({ useModal = false, className, children }: TProps) {
	const router = useRouter();
	const { data: session } = useSession();
	const isLoggedIn = useMemo(
		function computeIsLoggedIn() {
			return Boolean(session);
		},
		[session]
	);
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

	useEffect(
		function attachShortcut() {
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
		},
		[isLoggedIn, router, useModal]
	);

	return (
		<>
			<Button onClick={handleClick} className={className}>
				{children || 'Login'}
				{!isLoggedIn && (
					<span
						aria-hidden='true'
						className='ml-2 rounded-sm border border-primary-foreground/20 bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground'
					>
						Shift+L
					</span>
				)}
			</Button>

			{useModal && (
				<AuthModal 
					isOpen={isOpen} 
					onClose={() => setIsOpen(false)} 
					initialMode='signin' 
					onSuccess={handleModalSuccess} 
				/>
			)}
		</>
	);
}

// File-scoped default export
export default LoginButton;

// Named export for interoperability
export { LoginButton };
