import Link from 'next/link';
import { RedirectGuard, SignUpForm } from '@/features/auth/components';

export function RegisterView() {
	return (
		<RedirectGuard>
				<div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background' data-vt='auth-page' style={{ viewTransitionName:'auth-page' }}>
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
							Join us to start building your professional resume
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
				</div>
			</div>
		</RedirectGuard>
	);
}
