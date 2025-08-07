'use client';

import { AlertTriangle, Bug, Check, Copy, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type TProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export function ErrorBoundary({ error, reset }: TProps) {
	const [copied, setCopied] = useState(false);

	function copyErrorDetails() {
		const errorDetails = `Error: ${error.message}\n${error.stack || ''}`;
		navigator.clipboard.writeText(errorDetails);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background/95 to-destructive/5 flex items-center justify-center relative overflow-hidden p-4'>
			<div className='absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_85%)]' />

			<div className='relative'>
				<Card className='w-full max-w-lg shadow-2xl border-0 bg-card/80 backdrop-blur-sm'>
					<CardHeader className='text-center pb-4'>
						<div className='relative mb-4'>
							<div className='absolute -inset-2 bg-destructive/20 rounded-full blur-xl animate-pulse' />
							<div className='relative flex items-center justify-center'>
								<div className='p-3 rounded-full bg-destructive/10 border border-destructive/20'>
									<AlertTriangle className='h-8 w-8 text-destructive animate-pulse' />
								</div>
							</div>
						</div>

						<CardTitle className='text-2xl mb-2'>Oops! Something went wrong</CardTitle>
						<CardDescription className='text-base leading-relaxed'>
							We encountered an unexpected error. Don't worry, our team has been
							notified and we're working on a fix.
						</CardDescription>
					</CardHeader>

					<CardContent className='space-y-4'>
						<div className='flex flex-col sm:flex-row gap-2'>
							<Button
								onClick={reset}
								variant='default'
								className='flex-1 group transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
							>
								<RefreshCw className='h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500' />
								Try Again
							</Button>

							<Button
								asChild
								variant='outline'
								className='flex-1 group transition-all hover:scale-105 hover:shadow-lg'
							>
								<Link href='/'>
									<Home className='h-4 w-4 mr-2 group-hover:rotate-12 transition-transform' />
									Go Home
								</Link>
							</Button>
						</div>

						<div className='border-t border-border/50 pt-4'>
							<details className='group'>
								<summary className='cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-muted/50'>
									<Bug className='h-4 w-4' />
									Technical Details
								</summary>
								<div className='mt-3 space-y-3'>
									<div className='relative'>
										<pre className='text-xs font-mono bg-muted p-3 rounded-md border overflow-x-auto max-h-32'>
											{error.message}
										</pre>
										<Button
											size='sm'
											variant='ghost'
											className='absolute top-2 right-2 h-6 w-6 p-0'
											onClick={copyErrorDetails}
										>
											{copied ? (
												<Check className='h-3 w-3 text-green-500' />
											) : (
												<Copy className='h-3 w-3' />
											)}
										</Button>
									</div>
									{error.digest && (
										<div className='text-xs text-muted-foreground'>
											<span className='font-medium'>Error ID:</span>{' '}
											{error.digest}
										</div>
									)}
								</div>
							</details>
						</div>
					</CardContent>
				</Card>

				<div className='absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
					<div className='w-96 h-96 bg-gradient-to-r from-destructive/10 via-primary/5 to-accent/10 rounded-full blur-3xl animate-pulse' />
				</div>
			</div>
		</div>
	);
}
