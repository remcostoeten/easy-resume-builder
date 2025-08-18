'use client';

import { Code, Edit, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { CardSkeleton } from '@/shared/components/fallbacks/card-skeleton';
import { EmptyState } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { AnimatePresenceLazy } from '@/shared/utilities/dynamic-motion';
import { addSkillCategory, removeSkillCategory, updateSkillCategory } from '@/store/resume-store';
import type { TSkillCategory } from '@/types/resume';

function importSkillsForm() {
	return import('./skills-form').then(function map(mod) {
		return mod.SkillsForm;
	});
}

function renderSkillsFormSkeleton() {
	return CardSkeleton({ lines: 3 });
}

const SkillsFormLazy = dynamic(importSkillsForm, { ssr: false, loading: renderSkillsFormSkeleton });

type TProps = {
	readonly data: readonly TSkillCategory[];
};

export function SkillsSection({ data }: TProps) {
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [editingCategory, setEditingCategory] = useState<TSkillCategory | null>(null);

	function handleAddNew() {
		setIsAddingNew(true);
		setEditingCategory(null);
	}

	function handleEdit(category: TSkillCategory) {
		setEditingCategory(category);
		setIsAddingNew(false);
	}

	function handleSave(skillCategory: TSkillCategory) {
		if (editingCategory) {
			updateSkillCategory(skillCategory.id, skillCategory);
		} else {
			addSkillCategory(skillCategory);
		}
		setIsAddingNew(false);
		setEditingCategory(null);
	}

	function handleCancel() {
		setIsAddingNew(false);
		setEditingCategory(null);
	}

	function handleDelete(id: string) {
		removeSkillCategory(id);
		setEditingCategory(null);
	}

	const isFormVisible = isAddingNew || editingCategory;

	function renderSkillProficiency(skill: any) {
		if (!skill.proficiency?.showLevel) return null;

		const { level, displayType } = skill.proficiency;

		switch (displayType) {
			case 'bar':
				return <Progress value={(level / 10) * 100} className='h-2 w-24' />;
			case 'dots':
				return (
					<div className='flex gap-1'>
						{Array.from({ length: 5 }, (_, i) => (
							<div
								key={i}
								className={`w-2 h-2 rounded-full ${i < Math.ceil(level / 2) ? 'bg-primary' : 'bg-muted'}`}
							/>
						))}
					</div>
				);
			case 'text':
				return (
					<Badge variant='outline' className='text-xs'>
						{level <= 3
							? 'Beginner'
							: level <= 6
								? 'Intermediate'
								: level <= 8
									? 'Advanced'
									: 'Expert'}
					</Badge>
				);
			default:
				return null;
		}
	}

	return (
		<div className='max-w-4xl mx-auto p-8 space-y-8'>
			<div className='flex items-center gap-3 mb-6'>
				<div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center'>
					<Code className='h-5 w-5 text-primary' />
				</div>
				<div>
					<h1 className='text-2xl font-semibold text-foreground'>Skills</h1>
					<p className='text-muted-foreground'>
						Highlight your technical and professional expertise
					</p>
				</div>
			</div>

			<div className='space-y-6'>
				<AnimatePresenceLazy>
					{isFormVisible && (
						<div>
							<SkillsFormLazy
								skillCategory={editingCategory || undefined}
								onSave={handleSave}
								onCancel={handleCancel}
								onDelete={editingCategory ? handleDelete : undefined}
							/>
						</div>
					)}
				</AnimatePresenceLazy>

				{!isFormVisible && (
					<div className='space-y-4'>
						<AnimatePresenceLazy>
							{data.map((category, _index) => (
								<div key={category.id}>
									<Card className='hover:shadow-md transition-shadow cursor-pointer group'>
										<CardContent className='p-4'>
											<div className='flex items-start justify-between'>
												<div className='flex-1 space-y-3'>
													<div className='flex items-center gap-2'>
														<h4 className='font-semibold text-lg'>
															{category.name}
														</h4>
														<Badge
															variant='secondary'
															className='text-xs'
														>
															{category.skills.length} skills
														</Badge>
													</div>

													<div className='grid gap-3'>
														{category.skills.map((skill) => (
															<div
																key={skill.id}
																className='flex items-center justify-between'
															>
																<span className='text-sm font-medium'>
																	{skill.name}
																</span>
																{renderSkillProficiency(skill)}
															</div>
														))}
													</div>
												</div>

												<Button
													variant='ghost'
													size='sm'
													onClick={() => handleEdit(category)}
													className='opacity-0 group-hover:opacity-100 transition-opacity'
												>
													<Edit className='h-4 w-4' />
												</Button>
											</div>
										</CardContent>
									</Card>
								</div>
							))}
						</AnimatePresenceLazy>

						{data.length === 0 && (
							<EmptyState
								icon={<Code className='h-8 w-8' />}
								title='No Skills Added'
								description='Add your technical and professional skills to highlight your expertise and capabilities.'
								actionLabel='Add Skill Category'
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
								Add Skill Category
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
