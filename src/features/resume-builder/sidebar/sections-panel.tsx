'use client';

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { PdfUploadModal } from '@/components/pdf-upload-modal';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { TResumeSection } from '@/types/resume';
import { SectionItem } from './section-item';

export type TSectionsPanelProps = {
	readonly sections: readonly TResumeSection[];
	readonly onToggleSection: (sectionId: string) => void;
	readonly onReorderSections: (sections: readonly TResumeSection[]) => void;
	readonly onToggleLoading?: (isLoading: boolean) => void;
};

function SortableSectionItem({
	section,
	onToggle,
}: {
	readonly section: TResumeSection;
	readonly onToggle: (sectionId: string) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: section.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<SectionItem
				section={section}
				onToggle={onToggle}
				isDragging={isDragging}
				dragHandleProps={{ ...attributes, ...listeners }}
			/>
		</div>
	);
}

export function SectionsPanel({
	sections,
	onToggleSection,
	onReorderSections,
	onToggleLoading,
}: TSectionsPanelProps) {
	const [_activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	function compareByOrder(a: TResumeSection, b: TResumeSection) {
		return a.order - b.order;
	}

	const sortedSections = [...sections].sort(compareByOrder);

	function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		setActiveId(null);

		if (over && active.id !== over.id) {
			function findActiveIndex(section: TResumeSection) {
				return section.id === active.id;
			}

			function findOverIndex(section: TResumeSection) {
				return section.id === over?.id;
			}

			const oldIndex = sortedSections.findIndex(findActiveIndex);
			const newIndex = sortedSections.findIndex(findOverIndex);

			const reorderedSections = arrayMove(sortedSections, oldIndex, newIndex);
			onReorderSections(reorderedSections);
		}
	}

	function isEnabledSection(section: TResumeSection) {
		return section.isEnabled;
	}

	const enabledCount = sections.filter(isEnabledSection).length;
	const totalCount = sections.length;

	return (
		<Card className='h-full'>
			<CardHeader className='pb-4'>
				<CardTitle className='flex items-center gap-2 text-lg'>
					<Settings className='h-5 w-5' />
					<span>Resume Sections</span>
				</CardTitle>
				<p className='text-sm text-muted-foreground'>
					{enabledCount} of {totalCount} sections enabled
				</p>
			</CardHeader>

			<CardContent className='space-y-2'>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={sortedSections.map(function getSectionId(s) {
							return s.id;
						})}
						strategy={verticalListSortingStrategy}
					>
						<AnimatePresence mode='popLayout'>
							{sortedSections.map(function renderSectionItem(section) {
								return (
									<div key={section.id}>
										<SortableSectionItem
											section={section}
											onToggle={onToggleSection}
										/>
									</div>
								);
							})}
						</AnimatePresence>
					</SortableContext>
				</DndContext>

				<div className='mt-4 space-y-3'>
					<PdfUploadModal />

					<div className='p-3 rounded-lg bg-muted/50 border-dashed border-2'>
						<p className='text-xs text-muted-foreground text-center mb-2'>
							Drag sections to reorder • Toggle switches to show/hide
						</p>
						{onToggleLoading && (
							<Button
								size='sm'
								variant='outline'
								onClick={function handleLoadingToggle() {
									onToggleLoading(true);
								}}
								className='w-full text-xs'
							>
								Demo: Show Skeleton
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
