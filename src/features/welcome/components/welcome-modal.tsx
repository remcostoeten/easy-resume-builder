'use client';

import { FocusScope } from '@radix-ui/react-focus-scope';
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { setStorageOnBlur } from '@/utils/storage';
import { FEATURES, TIPS } from '../data';
import '@/styles/modal-transitions.css';

type TProps = {
	isOpen: boolean;
	onClose: () => void;
	onGetStarted: () => void;
	onExitComplete?: () => void;
	onGetStartedExitComplete?: () => void;
};

function FeatureCard({ feature }: { feature: (typeof FEATURES)[number] }) {
	return (
		<article className='border border-border/50 bg-card/50 backdrop-blur-sm cursor-default rounded-lg'>
			<div className='p-4 text-center h-full flex flex-col'>
				<div
					className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.gradient} p-2 mx-auto mb-3 shadow-lg flex items-center justify-center text-white text-lg`}
					role='img'
					aria-label={feature.title}
				>
					{feature.icon}
				</div>
				<h4 className='font-semibold mb-1 animate-pulse text-sm text-foreground'>
					{feature.title}
				</h4>
				<p className='text-xs text-muted-foreground leading-relaxed flex-1'>
					{feature.description}
				</p>
			</div>
		</article>
	);
}

function TipItem({ tip }: { tip: string }) {
	return (
		<li className='flex items-start gap-2'>
			<div className='w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0' />
			<span className='text-xs text-muted-foreground leading-relaxed'>{tip}</span>
		</li>
	);
}

export function WelcomeModal({
	isOpen,
	onClose,
	onGetStarted,
	onExitComplete,
	onGetStartedExitComplete,
}: TProps) {
	const firstButtonRef = useRef<HTMLButtonElement>(null);
	const exitReasonRef = useRef<'close' | 'get-started'>('close');

	function handleMountAutoFocus(event: Event) {
		event.preventDefault();
		firstButtonRef.current?.focus();
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.key === 'Escape') {
			exitReasonRef.current = 'close';
			onClose();
		}
	}

	function handleBackdropClick(event: React.MouseEvent) {
		if (event.target === event.currentTarget) {
			exitReasonRef.current = 'close';
			onClose();
		}
	}

	function handleCloseClick() {
		exitReasonRef.current = 'close';
		onClose();
	}

	function handleGetStartedClick() {
		exitReasonRef.current = 'get-started';
		onGetStarted();
	}

	function _handleAnimationExitComplete() {
		if (exitReasonRef.current === 'get-started' && onGetStartedExitComplete) {
			onGetStartedExitComplete();
		} else if (exitReasonRef.current === 'close' && onExitComplete) {
			onExitComplete();
		}
	}

	function handleModalBlur() {
		setStorageOnBlur();
	}

	function handleAuthAction(action: 'register' | 'login') {
		try {
			const url = `/${action}`;
			window.open(url, '_blank', 'noopener,noreferrer');
		} catch (error) {
			console.error(`Failed to open ${action} page:`, error);
		}
	}

	const handleDocumentKeyDown = useCallback(
		function handleDocumentKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				exitReasonRef.current = 'close';
				onClose();
			}
		},
		[onClose]
	);

	function handleFocusScopeKeyDown(event: React.KeyboardEvent) {
		if (event.key === 'Enter' && event.target === event.currentTarget) {
			event.stopPropagation();
			return;
		}

		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			const registerButton = document.querySelector(
				'[aria-label="Create a new account"]'
			) as HTMLButtonElement;
			const loginButton = document.querySelector(
				'[aria-label="Sign in to your account"]'
			) as HTMLButtonElement;

			if (registerButton && loginButton) {
				const currentFocus = document.activeElement;

				if (event.key === 'ArrowRight') {
					if (currentFocus === registerButton) {
						loginButton.focus();
					} else if (currentFocus !== loginButton) {
						registerButton.focus();
					}
				} else {
					if (currentFocus === loginButton) {
						registerButton.focus();
					} else if (currentFocus !== registerButton) {
						loginButton.focus();
					}
				}

				event.stopPropagation();
			}
		}
	}

	function handleRegisterClick() {
		return handleAuthAction('register');
	}

	function handleLoginClick() {
		return handleAuthAction('login');
	}

	useEffect(
		function setupModalEffects() {
			if (isOpen) {
				document.addEventListener('keydown', handleDocumentKeyDown);
				document.body.style.overflow = 'hidden';

				function cleanup() {
					document.removeEventListener('keydown', handleDocumentKeyDown);
					document.body.style.overflow = '';
				}

				return cleanup;
			}
		},
		[isOpen, handleDocumentKeyDown]
	);

	if (!isOpen) return null;

	return (
		<div
			data-open='true'
			className='modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4'
			onClick={handleBackdropClick}
			onKeyDown={handleKeyDown}
			role='dialog'
			aria-modal='true'
			aria-labelledby='modal-title'
			aria-describedby='modal-description'
			aria-live='polite'
		>
			<div
				data-open='true'
				className='modal bg-background rounded-lg max-w-5xl w-full max-h-[min(100vh,100svh)] md:max-h-[100vh] shadow-2xl border flex flex-col overflow-hidden'
				onBlur={handleModalBlur}
				tabIndex={-1}
				role='document'
			>
				<FocusScope
					loop
					trapped
					onMountAutoFocus={handleMountAutoFocus}
					onKeyDown={handleFocusScopeKeyDown}
				>
					<div className='relative flex flex-col h-full'>
						<header className='relative p-6 pb-4 text-center border-b border-border/50'>
							<div className='flex items-center justify-center mb-4'>
								<div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center'>
									<span
										className='text-2xl'
										role='img'
										aria-label='Resume document'
									>
										📄
									</span>
								</div>
							</div>

							<div>
								<h1
									id='modal-title'
									className='text-2xl font-bold mb-2 text-foreground'
								>
									Welcome to Resume Builder
								</h1>
								<p
									id='modal-description'
									className='text-base text-muted-foreground max-w-xl mx-auto'
								>
									Create professional, ATS-optimized resumes in minutes
								</p>
							</div>
						</header>

						<main className='flex-1 overflow-y-auto p-6'>
							<div className='max-w-4xl mx-auto'>
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6'>
									{FEATURES.map(function mapFeature(feature) {
										return <FeatureCard key={feature.id} feature={feature} />;
									})}
								</div>

								<div className='rounded-lg border border-border/60 bg-muted/20 p-3 mb-3'>
									<div className='flex items-center gap-2 mb-2'>
										<div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center'>
											<span className='text-sm text-primary'>⭐</span>
										</div>
										<div>
											<h3 className='text-xs font-semibold text-foreground flex items-center gap-2'>
												Unlock Premium Features
												<span className='inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium'>
													Premium
												</span>
											</h3>
											<p className='text-[11px] leading-snug text-muted-foreground'>
												Get the most out of Resume Builder with a free
												account
											</p>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-x-3 gap-y-1.5'>
										<div className='flex items-center gap-1.5'>
											<div className='w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center'>
												<span className='text-primary text-[10px]'>✓</span>
											</div>
											<span className='text-[11px] text-muted-foreground'>
												Cloud Storage
											</span>
										</div>
										<div className='flex items-center gap-1.5'>
											<div className='w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center'>
												<span className='text-primary text-[10px]'>✓</span>
											</div>
											<span className='text-[11px] text-muted-foreground'>
												Multiple Resumes
											</span>
										</div>
										<div className='flex items-center gap-1.5'>
											<div className='w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center'>
												<span className='text-primary text-[10px]'>✓</span>
											</div>
											<span className='text-[11px] text-muted-foreground'>
												Share Links
											</span>
										</div>
										<div className='flex items-center gap-1.5'>
											<div className='w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center'>
												<span className='text-primary text-[10px]'>✓</span>
											</div>
											<span className='text-[11px] text-muted-foreground'>
												AI Assistance
											</span>
										</div>
									</div>
								</div>

								<div className='bg-muted/20 rounded-lg p-3'>
									<h3 className='text-xs font-medium text-muted-foreground mb-2'>
										Quick Tips
									</h3>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-1.5'>
										{TIPS.map(function mapTip(tip, index) {
											return <TipItem key={`tip-${index}`} tip={tip} />;
										})}
									</div>
								</div>
							</div>
						</main>

						<footer className='bg-muted/20 border-t border-border/50'>
							<div className='p-6'>
								<div className='max-w-2xl mx-auto'>
									<div className='text-center mb-4'>
										<h3 className='font-semibold text-foreground mb-1'>
											Ready to get started?
										</h3>
										<p className='text-sm text-muted-foreground'>
											Choose how you'd like to begin
										</p>
									</div>

									<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4'>
										<div className='bg-background rounded-lg p-4 border border-border/50 text-center'>
											<div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2'>
												<span className='text-primary text-base'>⚡</span>
											</div>
											<h4 className='font-medium text-foreground mb-1 text-sm'>
												Start Building
											</h4>
											<p className='text-xs text-muted-foreground mb-3'>
												Jump right in instantly
											</p>
											<button
												ref={firstButtonRef}
												type='button'
												onClick={handleGetStartedClick}
												className='w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
												aria-describedby='get-started-description'
											>
												Start Now
											</button>
										</div>

										<div className='bg-background rounded-lg p-4 border border-border/50 text-center'>
											<div className='w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-2'>
												<span className='text-secondary text-base'>👤</span>
											</div>
											<h4 className='font-medium text-foreground mb-1 text-sm'>
												Create Account
											</h4>
											<p className='text-xs text-muted-foreground mb-3'>
												Unlock premium features
											</p>
											<div className='flex gap-2'>
												<button
													type='button'
													className='flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary'
													onClick={handleRegisterClick}
													aria-label='Create a new account'
												>
													Register
												</button>
												<button
													type='button'
													className='flex-1 border border-border hover:bg-muted px-3 py-2 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary'
													onClick={handleLoginClick}
													aria-label='Sign in to your account'
												>
													Sign In
												</button>
											</div>
										</div>
									</div>

									<div className='text-center pt-3 border-t border-border/30'>
										<p className='text-xs text-muted-foreground flex items-center justify-center gap-2'>
											<span className='w-1.5 h-1.5 rounded-full bg-green-500'></span>
											Free to use • No credit card required
										</p>
									</div>

									<span id='get-started-description' className='sr-only'>
										Begin creating your resume immediately without registration
									</span>
								</div>
							</div>
						</footer>

						<div
							className='absolute top-4 left-4 opacity-20 pointer-events-none'
							aria-hidden='true'
						>
							<div className=''>
								<span className='text-primary text-lg'>✨</span>
							</div>
						</div>
						<div
							className='absolute bottom-4 left-4 opacity-20 pointer-events-none'
							aria-hidden='true'
						>
							<div className=''>
								<span className='text-secondary text-base'>⭐</span>
							</div>
						</div>

						<button
							type='button'
							onClick={handleCloseClick}
							className='absolute top-4 right-12 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'
							aria-label='Close welcome modal'
						>
							<span aria-hidden='true'>✕</span>
						</button>
					</div>
				</FocusScope>
			</div>
		</div>
	);
}
