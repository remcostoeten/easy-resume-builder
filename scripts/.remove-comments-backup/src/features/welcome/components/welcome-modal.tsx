import React, { useCallback, useEffect, useMemo } from 'react';
import { BADGES, FEATURES, TIPS } from '../data';

type TProps = {
	isOpen: boolean;
	onClose: () => void;
	onGetStarted: () => void;
};

const FeatureCard = React.memo(({ feature }: { feature: (typeof FEATURES)[number] }) => (
	<article className='border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default rounded-lg'>
		<div className='p-4 text-center h-full flex flex-col'>
			<div
				className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.gradient} p-2 mx-auto mb-3 shadow-lg hover:scale-110 hover:rotate-3 transition-transform duration-200 flex items-center justify-center text-white text-lg`}
				role='img'
				aria-label={feature.title}
			>
				{feature.icon}
			</div>
			<h4 className='font-semibold mb-1 text-sm text-foreground'>{feature.title}</h4>
			<p className='text-xs text-muted-foreground leading-relaxed flex-1'>
				{feature.description}
			</p>
		</div>
	</article>
));

FeatureCard.displayName = 'FeatureCard';

const TipItem = React.memo(({ tip }: { tip: string }) => (
	<li className='flex items-start gap-2'>
		<div className='w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0' />
		<span className='text-xs text-muted-foreground leading-relaxed'>{tip}</span>
	</li>
));

TipItem.displayName = 'TipItem';

export function WelcomeModal({ isOpen, onClose, onGetStarted }: TProps) {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		},
		[onClose]
	);

	const handleBackdropClick = useCallback(
		(event: React.MouseEvent) => {
			if (event.target === event.currentTarget) {
				onClose();
			}
		},
		[onClose]
	);

	const handleAuthAction = useCallback((action: 'register' | 'login') => {
		try {
			const url = `/${action}`;
			window.open(url, '_blank', 'noopener,noreferrer');
		} catch (error) {
			console.error(`Failed to open ${action} page:`, error);
		}
	}, []);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';

			return () => {
				document.removeEventListener('keydown', handleKeyDown);
				document.body.style.overflow = '';
			};
		}
	}, [isOpen, handleKeyDown]);

	const featureCards = useMemo(
		() => FEATURES.map((feature) => <FeatureCard key={feature.id} feature={feature} />),
		[]
	);

	const tipItems = useMemo(
		() => TIPS.map((tip, index) => <TipItem key={`tip-${index}`} tip={tip} />),
		[]
	);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'
			onClick={handleBackdropClick}
			role='dialog'
			aria-modal='true'
			aria-labelledby='modal-title'
			aria-describedby='modal-description'
		>
			<div className='bg-background rounded-lg max-w-5xl w-full max-h-[95vh] shadow-2xl border flex flex-col'>
				<div className='relative flex flex-col h-full'>
					<header className='relative p-6 pb-4 text-center bg-gradient-to-r from-primary/20 via-primary/5 to-primary/30 rounded-t-lg'>
						<div className='flex items-center justify-center mb-4'>
							<div className='relative'>
								<div className='p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-xl'>
									<span
										className='text-xl'
										role='img'
										aria-label='Resume document'
									>
										📄
									</span>
								</div>
								<div className='absolute -top-1 -right-1'>
									<div className='p-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg'>
										<span
											className='text-white text-xs'
											role='img'
											aria-label='Premium feature'
										>
											⭐
										</span>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h1
								id='modal-title'
								className='text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
							>
								Welcome to Resume Builder! 🚀
							</h1>
							<p
								id='modal-description'
								className='text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed'
							>
								Create professional, ATS-optimized resumes in minutes. Join
								thousands who've landed their dream positions.
							</p>
						</div>
					</header>

					<main className='flex-1 overflow-y-auto px-6'>
						<section className='py-4'>
							<h2 className='text-lg font-semibold text-center mb-4 text-foreground'>
								Everything you need to build the perfect resume
							</h2>

							<div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6' role='list'>
								{featureCards}
							</div>
							<section className='bg-muted/30 rounded-lg p-4 mb-4'>
								<div className='flex items-center gap-2 mb-3'>
									<div className='w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center'>
										<span
											className='text-primary text-sm'
											role='img'
											aria-label='Information'
										>
											ℹ️
										</span>
									</div>
									<h3 className='font-semibold text-foreground text-sm'>
										Pro Tips for Success
									</h3>
								</div>
								<ol className='grid grid-cols-1 md:grid-cols-2 gap-2 list-none'>
									{tipItems}
								</ol>
							</section>

							<aside className='bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4 mb-4'>
								<div className='flex items-start gap-3'>
									<div className='w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0'>
										<span
											className='text-amber-600 dark:text-amber-400 text-sm'
											role='img'
											aria-label='Storage'
										>
											🗄️
										</span>
									</div>
									<div className='flex-1'>
										<h4 className='font-semibold text-amber-800 dark:text-amber-200 mb-1 text-sm'>
											About Data Persistence
										</h4>
										<p className='text-xs text-amber-700 dark:text-amber-300 leading-relaxed mb-2'>
											Start building immediately without an account! Data
											saves locally in your browser. For access anywhere,
											create a free account.
										</p>
										<div className='flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400'>
											<span role='img' aria-label='Clock'>
												🕐
											</span>
											<span>
												Local saves last until you clear browser data
											</span>
										</div>
									</div>
								</div>
							</aside>
						</section>
					</main>

					<footer className='p-6 pt-4 bg-background border-t border-border/50 rounded-b-lg'>
						<div className='flex flex-col sm:flex-row gap-3 justify-center mb-4'>
							<button
								type='button'
								onClick={onGetStarted}
								className='gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg px-6 py-2.5 text-sm font-medium hover:scale-105 transition-transform duration-200 rounded-lg inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
								aria-describedby='get-started-description'
							>
								<span role='img' aria-hidden='true'>
									✨
								</span>
								Start Building Now
								<span role='img' aria-hidden='true'>
									→
								</span>
							</button>
							<span id='get-started-description' className='sr-only'>
								Begin creating your resume immediately without registration
							</span>
						</div>

						<div className='flex flex-col sm:flex-row gap-2 justify-center mb-3'>
							<button
								type='button'
								className='gap-2 border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 px-4 py-2 text-sm hover:scale-105 transition-transform duration-200 rounded-lg inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
								onClick={() => handleAuthAction('register')}
								aria-label='Create a new account'
							>
								<span role='img' aria-hidden='true'>
									👤+
								</span>
								Register
							</button>

							<button
								type='button'
								className='gap-2 border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 px-4 py-2 text-sm hover:scale-105 transition-transform duration-200 rounded-lg inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
								onClick={() => handleAuthAction('login')}
								aria-label='Sign in to your account'
							>
								<span role='img' aria-hidden='true'>
									🔐
								</span>
								Login
							</button>
						</div>

						<p className='text-center text-xs text-muted-foreground'>
							No signup required to get started • Your privacy is protected
						</p>
					</footer>

					<div
						className='absolute top-4 right-4 opacity-20 pointer-events-none'
						aria-hidden='true'
					>
						<div className='animate-spin' style={{ animationDuration: '20s' }}>
							<span className='text-primary text-lg'>✨</span>
						</div>
					</div>
					<div
						className='absolute bottom-4 left-4 opacity-20 pointer-events-none'
						aria-hidden='true'
					>
						<div
							className='animate-spin'
							style={{ animationDuration: '25s', animationDirection: 'reverse' }}
						>
							<span className='text-secondary text-base'>⭐</span>
						</div>
					</div>

					<button
						type='button'
						onClick={onClose}
						className='absolute top-4 right-12 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
						aria-label='Close welcome modal'
					>
						<span aria-hidden='true'>✕</span>
					</button>
				</div>
			</div>
		</div>
	);
}
