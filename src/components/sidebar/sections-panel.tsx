'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { SectionItem } from './section-item';
import type { TResumeSection } from '../../types/resume';

export type TSectionsPanelProps = {
	readonly sections: readonly TResumeSection[];
	readonly onToggleSection: (sectionId: string) => void;
	readonly onReorderSections: (sections: readonly TResumeSection[]) => void;
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
}: TSectionsPanelProps) {
	const [activeId, setActiveId] = useState<string | null>(null);

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

	const sortedSections = [...sections].sort((a, b) => a.order - b.order);

	function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		setActiveId(null);

		if (over && active.id !== over.id) {
			const oldIndex = sortedSections.findIndex((section) => section.id === active.id);
			const newIndex = sortedSections.findIndex((section) => section.id === over.id);

			const reorderedSections = arrayMove(sortedSections, oldIndex, newIndex);
			onReorderSections(reorderedSections);
		}
	}

	const enabledCount = sections.filter((section) => section.isEnabled).length;
	const totalCount = sections.length;

	return (
		<Card className="h-full">
			<CardHeader className="pb-4">
				<CardTitle className="flex items-center gap-2 text-lg">
					<Settings className="h-5 w-5" />
					<span>Resume Sections</span>
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					{enabledCount} of {totalCount} sections enabled
				</p>
			</CardHeader>

			<CardContent className="space-y-2">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={sortedSections.map((s) => s.id)}
						strategy={verticalListSortingStrategy}
					>
						<AnimatePresence mode="popLayout">
							{sortedSections.map((section) => (
								<motion.div
									key={section.id}
									layout
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									transition={{ duration: 0.2 }}
								>
									<SortableSectionItem
										section={section}
										onToggle={onToggleSection}
									/>
								</motion.div>
							))}
						</AnimatePresence>
					</SortableContext>
				</DndContext>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="mt-4 p-3 rounded-lg bg-muted/50 border-dashed border-2"
				>
					<p className="text-xs text-muted-foreground text-center">
						Drag sections to reorder • Toggle switches to show/hide
					</p>
				</motion.div>
			</CardContent>
		</Card>
	);
}
