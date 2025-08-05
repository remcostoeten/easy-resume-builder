'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { resumeStore, resumeReducer } from '@/store/resume-store';
import { TResumeSection } from '@/types/resume';
import { convertStoreResumeData, convertStoreSections } from '@/utils/store-type-utils';
import { ModernEditingArea } from '../editing/modern-editing-area';
import { PreviewArea } from '../preview/preview-area';
import { ModernSectionsPanel } from '../sidebar/modern-sections-panel';
import { AnimatedBackground } from '@/shared/components/ui/animated-background';
	import { ModernHeader } from './modern-header';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/shared/components/ui';

export function ModernMainLayout() {
	const storeSnapshot = useSnapshot(resumeStore).data;
	const resumeData = convertStoreResumeData(storeSnapshot);
	const sections = convertStoreSections(storeSnapshot.sections);
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [isPreviewMode, setIsPreviewMode] = useState(false);

	const enabledSections = sections
		.filter((section) => section.isEnabled)
		.sort((a, b) => a.order - b.order);
	const currentSection = enabledSections[currentStepIndex];
	const progress = ((currentStepIndex + 1) / enabledSections.length) * 100;

	function handleToggleSection(sectionId: string) {
		resumeReducer({ type: 'TOGGLE_SECTION', sectionId });
	}

	function handleReorderSections(sections: readonly TResumeSection[]) {
		resumeReducer({ type: 'REORDER_SECTIONS', sections });
	}

	function handlePreview() {
		setIsPreviewMode(!isPreviewMode);
	}

	function handleDownload() {
		console.log('Download resume');
	}

	function handleSettings() {
		console.log('Open settings');
	}

	return (
		<div className='h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden'>
			<AnimatedBackground />

			<div className='relative z-10 h-full flex flex-col'>
				<ModernHeader
					progress={progress}
					currentStep={currentSection?.title || 'Getting Started'}
					onPreview={handlePreview}
					onDownload={handleDownload}
					onSettings={handleSettings}
				/>

				<div className='flex-1 overflow-hidden'>
					<ResizablePanelGroup direction='horizontal' className='h-full'>
						<ResizablePanel
							defaultSize={25}
							minSize={20}
							maxSize={35}
							className='min-w-[320px]'
							id='modern-sections-panel'
							order={1}
						>
							<motion.div
								className='h-full border-r border-white/10 bg-gradient-to-b from-slate-900/50 to-blue-900/50 backdrop-blur-sm'
								initial={{ x: -100, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							>
								<ModernSectionsPanel
									sections={sections}
									onToggleSection={handleToggleSection}
									onReorderSections={handleReorderSections}
									currentSectionId={currentSection?.id}
								/>
							</motion.div>
						</ResizablePanel>

						<ResizableHandle withHandle />

						<ResizablePanel defaultSize={isPreviewMode ? 35 : 50} minSize={30} id='modern-editing-area' order={2}>
							<motion.div
								className='h-full bg-gradient-to-b from-slate-900/30 to-purple-900/30 backdrop-blur-sm'
								initial={{ y: 100, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 30,
									delay: 0.1,
								}}
							>
								<ModernEditingArea
									sections={sections}
									resumeData={resumeData}
									onStepChange={setCurrentStepIndex}
								/>
							</motion.div>
						</ResizablePanel>

						<ResizableHandle withHandle />

						<ResizablePanel defaultSize={isPreviewMode ? 40 : 25} minSize={20} id='modern-preview-area' order={3}>
							<motion.div
								className='h-full border-l border-white/10 bg-gradient-to-b from-blue-900/30 to-purple-900/50 backdrop-blur-sm'
								initial={{ x: 100, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{
									type: 'spring',
									stiffness: 300,
									damping: 30,
									delay: 0.2,
								}}
							>
								<PreviewArea resumeData={resumeData} />
							</motion.div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>
		</div>
	);
}
