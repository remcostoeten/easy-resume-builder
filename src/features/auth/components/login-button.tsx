'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { SignInForm } from './sign-in-form';

type TProps = {
	useModal?: boolean;
	className?: string;
	children?: React.ReactNode;
};

function LoginButton({ useModal = false, className, children }: TProps) {
	const router = useRouter();
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

	return (
		<>
			<Button onClick={handleClick} className={className}>
				{children || 'Login'}
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
