'use client';

import { AlertCircle, CheckCircle2, FileText, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { getBaseUrl } from '@/shared/utilities/get-base-url';

type TProps = {
	onDataExtracted: (data: any) => void;
	onError?: (error: string) => void;
};

type TUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function PdfUpload({ onDataExtracted, onError }: TProps) {
	const [dragActive, setDragActive] = useState(false);
	const [uploadStatus, setUploadStatus] = useState<TUploadStatus>('idle');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [error, setError] = useState<string>('');
	const [extractedData, setExtractedData] = useState<any>(null);

	function handleDrag(e: React.DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		const files = e.dataTransfer.files;
		if (files?.[0]) {
			handleFile(files[0]);
		}
	}

	function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (files?.[0]) {
			handleFile(files[0]);
		}
	}

	function handleFile(file: File) {
		if (file.type !== 'application/pdf') {
			setError('Please select a PDF file');
			setUploadStatus('error');
			toast.error('Invalid file type', {
				description: 'Please select a PDF file.',
			});
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			setError('File size must be less than 10MB');
			setUploadStatus('error');
			toast.error('File too large', {
				description: 'File size must be less than 10MB.',
			});
			return;
		}

		setSelectedFile(file);
		setError('');
		setUploadStatus('idle');
		toast.success('File selected', {
			description: `${file.name} is ready to upload.`,
		});
	}

	async function handleUpload() {
		if (!selectedFile) return;

		setUploadStatus('uploading');
		setError('');

		try {
			const formData = new FormData();
			formData.append('pdf', selectedFile);

			const baseUrl = getBaseUrl();
			const apiUrl = baseUrl ? `${baseUrl}/api/parse-pdf` : '/api/parse-pdf';

			const response = await fetch(apiUrl, {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to parse PDF');
			}

			if (result.success) {
				setUploadStatus('success');
				setExtractedData(result.data);
				onDataExtracted(result.data);
				toast.success('Resume data extracted!', {
					description:
						'Your form has been automatically filled. You can now review and edit the information.',
				});
			} else {
				throw new Error('Failed to extract data from PDF');
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
			setError(errorMessage);
			setUploadStatus('error');
			onError?.(errorMessage);
			toast.error('Failed to parse PDF', {
				description: errorMessage,
			});
		}
	}

	function handleClear() {
		setSelectedFile(null);
		setUploadStatus('idle');
		setError('');
		setExtractedData(null);
	}

	const getStatusIcon = () => {
		switch (uploadStatus) {
			case 'uploading':
				return (
					<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary' />
				);
			case 'success':
				return <CheckCircle2 className='h-5 w-5 text-green-500' />;
			case 'error':
				return <AlertCircle className='h-5 w-5 text-destructive' />;
			default:
				return <FileText className='h-5 w-5 text-muted-foreground' />;
		}
	};

	return (
		<Card className='w-full max-w-2xl mx-auto'>
			<CardContent className='p-6'>
				<div className='space-y-4'>
					<div className='text-center'>
						<h3 className='text-lg font-semibold mb-2'>Import Resume from PDF</h3>
						<p className='text-sm text-muted-foreground'>
							Upload your existing resume to automatically fill out the form fields
						</p>
					</div>

					{!selectedFile && (
						<div
							className={`
								upload-drop-zone border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
								${
									dragActive
										? 'border-primary bg-primary/5'
										: 'border-muted-foreground/25 hover:border-primary/50'
								}
							`}
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onDragOver={handleDrag}
							onDrop={handleDrop}
							onClick={() => document.getElementById('pdf-upload')?.click()}
						>
							<Upload className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
							<div className='space-y-2'>
								<p className='text-lg font-medium'>
									{dragActive
										? 'Drop your PDF here'
										: 'Click to upload or drag & drop'}
								</p>
								<p className='text-sm text-muted-foreground'>
									PDF files only, max 10MB
								</p>
							</div>
							<input
								id='pdf-upload'
								type='file'
								accept='.pdf,application/pdf'
								onChange={handleFileSelect}
								className='hidden'
							/>
						</div>
					)}

					{selectedFile && (
						<div className='space-y-4'>
							<div className='flex items-center justify-between p-4 bg-muted/50 rounded-lg'>
								<div className='flex items-center gap-3'>
									{getStatusIcon()}
									<div>
										<p className='font-medium'>{selectedFile.name}</p>
										<p className='text-sm text-muted-foreground'>
											{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
										</p>
									</div>
								</div>
								{uploadStatus !== 'uploading' && (
									<Button variant='ghost' size='sm' onClick={handleClear}>
										<X className='h-4 w-4' />
									</Button>
								)}
							</div>

							{uploadStatus === 'idle' && (
								<div className='flex gap-2'>
									<Button onClick={handleUpload} className='flex-1'>
										Parse Resume Data
									</Button>
									<Button variant='outline' onClick={handleClear}>
										Cancel
									</Button>
								</div>
							)}

							{uploadStatus === 'uploading' && (
								<div className='text-center py-4'>
									<p className='text-sm text-muted-foreground'>
										Analyzing your resume...
									</p>
								</div>
							)}

							{uploadStatus === 'success' && extractedData && (
								<Alert>
									<CheckCircle2 className='h-4 w-4' />
									<AlertDescription>
										Successfully extracted resume data! Your form has been
										automatically filled. You can now review and edit the
										information as needed.
									</AlertDescription>
								</Alert>
							)}
						</div>
					)}

					{error && (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
