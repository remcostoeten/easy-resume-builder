'use client';

import { Eye, Maximize2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ResumePreview } from './resume-preview';
import type { TResumeData } from '../../types/resume';

export type TProfessionalPreviewProps = {
	readonly resumeData: TResumeData;
};

export function ProfessionalPreview({ resumeData }: TProfessionalPreviewProps) {
	function handleDownload() {
		console.log('Download resume as PDF');
	}

	function handlePrint() {
		window.print();
	}

	return (
		<div className="h-full flex flex-col bg-card border-l border-border">
			<div className="border-b border-border bg-card p-4">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<Eye className="h-4 w-4 text-primary" />
						<h2 className="font-medium text-card-foreground">Live Preview</h2>
					</div>
				</div>

				<p className="text-xs text-muted-foreground mb-4">
					Your resume preview will appear here
				</p>

				<div className="flex gap-2">
					<Button size="sm" variant="outline" className="gap-2 bg-transparent">
						<Maximize2 className="h-3 w-3" />
						Fullscreen
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={handlePrint}
						className="gap-2 bg-transparent"
					>
						<Printer className="h-3 w-3" />
						Print
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-auto p-6">
				<div className="max-w-[8.5in] mx-auto">
					<Card className="shadow-lg bg-white text-black">
						<ResumePreview resumeData={resumeData} />
					</Card>
				</div>

				<div className="text-center mt-6">
					<p className="text-xs text-muted-foreground max-w-md mx-auto">
						Start adding your personal information, work experience, education, and
						skills to see your professional resume come to life. The preview will update
						in real-time as you build your profile.
					</p>
				</div>
			</div>
		</div>
	);
}
