'use client';

import { useAtom, useAtomValue } from 'jotai/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/shared/components/ui';
import type { Mutable } from '@/store/resume-store';
import { resumeDraftAtom, setResumeDraft } from '@/store/resume-store';
import type { TResumeData, TResumeSection } from '@/types/resume';
import { ProfessionalSidebar } from '../features/resume-builder/sidebar';
import {
	ProfessionalEditingArea,
	ProfessionalHeader,
	ProfessionalPreview,
} from '../features/resume-builder/themes/professional';

export function HomeView() {
	const [isPreviewMode, setIsPreviewMode] = useState(false);
	const [isEditMode, setIsEditMode] = useState(true);
	const [isSplitMode, setIsSplitMode] = useState(true);
	const resumeData: Mutable<TResumeData> = useAtomValue(resumeDraftAtom);

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
		setIsEditMode(!isEditMode);
		if (!isEditMode) {
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
		toast.error('Not implemented');
		console.log('Preview mode:', !isPreviewMode);
	}

	function handleDownload() {
		window.print();
	}

	function handleSettings() {
		toast.error('Not implemented');
		console.log('Open settings');
	}

	const sidebarSize = isPreviewMode ? 0 : 20;
	const editingSize = isPreviewMode ? 0 : isSplitMode ? 50 : isEditMode ? 80 : 0;
	const previewSize = isPreviewMode ? 100 : isSplitMode ? 30 : isEditMode ? 0 : 100;

	return (
		<div className='h-screen bg-background'>
			<ProfessionalHeader
				onPreview={handlePreview}
				onDownload={handleDownload}
				onSettings={handleSettings}
				onTogglePreview={handleTogglePreview}
				onToggleEdit={handleToggleEdit}
				onToggleSplit={handleToggleSplit}
				isPreviewMode={isPreviewMode}
				isEditMode={isEditMode}
				isSplitMode={isSplitMode}
			/>

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
								<ProfessionalSidebar
									sections={
										(resumeData?.sections ||
											[]) as unknown as readonly TResumeSection[]
									}
									onToggleSection={handleToggleSection}
									onReorderSections={handleReorderSections}
								/>
							</ResizablePanel>
							<ResizableHandle withHandle />
						</>
					)}

					{(isEditMode || isSplitMode) && !isPreviewMode && (
						<>
							<ResizablePanel defaultSize={editingSize} minSize={35}>
								<ProfessionalEditingArea
									sections={
										(resumeData?.sections ||
											[]) as unknown as readonly TResumeSection[]
									}
									resumeData={resumeData as unknown as TResumeData}
								/>
							</ResizablePanel>
							{isSplitMode && <ResizableHandle withHandle />}
						</>
					)}

					{(isSplitMode || isPreviewMode || (!isEditMode && !isSplitMode)) && (
						<ResizablePanel defaultSize={previewSize} minSize={25}>
							<ProfessionalPreview
								resumeData={resumeData as unknown as TResumeData}
							/>
						</ResizablePanel>
					)}
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
