'use client';

import { FileText } from 'lucide-react';
import { useState } from 'react';
import { usePdfParser } from '@/hooks/use-pdf-parser';
import { Button } from '@/shared/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/components/ui/dialog';
import { PdfUpload } from './pdf-upload';

export function PdfUploadModal() {
	const [open, setOpen] = useState(false);
	const { handleExtractedData, handleParsingError } = usePdfParser();

	function onDataExtracted(data: any) {
		handleExtractedData(data);
		setTimeout(() => {
			setOpen(false);
		}, 2000);
	}

	function onError(error: string) {
		handleParsingError(error);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm' className='w-full gap-2'>
					<FileText className='h-4 w-4' />
					Import from PDF
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Import Resume from PDF</DialogTitle>
					<DialogDescription>
						Upload your existing resume PDF to automatically populate your form fields.
						This will help you get started faster by extracting information like your
						personal details, work experience, education, and skills.
					</DialogDescription>
				</DialogHeader>
				<PdfUpload onDataExtracted={onDataExtracted} onError={onError} />
			</DialogContent>
		</Dialog>
	);
}
