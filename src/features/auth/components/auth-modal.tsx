'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { start } from '@/shared/utilities/view-transition';

type TAuthMode = 'signin' | 'signup';

type TProps = {
	isOpen: boolean;
	onClose: () => void;
	initialMode?: TAuthMode;
	onSuccess?: () => void;
};

function AuthModeToggle({ currentMode, onModeChange }: { currentMode: TAuthMode; onModeChange: (mode: TAuthMode) => void }) {
	return (
		<div className='flex items-center justify-center mb-4'>
			<div className='flex bg-muted rounded-lg p-1'>
				<Button
					variant={currentMode === 'signin' ? 'default' : 'ghost'}
					size='sm'
					onClick={() => onModeChange('signin')}
					className='text-xs'
				>
					Sign In
				</Button>
				<Button
					variant={currentMode === 'signup' ? 'default' : 'ghost'}
					size='sm'
					onClick={() => onModeChange('signup')}
					className='text-xs'
				>
					Sign Up
				</Button>
			</div>
		</div>
	);
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin', onSuccess }: TProps) {
	const [mode, setMode] = useState<TAuthMode>(initialMode);

	function handleSuccess() {
		onClose();
		if (onSuccess) {
			onSuccess();
		}
	}

function handleModeChange(newMode: TAuthMode) {
		start(function run() {
			setMode(newMode);
		});
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='w-full max-w-md mx-auto'>
				<DialogHeader>
					<DialogTitle className='text-center'>
						{mode === 'signin' ? 'Welcome Back' : 'Create Account'}
					</DialogTitle>
				</DialogHeader>

				<AuthModeToggle currentMode={mode} onModeChange={handleModeChange} />

				<div className='px-2'>
					<div key={mode} data-vt='auth-form'>
						{mode === 'signin' ? (
							<>
								<SignInForm onSuccess={handleSuccess} className='border-0 shadow-none p-0' />
								<div className='mt-4 text-center'>
									<p className='text-sm text-muted-foreground'>
										Don't have an account?{' '}
										<button
											type='button'
											onClick={() => start(function run() { setMode('signup'); })}
											className='text-primary hover:underline font-medium'
										>
											Create one here
										</button>
									</p>
								</div>
							</>
						) : (
							<>
								<SignUpForm onSuccess={handleSuccess} className='border-0 shadow-none p-0' />
								<div className='mt-4 text-center'>
									<p className='text-sm text-muted-foreground'>
										Already have an account?{' '}
										<button
											type='button'
											onClick={() => start(function run() { setMode('signin'); })}
											className='text-primary hover:underline font-medium'
										>
											Sign in here
										</button>
									</p>
								</div>
							</>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
