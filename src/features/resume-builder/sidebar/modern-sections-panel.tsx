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
import { CheckCircle2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { Switch } from '@/shared/components/ui/switch';
import { SECTION_CONFIGS } from '@/core/config/section-configs';
import { GradientCard } from '@/shared/components/ui';
import { cn } from 'utilities';
import { TResumeSection } from '@/types/resume';

type TProps = {
	readonly sections: readonly TResumeSection[];
	readonly onToggleSection: (sectionId: string) => void;
	readonly onReorderSections: (sections: readonly TResumeSection[]) => void;
	readonly currentSectionId?: string;
};

function SortableSectionItem({
	section,
	onToggle,
	isActive,
}: {
	readonly section: TResumeSection;
	readonly onToggle: (sectionId: string) => void;
	readonly isActive: boolean;
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
			<motion.div
				layout
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -20 }}
				transition={{ duration: 0.2 }}
			>
				<GradientCard
					className={cn(
						'p-4 cursor-pointer transition-all duration-300',
						isDragging && 'scale-105 shadow-2xl',
						section.isEnabled && 'ring-2 ring-blue-500/50',
						isActive &&
							'ring-2 ring-purple-500/50 bg-gradient-to-br from-purple-500/20 to-blue-500/20',
						!section.isEnabled && 'opacity-60'
					)}
					gradient={isActive ? 'purple' : section.isEnabled ? 'blue' : 'blue'}
					hover={!isDragging}
				>
					<div className='flex items-center gap-3'>
						<div
							{...attributes}
							{...listeners}
							className='cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10 transition-colors'
						>
							<GripVertical className='h-4 w-4 text-muted-foreground' />
						</div>

						<div className='flex items-center gap-2 flex-1 min-w-0'>
							<div className='relative'>
								<IconComponent className='h-5 w-5 text-blue-400' />
								{section.isEnabled && (
									<motion.div
										className='absolute -top-1 -right-1'
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ type: 'spring', stiffness: 500, damping: 30 }}
									>
										<CheckCircle2 className='h-3 w-3 text-green-400 bg-background rounded-full' />
									</motion.div>
								)}
							</div>

							<div className='flex-1 min-w-0'>
								<div className='flex items-center gap-2'>
									<h3 className='font-medium text-white truncate'>
										{section.title}
									</h3>
									{section.isRequired && (
										<span className='text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full'>
											Required
										</span>
									)}
								</div>
								<p className='text-xs text-muted-foreground truncate'>
									{config.description}
								</p>
							</div>
						</div>

						<Switch
							checked={section.isEnabled}
							onCheckedChange={handleToggle}
							disabled={section.isRequired}
							className='data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600'
						/>
					</div>
				</GradientCard>
			</motion.div>
		</div>
	);
}

export function ModernSectionsPanel({
	sections,
	onToggleSection,
	onReorderSections,
	currentSectionId,
}: TProps) {
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

	const enabledCount = sections.filter((section) => section.isEnabled).length;
	const totalCount = sections.length;

	return (
		<div className='h-full flex flex-col'>
			<motion.div
				className='p-6 border-b border-white/10'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<h2 className='text-xl font-bold text-white mb-2'>Resume Sections</h2>
				<div className='flex items-center gap-2'>
					<div className='flex-1 bg-muted/20 rounded-full h-2 overflow-hidden'>
						<motion.div
							className='h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'
							initial={{ width: 0 }}
							animate={{ width: `${(enabledCount / totalCount) * 100}%` }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
						/>
					</div>
					<span className='text-sm text-muted-foreground'>
						{enabledCount}/{totalCount}
					</span>
				</div>
			</motion.div>

			<div className='flex-1 overflow-auto p-4 space-y-3'>
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
						<AnimatePresence mode='popLayout'>
							{sortedSections.map((section) => (
								<SortableSectionItem
									key={section.id}
									section={section}
									onToggle={onToggleSection}
									isActive={section.id === currentSectionId}
								/>
							))}
						</AnimatePresence>
					</SortableContext>
				</DndContext>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10'
				>
					<p className='text-xs text-center text-muted-foreground'>
						💡 Drag sections to reorder • Toggle switches to show/hide
					</p>
				</motion.div>
			</div>
		</div>
	);
}
