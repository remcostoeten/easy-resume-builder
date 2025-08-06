'use client';

import { AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, Edit, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EmptyState } from '@/shared/components/ui';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { formatDateRange } from '@/shared/utilities/date-utils';
import {
	addWorkExperience,
	removeWorkExperience,
	updateWorkExperience,
} from '@/store/resume-store';
import type { TWorkItem } from '@/types/resume';
import { FormSection } from '../form/form-section';
import { WorkExperienceForm } from './work-experience-form';

type TProps = {
	readonly data: readonly TWorkItem[];
};

export function WorkExperienceSection({ data }: TProps) {
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [editingItem, setEditingItem] = useState<TWorkItem | null>(null);

	function handleAddNew() {
		setIsAddingNew(true);
		setEditingItem(null);
	}

	function handleEdit(item: TWorkItem) {
		setEditingItem(item);
		setIsAddingNew(false);
	}

	function handleSave(workItem: TWorkItem) {
		if (editingItem) {
			updateWorkExperience(workItem.id, workItem);
			toast.success('Work experience updated!', {
				description: `${workItem.position} at ${workItem.company} has been updated.`,
			});
		} else {
			addWorkExperience(workItem);
			toast.success('Work experience added!', {
				description: `${workItem.position} at ${workItem.company} has been added to your resume.`,
			});
		}
		setIsAddingNew(false);
		setEditingItem(null);
	}

	function handleCancel() {
		setIsAddingNew(false);
		setEditingItem(null);
	}

	function handleDelete(id: string) {
		const workItem = data.find((item) => item.id === id);
		removeWorkExperience(id);
		setEditingItem(null);
		toast.success('Work experience removed', {
			description: workItem
				? `${workItem.position} at ${workItem.company} has been removed.`
				: 'Work experience has been removed from your resume.',
		});
	}

	const isFormVisible = isAddingNew || editingItem;

	return (
		<FormSection title='Work Experience' icon={<Briefcase className='h-5 w-5' />}>
			<div className='space-y-6'>
				<AnimatePresence>
					{isFormVisible && (
						<div>
							<WorkExperienceForm
								workItem={editingItem || undefined}
								onSave={handleSave}
								onCancel={handleCancel}
								onDelete={editingItem ? handleDelete : undefined}
							/>
						</div>
					)}
				</AnimatePresence>

				{!isFormVisible && (
					<div className='space-y-4'>
						<AnimatePresence>
							{data.map((item, _index) => (
								<div key={item.id}>
									<Card className='hover:shadow-md transition-shadow cursor-pointer group'>
										<CardContent className='p-4'>
											<div className='flex items-start justify-between'>
												<div className='flex-1 space-y-2'>
													<div className='flex items-center gap-2'>
														<h4 className='font-semibold text-lg'>
															{item.position}
														</h4>
														{item.dateRange.isCurrentPosition && (
															<Badge
																variant='secondary'
																className='text-xs'
															>
																Current
															</Badge>
														)}
													</div>

													<div className='flex items-center gap-4 text-sm text-muted-foreground'>
														<div className='flex items-center gap-1'>
															<Briefcase className='h-4 w-4' />
															<span>{item.company}</span>
														</div>
														<div className='flex items-center gap-1'>
															<MapPin className='h-4 w-4' />
															<span>{item.location}</span>
														</div>
														<div className='flex items-center gap-1'>
															<Calendar className='h-4 w-4' />
															<span>
																{formatDateRange(item.dateRange)}
															</span>
														</div>
													</div>

													<p className='text-sm text-muted-foreground line-clamp-2'>
														{item.description}
													</p>

													{item.achievements.length > 0 && (
														<div className='space-y-1'>
															<p className='text-xs font-medium text-muted-foreground'>
																Key Achievements:
															</p>
															<ul className='text-sm space-y-1'>
																{item.achievements
																	.slice(0, 2)
																	.map((achievement, idx) => (
																		<li
																			key={idx}
																			className='flex items-start gap-2'
																		>
																			<span className='text-primary mt-1.5 text-xs'>
																				•
																			</span>
																			<span className='line-clamp-1'>
																				{achievement}
																			</span>
																		</li>
																	))}
																{item.achievements.length > 2 && (
																	<li className='text-xs text-muted-foreground'>
																		+
																		{item.achievements.length -
																			2}{' '}
																		more achievements
																	</li>
																)}
															</ul>
														</div>
													)}
												</div>

												<Button
													variant='ghost'
													size='sm'
													onClick={() => handleEdit(item)}
													className='opacity-0 group-hover:opacity-100 transition-opacity'
												>
													<Edit className='h-4 w-4' />
												</Button>
											</div>
										</CardContent>
									</Card>
								</div>
							))}
						</AnimatePresence>

						{data.length === 0 && (
							<EmptyState
								icon={<Briefcase className='h-8 w-8' />}
								title='No Work Experience Added'
								description='Add your professional work experience to showcase your career journey and key achievements.'
								actionLabel='Add Work Experience'
								onAction={handleAddNew}
							/>
						)}

						{data.length > 0 && (
							<Button
								onClick={handleAddNew}
								className='w-full flex items-center gap-2 bg-transparent'
								variant='outline'
							>
								<Plus className='h-4 w-4' />
								Add Work Experience
							</Button>
						)}
					</div>
				)}
			</div>
		</FormSection>
	);
}
