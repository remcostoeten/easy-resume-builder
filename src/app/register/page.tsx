'use client';

import Link from 'next/link';
import { SignUpForm } from '@/features/auth/components';

export default function RegisterPage() {
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
						Create Account
					</h1>
					<p className='text-muted-foreground'>
						Join thousands who've built professional resumes and landed their dream jobs
					</p>
				</div>

				<SignUpForm />

				<div className='text-center space-y-4'>
					<p className='text-sm text-muted-foreground'>
						Already have an account?{' '}
						<Link href='/login' className='text-primary hover:underline font-medium'>
							Sign in here
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

				<div className='bg-muted/30 rounded-lg p-4 text-center'>
					<div className='flex items-center justify-center gap-2 mb-2'>
						<span className='text-primary text-sm' role='img' aria-label='Shield'>
							🛡️
						</span>
						<span className='text-sm font-medium text-foreground'>
							Your Privacy Matters
						</span>
					</div>
					<p className='text-xs text-muted-foreground leading-relaxed'>
						We only collect essential information. Your resume data is encrypted and
						never shared. You can delete your account anytime.
					</p>
				</div>
			</div>
		</div>
	);
}
