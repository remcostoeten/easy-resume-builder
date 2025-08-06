'use client';

import Link from 'next/link';
import { SignInForm } from '@/features/auth/components';

export default function LoginPage() {
	return (
		<div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background'>
			<div className='w-full max-w-md space-y-6'>
				<div className='text-center space-y-2'>
					<div className='flex justify-center mb-4'>
						<div className='p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-xl'>
							<span className='text-xl' role='img' aria-label='Resume document'>
								📄
							</span>
						</div>
					</div>
					<h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
						Welcome Back
					</h1>
					<p className='text-muted-foreground'>
						Sign in to continue building your professional resume
					</p>
				</div>

				<SignInForm />

				<div className='text-center space-y-4'>
					<p className='text-sm text-muted-foreground'>
						Don't have an account?{' '}
						<Link 
							href='/register' 
							className='text-primary hover:underline font-medium'
						>
							Create one here
						</Link>
					</p>
					
					<div className='flex items-center justify-center space-x-4 text-xs text-muted-foreground'>
						<Link href='/' className='hover:text-foreground transition-colors'>
							← Back to Home
						</Link>
						<span>•</span>
						<span>No account needed to start</span>
					</div>
				</div>
			</div>
		</div>
	);
}
