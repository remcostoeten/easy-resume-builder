'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/src/shared/components/ui/button';
import type { TResumeData, TResumeSection } from '@/src/types/resume';
import { FloatingActionButton } from '../../shared/components/ui/floating-action-button';
import { GradientCard } from '../../shared/components/ui/gradient-card';
import { SectionRenderer } from './section-renderer';

export type TModernEditingAreaProps = {
	readonly sections: readonly TResumeSection[];
	readonly resumeData: TResumeData;
	readonly onStepChange?: (stepIndex: number) => void;
};

export function ModernEditingArea({ sections, resumeData, onStepChange }: TModernEditingAreaProps) {
	const enabledSections = useMemo(
		() => sections.filter((section) => section.isEnabled).sort((a, b) => a.order - b.order),
		[sections]
	);

	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const currentSection = enabledSections[currentStepIndex];

	function handlePreviousStep() {
		if (currentStepIndex > 0) {
			const newIndex = currentStepIndex - 1;
			setCurrentStepIndex(newIndex);
			onStepChange?.(newIndex);
		}
	}

	function handleNextStep() {
		if (currentStepIndex < enabledSections.length - 1) {
			const newIndex = currentStepIndex + 1;
			setCurrentStepIndex(newIndex);
			onStepChange?.(newIndex);
		}
	}

	function handleStepClick(index: number) {
		setCurrentStepIndex(index);
		onStepChange?.(index);
	}

	function handleQuickAdd() {
		// Quick add functionality - could open a modal or add a new item
		console.log('Quick add clicked');
	}

	if (enabledSections.length === 0) {
		return (
			<div className='h-full flex items-center justify-center p-8'>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className='text-center max-w-md'
				>
					<GradientCard className='p-8'>
						<Sparkles className='h-16 w-16 mx-auto text-blue-400 mb-4' />
						<h2 className='text-2xl font-bold text-white mb-2'>Ready to Start?</h2>
						<p className='text-muted-foreground mb-6'>
							Enable sections from the sidebar to begin building your amazing resume.
						</p>
						<Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
							Get Started
						</Button>
					</GradientCard>
				</motion.div>
			</div>
		);
	}

	return (
		<div className='h-full flex flex-col'>
			{/* Step Navigation */}
			<motion.div
				className='border-b border-white/10 bg-gradient-to-r from-slate-900/50 to-blue-900/50 backdrop-blur-sm p-6'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className='flex items-center justify-between mb-4'>
					<div>
						<h1 className='text-2xl font-bold text-white'>
							{currentSection?.title || 'Resume Builder'}
						</h1>
						<p className='text-muted-foreground'>
							Step {currentStepIndex + 1} of {enabledSections.length}
						</p>
					</div>

					<div className='flex items-center gap-2'>
						<span className='text-sm text-muted-foreground'>Progress:</span>
						<div className='flex items-center gap-1'>
							{enabledSections.map((section, index) => (
								<motion.div
									key={`progress-${section.id}`}
									className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ${
										index <= currentStepIndex
											? 'bg-gradient-to-r from-blue-500 to-purple-500'
											: 'bg-muted/30'
									}`}
									onClick={() => handleStepClick(index)}
									whileHover={{ scale: 1.2 }}
									whileTap={{ scale: 0.9 }}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Step Pills */}
				<div className='flex gap-2 overflow-x-auto pb-2'>
					{enabledSections.map((section, index) => (
						<motion.button
							key={section.id}
							onClick={() => handleStepClick(index)}
							className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
								index === currentStepIndex
									? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
									: index < currentStepIndex
										? 'bg-green-500/20 text-green-400 border border-green-500/30'
										: 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							{index < currentStepIndex && <CheckCircle className='h-4 w-4' />}
							{section.title}
						</motion.button>
					))}
				</div>
			</motion.div>

			{/* Content Area */}
			<div className='flex-1 overflow-auto'>
				<div className='p-6'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={currentSection?.id}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
						>
							{currentSection && (
								<GradientCard className='p-6'>
									<SectionRenderer
										section={currentSection}
										resumeData={resumeData}
									/>
								</GradientCard>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			{/* Navigation Footer */}
			<motion.div
				className='border-t border-white/10 bg-gradient-to-r from-slate-900/50 to-purple-900/50 backdrop-blur-sm p-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className='flex justify-between items-center'>
					<Button
						variant='outline'
						onClick={handlePreviousStep}
						disabled={currentStepIndex === 0}
						className='flex items-center gap-2 bg-transparent border-white/20 text-white hover:bg-white/10'
					>
						<ChevronLeft className='h-4 w-4' />
						Previous
					</Button>

					<div className='text-center'>
						<p className='text-sm text-muted-foreground'>{currentSection?.title}</p>
						<div className='flex items-center gap-1 mt-1'>
							{Array.from({ length: enabledSections.length }).map((_, i) => (
								<div
									key={i}
									className={`w-1.5 h-1.5 rounded-full ${i === currentStepIndex ? 'bg-blue-400' : 'bg-muted/30'}`}
								/>
							))}
						</div>
					</div>

					<Button
						onClick={handleNextStep}
						disabled={currentStepIndex === enabledSections.length - 1}
						className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
					>
						Next
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
			</motion.div>

			{/* Floating Action Button */}
			<FloatingActionButton onClick={handleQuickAdd} label='Quick Add' variant='secondary' />
		</div>
	);
}
