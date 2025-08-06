'use client';

import { useState } from 'react';
import { PdfUpload } from '@/features/resume-builder/components/pdf-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function PdfTestPage() {
	const [extractedData, setExtractedData] = useState<any>(null);
	const [error, setError] = useState<string>('');

	function handleDataExtracted(data: any) {
		setExtractedData(data);
		setError('');
	}

	function handleError(errorMessage: string) {
		setError(errorMessage);
		setExtractedData(null);
	}

	return (
		<div className='container mx-auto py-8 space-y-8'>
			<Card>
				<CardHeader>
					<CardTitle>PDF Resume Parser Test</CardTitle>
					<p className='text-muted-foreground'>
						Upload a PDF resume to test the parsing functionality
					</p>
				</CardHeader>
				<CardContent>
					<PdfUpload onDataExtracted={handleDataExtracted} onError={handleError} />
				</CardContent>
			</Card>

			{error && (
				<Card className='border-destructive'>
					<CardHeader>
						<CardTitle className='text-destructive'>Error</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-destructive'>{error}</p>
					</CardContent>
				</Card>
			)}

			{extractedData && (
				<Card>
					<CardHeader>
						<CardTitle>Extracted Data</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className='bg-muted p-4 rounded-lg overflow-auto text-sm'>
							{JSON.stringify(extractedData, null, 2)}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
