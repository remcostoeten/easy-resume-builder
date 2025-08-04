'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Building, Calendar, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/src/shared/components/ui/badge';
import { Button } from '@/src/shared/components/ui/button';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { WorkExperienceForm } from './work-experience-form';
import { EmptyState } from '@/src/shared/components/ui';
import { resumeReducer } from '@/src/store/resume-store';
import { TWorkItem } from '@/src/types/resume';
import { formatDateRange } from '@/src/utils/date-utils';

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

	function handleEdit(item: TWorkItem) {
		setEditingItem(item);
		setIsAddingNew(false);
	}

	function handleSave(workItem: TWorkItem) {
		if (editingItem) {
			resumeReducer({
				type: 'UPDATE_WORK_EXPERIENCE',
				id: workItem.id,
				data: workItem,
			});
		} else {
			resumeReducer({
				type: 'ADD_WORK_EXPERIENCE',
				data: workItem,
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
		resumeReducer({
			type: 'REMOVE_WORK_EXPERIENCE',
			id,
		});
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

			<AnimatePresence>
				{isFormVisible && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
					>
						<WorkExperienceForm
							workItem={editingItem || undefined}
							onSave={handleSave}
							onCancel={handleCancel}
							onDelete={editingItem ? handleDelete : undefined}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{!isFormVisible && (
				<div className='space-y-4'>
					<AnimatePresence>
						{data.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ delay: index * 0.1 }}
							>
								<Card
									className='hover:shadow-sm transition-shadow cursor-pointer'
									onClick={() => handleEdit(item)}
								>
									<CardContent className='p-6'>
										<div className='space-y-4'>
											<div className='flex items-start justify-between'>
												<div className='space-y-2'>
													<div className='flex items-center gap-2'>
														<h3 className='text-lg font-semibold'>
															{item.position}
														</h3>
														{item.dateRange.isCurrentPosition && (
															<Badge
																variant='secondary'
																className='text-xs'
															>
																Current Position
															</Badge>
														)}
													</div>

													<div className='flex items-center gap-4 text-sm text-muted-foreground'>
														<div className='flex items-center gap-1'>
															<Building className='h-4 w-4' />
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
												</div>
											</div>

											<p className='text-sm text-muted-foreground leading-relaxed'>
												{item.description}
											</p>

											{item.achievements.length > 0 && (
												<div className='space-y-2'>
													<h4 className='text-sm font-medium'>
														Key Achievements:
													</h4>
													<ul className='space-y-1'>
														{item.achievements
															.slice(0, 3)
															.map((achievement, idx) => (
																<li
																	key={idx}
																	className='flex items-start gap-2 text-sm text-muted-foreground'
																>
																	<span className='text-primary mt-1.5 text-xs'>
																		•
																	</span>
																	<span>{achievement}</span>
																</li>
															))}
														{item.achievements.length > 3 && (
															<li className='text-xs text-muted-foreground ml-3'>
																+{item.achievements.length - 3} more
																achievements
															</li>
														)}
													</ul>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</AnimatePresence>

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
