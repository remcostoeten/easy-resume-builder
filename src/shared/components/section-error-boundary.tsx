'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

type TProps = {
	error: Error & { digest?: string };
	reset: () => void;
	title?: string;
	description?: string;
};

export function SectionErrorBoundary({
	error,
	reset,
	title = 'Failed to load section',
	description = "This section encountered an error and couldn't be displayed.",
}: TProps) {
	return (
		<Card className='border-destructive/20'>
			<CardHeader className='pb-3'>
				<div className='flex items-center gap-2'>
					<AlertTriangle className='h-4 w-4 text-destructive' />
					<CardTitle className='text-sm font-medium'>{title}</CardTitle>
				</div>
				<CardDescription className='text-xs'>{description}</CardDescription>
			</CardHeader>
			<CardContent className='pb-3'>
				<details className='text-xs'>
					<summary className='cursor-pointer text-muted-foreground hover:text-foreground mb-2'>
						Show error details
					</summary>
					<div className='p-2 bg-muted rounded text-xs font-mono break-all'>
						{error.message}
					</div>
				</details>
			</CardContent>
			<CardFooter className='pt-3'>
				<Button onClick={reset} variant='outline' size='sm' className='w-full'>
					<RefreshCw className='h-3 w-3 mr-2' />
					Retry
				</Button>
			</CardFooter>
		</Card>
	);
}
