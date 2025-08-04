'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { TResumeData, TResumeSection } from '../../types/resume';
import { SectionRenderer } from './section-renderer';

export type TEditingAreaProps = {
	readonly sections: readonly TResumeSection[];
	readonly resumeData: TResumeData;
};

export function EditingArea({ sections, resumeData }: TEditingAreaProps) {
	const enabledSections = useMemo(
		() => sections.filter((section) => section.isEnabled).sort((a, b) => a.order - b.order),
		[sections]
	);

	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const currentSection = enabledSections[currentStepIndex];

	const progress = ((currentStepIndex + 1) / enabledSections.length) * 100;

	function handlePreviousStep() {
		if (currentStepIndex > 0) {
			setCurrentStepIndex(currentStepIndex - 1);
		}
	}

	function handleNextStep() {
		if (currentStepIndex < enabledSections.length - 1) {
			setCurrentStepIndex(currentStepIndex + 1);
		}
	}

	function handleStepClick(index: number) {
		setCurrentStepIndex(index);
	}

	if (enabledSections.length === 0) {
		return (
			<div className="h-full flex items-center justify-center p-8">
				<Card className="max-w-md text-center">
					<CardContent className="pt-6">
						<h2 className="text-xl font-semibold mb-2">No Sections Enabled</h2>
						<p className="text-muted-foreground">
							Enable at least one section from the sidebar to start building your
							resume.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<div className="border-b bg-card p-4 space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">Resume Builder</h1>
						<p className="text-muted-foreground">
							Step {currentStepIndex + 1} of {enabledSections.length}
						</p>
					</div>
					<Badge variant="outline" className="text-sm">
						{Math.round(progress)}% Complete
					</Badge>
				</div>

				<div className="space-y-2">
					<Progress value={progress} className="h-2" />
					<div className="flex gap-1 overflow-x-auto pb-2">
						{enabledSections.map((section, index) => (
							<Button
								key={section.id}
								variant={index === currentStepIndex ? 'default' : 'outline'}
								size="sm"
								onClick={() => handleStepClick(index)}
								className="flex-shrink-0 text-xs"
							>
								{index < currentStepIndex && (
									<CheckCircle className="h-3 w-3 mr-1" />
								)}
								{section.title}
							</Button>
						))}
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-auto">
				<div className="p-6">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentSection?.id}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
						>
							{currentSection && (
								<SectionRenderer section={currentSection} resumeData={resumeData} />
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			<div className="border-t bg-card p-4">
				<div className="flex justify-between items-center">
					<Button
						variant="outline"
						onClick={handlePreviousStep}
						disabled={currentStepIndex === 0}
						className="flex items-center gap-2 bg-transparent"
					>
						<ChevronLeft className="h-4 w-4" />
						Previous
					</Button>

					<div className="text-sm text-muted-foreground">{currentSection?.title}</div>

					<Button
						onClick={handleNextStep}
						disabled={currentStepIndex === enabledSections.length - 1}
						className="flex items-center gap-2"
					>
						Next
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
