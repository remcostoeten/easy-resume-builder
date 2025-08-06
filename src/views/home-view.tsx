'use client';

import { useAtomValue } from 'jotai/react';
import { lazy, Suspense, useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/shared/components/ui';
import { LoadingSkeleton } from '@/shared/components/ui/loading-skeleton';
import type { Mutable } from '@/store/resume-store';
import { resumeAtom, setResumeDraft } from '@/store/resume-store';
import type { TResumeData, TResumeSection } from '@/types/resume';

const ProfessionalSidebar = lazy(() =>
	import('../features/resume-builder/sidebar').then((m) => ({ default: m.ProfessionalSidebar }))
);
const ProfessionalEditingArea = lazy(() =>
	import('../features/resume-builder/themes/professional').then((m) => ({
		default: m.ProfessionalEditingArea,
	}))
);
const ProfessionalHeader = lazy(() =>
	import('../features/resume-builder/themes/professional').then((m) => ({
		default: m.ProfessionalHeader,
	}))
);
const ProfessionalPreview = lazy(() =>
	import('../features/resume-builder/themes/professional').then((m) => ({
		default: m.ProfessionalPreview,
	}))
);

export function HomeView() {
	const [isPreviewMode, setIsPreviewMode] = useState(false);
	const [isEditMode, setIsEditMode] = useState(true);
	const [isSplitMode, setIsSplitMode] = useState(true);
	const resumeData: Mutable<TResumeData> = useAtomValue(resumeAtom);

	function handleToggleSection(sectionId: string) {
		const sections = resumeData?.sections || [];
		const updatedSections = sections.map((section) =>
			section.id === sectionId ? { ...section, isEnabled: !section.isEnabled } : section
		);
		setResumeDraft({ sections: updatedSections });
	}

	function handleReorderSections(sections: readonly TResumeSection[]) {
		setResumeDraft({ sections: sections.map((s) => ({ ...s })) });
	}

	function handleTogglePreview() {
		setIsPreviewMode(!isPreviewMode);
		if (!isPreviewMode) {
			setIsEditMode(false);
			setIsSplitMode(false);
		} else {
			setIsEditMode(true);
			setIsSplitMode(true);
		}
	}

	function handleToggleEdit() {
		const newEditMode = !isEditMode;
		setIsEditMode(newEditMode);
		if (newEditMode) {
			setIsPreviewMode(false);
			setIsSplitMode(true);
		}
	}

	function handleToggleSplit() {
		setIsSplitMode(!isSplitMode);
		if (!isSplitMode) {
			setIsPreviewMode(false);
			setIsEditMode(true);
		}
	}

	function handlePreview() {
		console.log('Preview mode:', !isPreviewMode);
	}

	function handleDownload() {
		window.print();
	}

	const sidebarSize = isPreviewMode ? 0 : 20;
	const editingSize = isPreviewMode ? 0 : isSplitMode ? 50 : isEditMode ? 80 : 0;
	const previewSize = isPreviewMode ? 100 : isSplitMode ? 30 : isEditMode ? 0 : 100;

	return (
		<div className='h-screen bg-background'>
			<Suspense
				fallback={<div className='h-[73px] bg-card border-b border-border animate-pulse' />}
			>
				<ProfessionalHeader
					onPreview={handlePreview}
					onDownload={handleDownload}
					onTogglePreview={handleTogglePreview}
					onToggleEdit={handleToggleEdit}
					onToggleSplit={handleToggleSplit}
					isPreviewMode={isPreviewMode}
					isEditMode={isEditMode}
					isSplitMode={isSplitMode}
				/>
			</Suspense>

			<div className='h-[calc(100vh-73px)]'>
				<ResizablePanelGroup direction='horizontal' className='h-full'>
					{!isPreviewMode && (
						<>
							<ResizablePanel
								defaultSize={sidebarSize}
								minSize={15}
								maxSize={30}
								className='min-w-[280px]'
							>
								<Suspense
									fallback={
										<LoadingSkeleton
											variant='list'
											lines={5}
											className='h-full bg-card border-r border-border'
										/>
									}
								>
									<ProfessionalSidebar
										sections={
											(resumeData?.sections ||
												[]) as unknown as readonly TResumeSection[]
										}
										onToggleSection={handleToggleSection}
										onReorderSections={handleReorderSections}
									/>
								</Suspense>
							</ResizablePanel>
							<ResizableHandle withHandle />
						</>
					)}

					{(isEditMode || isSplitMode) && !isPreviewMode && (
						<>
							<ResizablePanel defaultSize={editingSize} minSize={35}>
								<Suspense
									fallback={
										<LoadingSkeleton
											variant='form'
											lines={4}
											className='h-full'
										/>
									}
								>
									<ProfessionalEditingArea
										sections={
											(resumeData?.sections ||
												[]) as unknown as readonly TResumeSection[]
										}
										resumeData={resumeData as unknown as TResumeData}
									/>
								</Suspense>
							</ResizablePanel>
							{isSplitMode && <ResizableHandle withHandle />}
						</>
					)}

					{(isSplitMode || isPreviewMode || (!isEditMode && !isSplitMode)) && (
						<ResizablePanel defaultSize={previewSize} minSize={25}>
							<Suspense
								fallback={
									<LoadingSkeleton
										variant='preview'
										lines={4}
										className='h-full bg-card border-l border-border'
									/>
								}
							>
								<ProfessionalPreview />
							</Suspense>
						</ResizablePanel>
					)}
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
