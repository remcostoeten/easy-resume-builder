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
import { AnimatePresence, motion } from 'framer-motion';
import { GripVertical, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { SECTION_CONFIGS } from '@/core/config/section-configs';
import { cn } from '@/shared/utilities';
import { TResumeSection } from '@/types/resume';

type TProps = {
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
	const config = SECTION_CONFIGS[section.type];
	const IconComponent = config.icon;

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	function handleToggle() {
		if (!section.isRequired) {
			onToggle(section.id);
		}
	}

	return (
		<div ref={setNodeRef} style={style}>
			<div
				className={cn(
					'flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors',
					isDragging && 'shadow-md bg-accent',
					!section.isEnabled && 'opacity-50'
				)}
			>
				<div
					{...attributes}
					{...listeners}
					className='cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors'
				>
					<GripVertical className='h-4 w-4 text-muted-foreground' />
				</div>

				<div className='flex items-center gap-2 flex-1 min-w-0'>
					<IconComponent className='h-4 w-4 text-muted-foreground flex-shrink-0' />
					<div className='flex-1 min-w-0'>
						<div className='flex items-center gap-2'>
							<span className='text-sm font-medium truncate'>{section.title}</span>
							{section.isRequired && (
								<span className='text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded'>
									Required
								</span>
							)}
						</div>
					</div>
				</div>

				<Switch
					checked={section.isEnabled}
					onCheckedChange={handleToggle}
					disabled={section.isRequired}
					size='sm'
				/>
			</div>
		</div>
	);
}

export function ProfessionalSidebar({ sections, onToggleSection, onReorderSections }: TProps) {
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

	return (
		<div className='h-full bg-sidebar border-r'>
			<div className='p-4 border-b'>
				<div className='flex items-center gap-2 mb-3'>
					<GripVertical className='h-4 w-4 text-muted-foreground' />
					<h2 className='font-medium text-sidebar-foreground'>Resume Sections</h2>
				</div>
				<p className='text-xs text-muted-foreground'>
					Reorder sections and toggle visibility
				</p>
			</div>

			<div className='p-4 space-y-2'>
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
						<AnimatePresence>
							{sortedSections.map((section) => (
								<motion.div
									key={section.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
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

				<div className='pt-4 border-t'>
					<Button
						variant='outline'
						size='sm'
						className='w-full justify-start bg-transparent'
					>
						<Plus className='h-4 w-4 mr-2' />
						Add Custom Section
					</Button>
				</div>
			</div>
		</div>
	);
}
