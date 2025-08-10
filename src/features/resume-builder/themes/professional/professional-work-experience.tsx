'use client';

import { Briefcase, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { CardSkeleton } from '@/shared/components/fallbacks/card-skeleton';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { formatDateRange } from '@/shared/utilities/date-utils';
import { AnimatePresenceLazy } from '@/shared/utilities/dynamic-motion';
import {
	addWorkExperience,
	removeWorkExperience,
	updateWorkExperience,
} from '@/store/resume-store';
import type { TWorkItem } from '@/types/resume';

function importWorkExperienceForm() {
	return import('../../sections/work-experience-form').then(function map(mod) {
		return mod.WorkExperienceForm;
	});
}

function renderWorkExperienceSkeleton() {
	return CardSkeleton({ lines: 4 });
}

const WorkExperienceFormLazy = dynamic(importWorkExperienceForm, {
	ssr: false,
	loading: renderWorkExperienceSkeleton,
});

export type TProfessionalWorkExperienceProps = {
	readonly data: readonly TWorkItem[];
};

export function ProfessionalWorkExperience({ data }: TProfessionalWorkExperienceProps) {
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [editingItem, setEditingItem] = useState<TWorkItem | null>(null);

	function handleAddNew() {
		setIsAddingNew(true);
		setEditingItem(null);
	}

	function _handleEdit(item: TWorkItem) {
		setEditingItem(item);
		setIsAddingNew(false);
	}

	function handleSave(workItem: TWorkItem) {
		if (editingItem) {
			updateWorkExperience(workItem.id, workItem);
		} else {
			addWorkExperience(workItem);
		}
		setIsAddingNew(false);
		setEditingItem(null);
	}

	function handleCancel() {
		setIsAddingNew(false);
		setEditingItem(null);
	}

	function handleDelete(id: string) {
		removeWorkExperience(id);
		setEditingItem(null);
	}

	const isFormVisible = isAddingNew || editingItem;

	return (
		<div className='max-w-4xl mx-auto p-8 space-y-8'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
						<Briefcase className='h-4 w-4 text-primary' />
					</div>
					<div>
						<h1 className='text-xl font-semibold'>Work Experience</h1>
						<p className='text-sm text-muted-foreground'>
							Showcase your professional journey and key achievements
						</p>
					</div>
				</div>

				{!isFormVisible && data.length > 0 && (
					<Button onClick={handleAddNew} className='gap-2'>
						<Plus className='h-4 w-4' />
						Add New Experience
					</Button>
				)}
			</div>

			<AnimatePresenceLazy>
				{isFormVisible && (
					<div>
						<WorkExperienceFormLazy
							workItem={editingItem || undefined}
							onSave={handleSave}
							onCancel={handleCancel}
							onDelete={editingItem ? handleDelete : undefined}
						/>
					</div>
				)}
			</AnimatePresenceLazy>

			{!isFormVisible && (
				<div className='space-y-4'>
					{data.map(function render(item) {
						return (
							<Card key={item.id} className='hover:shadow-sm transition-shadow'>
								<CardContent className='p-6'>
									<div className='flex items-start justify-between'>
										<div className='space-y-1'>
											<h3 className='text-lg font-semibold'>
												{item.position}
											</h3>
											<div className='text-sm text-muted-foreground'>
												{item.company} • {item.location}
											</div>
										</div>
										<div className='text-sm text-muted-foreground'>
											{formatDateRange(item.dateRange)}
										</div>
									</div>
									{item.description && (
										<p className='mt-3 text-sm text-muted-foreground'>
											{item.description}
										</p>
									)}
								</CardContent>
							</Card>
						);
					})}

					{data.length === 0 && (
						<EmptyState
							icon={<Briefcase className='h-8 w-8' />}
							title='Ready to showcase your career journey?'
							description="Add your work experiences to create a compelling professional timeline. Include your roles, achievements, and the impact you've made."
							actionLabel='Add Your First Position'
							onAction={handleAddNew}
						/>
					)}
				</div>
			)}
		</div>
	);
}
