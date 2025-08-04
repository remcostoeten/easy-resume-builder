'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/src/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/card';
import { Input } from '@/src/shared/components/ui/input';
import { Label } from '@/src/shared/components/ui/label';
import { Progress } from '@/src/shared/components/ui/progress';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/src/shared/components/ui/select';
import { Slider } from '@/src/shared/components/ui/slider';
import { Switch } from '@/src/shared/components/ui/switch';
import { FormField } from '../form/form-field';
import { TSkillCategory, TSkill } from '@/src/types/resume';
import { createEntity } from '@/src/utils/entity';
import { TSkillCategoryForm, skillCategorySchema } from '../../resume-schemas';

export type TSkillsFormProps = {
	readonly skillCategory?: TSkillCategory;
	readonly onSave: (data: TSkillCategory) => void;
	readonly onCancel: () => void;
	readonly onDelete?: (id: string) => void;
};

export function SkillsForm({ skillCategory, onSave, onCancel, onDelete }: TSkillsFormProps) {
	const [skills, setSkills] = useState<TSkill[]>(
		skillCategory?.skills.map((skill) => ({ ...skill })) || [
			createEntity<TSkill>({
				name: '',
				proficiency: {
					level: 5,
					showLevel: true,
					displayType: 'bar',
				},
			}),
		]
	);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid },
		setValue,
		watch,
	} = useForm<TSkillCategoryForm>({
		resolver: zodResolver(skillCategorySchema),
		defaultValues: skillCategory
			? {
					name: skillCategory.name,
					showGroupLabel: skillCategory.showGroupLabel,
					skills: skillCategory.skills,
				}
			: {
					name: '',
					showGroupLabel: true,
					skills: [],
				},
		mode: 'onChange',
	});

	const showGroupLabel = watch('showGroupLabel');

	function handleFormSubmit(formData: TSkillCategoryForm) {
		const categoryData = skillCategory
			? {
					...skillCategory,
					...formData,
					skills,
					updatedAt: new Date(),
				}
			: createEntity<TSkillCategory>({
					...formData,
					skills,
				});

		onSave(categoryData);
	}

	function handleAddSkill() {
		const newSkill = createEntity<TSkill>({
			name: '',
			proficiency: {
				level: 5,
				showLevel: true,
				displayType: 'bar',
			},
		});
		setSkills([...skills, newSkill]);
	}

	function handleUpdateSkill(index: number, updates: Partial<TSkill>) {
		const updatedSkills = [...skills];
		updatedSkills[index] = { ...updatedSkills[index], ...updates, updatedAt: new Date() };
		setSkills(updatedSkills);
	}

	function handleRemoveSkill(index: number) {
		setSkills(skills.filter((_, i) => i !== index));
	}

	function handleDelete() {
		if (skillCategory && onDelete) {
			onDelete(skillCategory.id);
		}
	}

	function renderProficiencyPreview(skill: TSkill) {
		if (!skill.proficiency?.showLevel) return null;

		const { level, displayType } = skill.proficiency;

		switch (displayType) {
			case 'bar':
				return <Progress value={(level / 10) * 100} className='h-2 w-20' />;
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
					<span className='text-xs text-muted-foreground'>
						{level <= 3
							? 'Beginner'
							: level <= 6
								? 'Intermediate'
								: level <= 8
									? 'Advanced'
									: 'Expert'}
					</span>
				);
			default:
				return null;
		}
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					<span>{skillCategory ? 'Edit Skill Category' : 'Add Skill Category'}</span>
					{skillCategory && onDelete && (
						<Button
							variant='destructive'
							size='sm'
							onClick={handleDelete}
							className='flex items-center gap-1'
						>
							<Trash2 className='h-4 w-4' />
							Delete
						</Button>
					)}
				</CardTitle>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						<FormField
							label='Category Name'
							type='text'
							placeholder='Programming Languages, Frameworks, Tools...'
							required
							{...register('name')}
							error={errors.name?.message}
							hasError={Boolean(errors.name)}
						/>

						<div className='flex items-center space-x-2'>
							<Switch
								id='show-group-label'
								checked={showGroupLabel}
								onCheckedChange={(checked) => setValue('showGroupLabel', checked)}
							/>
							<Label htmlFor='show-group-label' className='text-sm'>
								Show category label in resume
							</Label>
						</div>
					</div>

					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Label className='text-sm font-medium'>Skills</Label>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={handleAddSkill}
							>
								<Plus className='h-4 w-4 mr-1' />
								Add Skill
							</Button>
						</div>

						<AnimatePresence>
							{skills.map((skill, index) => (
								<motion.div
									key={skill.id}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className='space-y-4 p-4 border rounded-lg bg-muted/20'
								>
									<div className='flex gap-2'>
										<div className='flex-1'>
											<Label className='text-sm font-medium mb-2 block'>
												Skill Name
											</Label>
											<Input
												placeholder='React, TypeScript, Node.js...'
												value={skill.name}
												onChange={(e) =>
													handleUpdateSkill(index, {
														name: e.target.value,
													})
												}
												required
											/>
										</div>
										<Button
											type='button'
											variant='outline'
											size='sm'
											onClick={() => handleRemoveSkill(index)}
											className='mt-6'
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>

									<div className='space-y-4'>
										<div className='flex items-center space-x-2'>
											<Switch
												id={`show-proficiency-${index}`}
												checked={skill.proficiency?.showLevel || false}
												onCheckedChange={(checked) =>
													handleUpdateSkill(index, {
														proficiency: {
															...skill.proficiency,
															showLevel: checked,
															level: skill.proficiency?.level || 5,
															displayType:
																skill.proficiency?.displayType ||
																'bar',
														},
													})
												}
											/>
											<Label
												htmlFor={`show-proficiency-${index}`}
												className='text-sm'
											>
												Show proficiency level
											</Label>
										</div>

										{skill.proficiency?.showLevel && (
											<div className='space-y-4 pl-6 border-l-2 border-muted'>
												<div className='space-y-2'>
													<Label className='text-sm font-medium'>
														Display Type
													</Label>
													<Select
														value={skill.proficiency.displayType}
														onValueChange={(
															value: 'bar' | 'dots' | 'text'
														) =>
															handleUpdateSkill(index, {
																proficiency: {
																	...skill.proficiency!,
																	displayType: value,
																},
															})
														}
													>
														<SelectTrigger className='w-full'>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='bar'>
																Progress Bar
															</SelectItem>
															<SelectItem value='dots'>
																Dots
															</SelectItem>
															<SelectItem value='text'>
																Text Level
															</SelectItem>
														</SelectContent>
													</Select>
												</div>

												<div className='space-y-2'>
													<div className='flex items-center justify-between'>
														<Label className='text-sm font-medium'>
															Proficiency Level
														</Label>
														<span className='text-sm text-muted-foreground'>
															{skill.proficiency.level}/10
														</span>
													</div>
													<Slider
														value={[skill.proficiency.level]}
														onValueChange={([value]) =>
															handleUpdateSkill(index, {
																proficiency: {
																	...skill.proficiency!,
																	level: value,
																},
															})
														}
														max={10}
														min={1}
														step={1}
														className='w-full'
													/>
												</div>

												<div className='flex items-center gap-2'>
													<span className='text-sm text-muted-foreground'>
														Preview:
													</span>
													{renderProficiencyPreview(skill)}
												</div>
											</div>
										)}
									</div>
								</motion.div>
							))}
						</AnimatePresence>

						{skills.length === 0 && (
							<p className='text-sm text-muted-foreground italic text-center py-4'>
								No skills added yet.
							</p>
						)}
					</div>

					<div className='flex justify-between items-center pt-4 border-t'>
						<div className='text-sm text-muted-foreground'>
							{isDirty ? 'Unsaved changes' : 'All changes saved'}
						</div>
						<div className='flex gap-2'>
							<Button type='button' variant='outline' onClick={onCancel}>
								Cancel
							</Button>
							<Button type='submit' disabled={!isDirty || !isValid}>
								{skillCategory ? 'Update' : 'Add'} Skills
							</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
