'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks';
import { Button } from '@/shared/components/ui/button';
import { AuthModal } from './auth-modal';

type TProps = {
	children?: React.ReactNode;
	className?: string;
	size?: 'sm' | 'default' | 'lg';
	variant?: 'default' | 'outline' | 'ghost' | 'secondary';
	initialMode?: 'signin' | 'signup';
	showShortcut?: boolean;
	onSuccess?: () => void;
};

export function AuthButton({ 
	children = 'Sign In', 
	className, 
	size = 'sm', 
	variant = 'default',
	initialMode = 'signin',
	showShortcut = true,
	onSuccess 
}: TProps) {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useState(false);

	function handleClick() {
		setIsOpen(true);
	}

	function handleClose() {
		setIsOpen(false);
	}

	function handleSuccess() {
		setIsOpen(false);
		if (onSuccess) {
			onSuccess();
		}
	}

	useEffect(
		function setupShortcut() {
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
					setIsOpen(true);
				}
			}

			window.addEventListener('keydown', onKeyDown);
			return function cleanup() {
				window.removeEventListener('keydown', onKeyDown);
			};
		},
		[session]
	);

	if (session) {
		return null;
	}

	return (
		<>
			<Button 
				size={size} 
				variant={variant}
				onClick={handleClick}
				className={className}
				aria-label='Sign in or create account'
			>
				{children}
				{showShortcut && (
					<span
						aria-hidden='true'
						className='ml-2 rounded-sm border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground'
					>
						Shift+L
					</span>
				)}
			</Button>

			<AuthModal 
				isOpen={isOpen} 
				onClose={handleClose} 
				initialMode={initialMode} 
				onSuccess={handleSuccess} 
			/>
		</>
	);
}
