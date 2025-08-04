'use client';

import { motion } from 'framer-motion';
import { Download, Eye, Maximize2, Printer } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import type { TResumeData } from '../../types/resume';
import { ResumePreview } from './resume-preview';

export type TPreviewAreaProps = {
	readonly resumeData: TResumeData;
};

export function PreviewArea({ resumeData }: TPreviewAreaProps) {
	const [isFullscreen, setIsFullscreen] = useState(false);

	const enabledSections = resumeData.sections.filter((section) => section.isEnabled);

	function handleToggleFullscreen() {
		setIsFullscreen(!isFullscreen);
	}

	function handleDownload() {
		console.log('Download resume as PDF');
	}

	function handlePrint() {
		window.print();
	}

	return (
		<div className='h-full flex flex-col'>
			<div className='border-b bg-card p-4'>
				<div className='flex items-center justify-between mb-3'>
					<div className='flex items-center gap-2'>
						<Eye className='h-5 w-5 text-muted-foreground' />
						<h2 className='font-semibold'>Live Preview</h2>
					</div>
					<Badge variant='secondary' className='text-xs'>
						{enabledSections.length} sections
					</Badge>
				</div>

				<div className='flex gap-2'>
					<Button
						size='sm'
						variant='outline'
						onClick={handleToggleFullscreen}
						className='flex items-center gap-1 bg-transparent'
					>
						<Maximize2 className='h-3 w-3' />
						{isFullscreen ? 'Exit' : 'Fullscreen'}
					</Button>
					<Button
						size='sm'
						variant='outline'
						onClick={handlePrint}
						className='flex items-center gap-1 bg-transparent'
					>
						<Printer className='h-3 w-3' />
						Print
					</Button>
					<Button size='sm' onClick={handleDownload} className='flex items-center gap-1'>
						<Download className='h-3 w-3' />
						Download
					</Button>
				</div>
			</div>

			<div className='flex-1 overflow-auto p-4'>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
					className={
						isFullscreen ? 'fixed inset-0 z-50 bg-background p-8 overflow-auto' : ''
					}
				>
					<div className='max-w-[8.5in] mx-auto'>
						<ResumePreview resumeData={resumeData} />
					</div>
				</motion.div>
			</div>
		</div>
	);
}
