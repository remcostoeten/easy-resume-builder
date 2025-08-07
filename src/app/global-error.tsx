'use client';

import { useState } from 'react';

type TProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function GlobalError({ error, reset }: TProps) {
	const [copied, setCopied] = useState(false);

	function copyErrorDetails() {
		const errorDetails = `Error: ${error.message}\n${error.stack || ''}`;
		navigator.clipboard.writeText(errorDetails);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<html>
			<body className='bg-gradient-to-br from-background via-background/95 to-destructive/5'>
				<div className='min-h-screen flex items-center justify-center relative overflow-hidden p-4'>
					<div className='absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_85%)]' />

					<div className='relative'>
						<div className='w-full max-w-lg mx-4 bg-card/80 backdrop-blur-sm rounded-lg border shadow-2xl p-8'>
							<div className='text-center space-y-6'>
								<div className='relative'>
									<div className='absolute -inset-4 bg-destructive/20 rounded-full blur-2xl animate-pulse' />
									<div className='relative'>
										<div className='p-4 rounded-full bg-destructive/10 border border-destructive/20 inline-block'>
											<svg
												className='h-12 w-12 text-destructive animate-pulse'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
												/>
											</svg>
										</div>
									</div>
								</div>

								<div className='space-y-3'>
									<h1 className='text-3xl font-bold bg-gradient-to-r from-destructive via-red-500 to-orange-500 bg-clip-text text-transparent'>
										Critical Error
									</h1>
									<p className='text-muted-foreground leading-relaxed'>
										We encountered a critical error that prevented the
										application from loading properly. Our team has been
										automatically notified.
									</p>
								</div>

								<div className='space-y-4'>
									<div className='flex flex-col sm:flex-row gap-3'>
										<button
											onClick={reset}
											className='flex-1 group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-lg transition-all hover:scale-105 hover:shadow-lg font-medium'
										>
											<svg
												className='h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
												/>
											</svg>
											Try Again
										</button>

										<a
											href='/'
											className='flex-1 group inline-flex items-center justify-center px-6 py-3 border border-border bg-background/50 hover:bg-accent/50 text-foreground rounded-lg transition-all hover:scale-105 hover:shadow-lg font-medium'
										>
											<svg
												className='h-4 w-4 mr-2 group-hover:rotate-12 transition-transform'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
												/>
											</svg>
											Go Home
										</a>
									</div>
								</div>

								{process.env.NODE_ENV === 'development' && (
									<div className='border-t border-border/50 pt-6'>
										<details className='text-left group'>
											<summary className='cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-muted/50'>
												<svg
													className='h-4 w-4'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
													/>
												</svg>
												Development Details
											</summary>
											<div className='mt-3 space-y-3'>
												<div className='relative'>
													<pre className='text-xs font-mono bg-muted p-3 rounded-md border overflow-x-auto max-h-40 text-destructive'>
														{error.message}
														{error.digest &&
															`\nError ID: ${error.digest}`}
														{error.stack &&
															`\n\nStack Trace:\n${error.stack}`}
													</pre>
													<button
														type='button'
														className='absolute top-2 right-2 p-1 rounded bg-background/80 hover:bg-background text-xs transition-colors'
														onClick={copyErrorDetails}
													>
														{copied ? (
															<svg
																className='h-3 w-3 text-green-500'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'
															>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={2}
																	d='M5 13l4 4L19 7'
																/>
															</svg>
														) : (
															<svg
																className='h-3 w-3'
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'
															>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={2}
																	d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
																/>
															</svg>
														)}
													</button>
												</div>
											</div>
										</details>
									</div>
								)}
							</div>
						</div>

						<div className='absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
							<div className='w-96 h-96 bg-gradient-to-r from-destructive/10 via-primary/5 to-accent/10 rounded-full blur-3xl animate-pulse' />
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
