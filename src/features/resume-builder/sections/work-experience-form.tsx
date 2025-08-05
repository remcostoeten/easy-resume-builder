'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Building, Calendar, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import { FormField } from '../form/form-field';
import { FormGrid } from '../form/form-grid';
import { TWorkItem } from '@/types/resume';
import { createEntity } from '@/utils/entity';
import { TWorkItemForm, workItemSchema } from '../../resume-schemas';

export type TWorkExperienceFormProps = {
	readonly workItem?: TWorkItem;
	readonly onSave: (data: TWorkItem) => void;
	readonly onCancel: () => void;
	readonly onDelete?: (id: string) => void;
};

export function WorkExperienceForm({
	workItem,
	onSave,
	onCancel,
	onDelete,
}: TWorkExperienceFormProps) {
	const [achievements, setAchievements] = useState<string[]>(workItem?.achievements ? [...workItem.achievements] : ['']);
	const [isCurrentPosition, setIsCurrentPosition] = useState(
		workItem?.dateRange.isCurrentPosition || false
	);
	const [dateFormat, setDateFormat] = useState<'year' | 'month-year' | 'full-date'>(
		workItem?.dateRange?.dateFormat || 'month-year'
	);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setValue,
		watch,
	} = useForm<TWorkItemForm>({
		resolver: zodResolver(workItemSchema),
	defaultValues: workItem
			? {
					company: workItem.company,
					position: workItem.position,
					location: workItem.location,
					description: workItem.description,
					achievements: [...workItem.achievements],
					dateRange: {
						startDate: workItem.dateRange?.startDate,
						endDate: workItem.dateRange?.endDate,
						isCurrentPosition: workItem.dateRange?.isCurrentPosition,
						dateFormat: workItem.dateRange?.dateFormat,
					},
				}
			: {
					company: '',
					position: '',
					location: '',
					description: '',
					achievements: [],
					dateRange: {
						startDate: new Date(),
						endDate: undefined,
						isCurrentPosition: false,
						dateFormat: 'month-year',
					},
				},
		mode: 'onChange',
	});

	// Update form values when props change
	useEffect(() => {
		setValue('dateRange.isCurrentPosition', isCurrentPosition);
		setValue('dateRange.dateFormat', dateFormat);
	}, [isCurrentPosition, dateFormat, setValue]);

	function handleFormSubmit(formData: TWorkItemForm) {
		const workItemData = workItem
			? {
					...workItem,
					...formData,
					achievements: achievements.filter((a) => a.trim() !== ''),
					dateRange: {
						...formData.dateRange,
						isCurrentPosition,
						dateFormat,
					},
					updatedAt: new Date(),
				}
			: createEntity<TWorkItem>({
					...formData,
					achievements: achievements.filter((a) => a.trim() !== ''),
					dateRange: {
						...formData.dateRange,
						isCurrentPosition,
						dateFormat,
					},
				});

		onSave(workItemData);
	}

	function handleAddAchievement() {
		setAchievements([...achievements, '']);
	}

	function handleUpdateAchievement(index: number, value: string) {
		const updated = [...achievements];
		updated[index] = value;
		setAchievements(updated);
	}

	function handleRemoveAchievement(index: number) {
		setAchievements(achievements.filter((_, i) => i !== index));
	}

	function handleCurrentPositionToggle(checked: boolean) {
		setIsCurrentPosition(checked);
		if (checked) {
			setValue('dateRange.endDate', undefined);
		}
	}

	function handleDelete() {
		if (workItem && onDelete) {
			onDelete(workItem.id);
		}
	}

	return (
		<Card className='border-border bg-card'>
			<CardHeader className='pb-6'>
				<div className='flex items-center justify-between'>
					<CardTitle className='text-lg text-card-foreground flex items-center gap-2'>
						<Building className='h-5 w-5 text-primary' />
						{workItem ? 'Edit Work Experience' : 'Add New Experience'}
					</CardTitle>
					<div className='flex items-center gap-2'>
						{workItem && onDelete && (
							<Button
								variant='destructive'
								size='sm'
								onClick={handleDelete}
								className='gap-2'
							>
								<Trash2 className='h-4 w-4' />
								Delete
							</Button>
						)}
						<Button variant='ghost' size='sm' onClick={onCancel} className='gap-2'>
							<X className='h-4 w-4' />
							Cancel
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit(handleFormSubmit as any)} className='space-y-6'>
					<FormGrid columns={2}>
						<FormField
							label='Company'
							type='text'
							placeholder='e.g., Google, Microsoft, Meta'
							required
							{...register('company')}
							error={errors.company?.message}
							hasError={Boolean(errors.company)}
						/>

						<FormField
							label='Position'
							type='text'
							placeholder='e.g., Senior Software Engineer'
							required
							{...register('position')}
							error={errors.position?.message}
							hasError={Boolean(errors.position)}
						/>
					</FormGrid>

					<FormField
						label='Location'
						type='text'
						placeholder='San Francisco, CA'
						required
						{...register('location')}
						error={errors.location?.message}
						hasError={Boolean(errors.location)}
					/>

					<div className='space-y-4 p-4 border border-border rounded-lg bg-muted/20'>
						<div className='flex items-center justify-between'>
							<Label className='text-sm font-medium flex items-center gap-2'>
								<Calendar className='h-4 w-4 text-primary' />
								Employment Period
							</Label>
							<div className='flex items-center space-x-2'>
								<Switch
									id='current-position'
									checked={isCurrentPosition}
									onCheckedChange={handleCurrentPositionToggle}
								/>
								<Label
									htmlFor='current-position'
									className='text-sm text-muted-foreground'
								>
									This is my current job
								</Label>
							</div>
						</div>

						<div className='space-y-4'>
							<div>
								<Label className='text-sm font-medium mb-2 block'>
									Date Format
								</Label>
								<Select
									value={dateFormat}
									onValueChange={(value: 'year' | 'month-year' | 'full-date') =>
										setDateFormat(value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='month-year'>Month & Year</SelectItem>
										<SelectItem value='year'>Year Only</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<FormGrid columns={2}>
								<div className='space-y-2'>
									<Label className='text-sm font-medium'>Start Date *</Label>
									<Input
										type={dateFormat === 'month-year' ? 'month' : 'number'}
										placeholder={
											dateFormat === 'month-year' ? '2023-01' : '2023'
										}
										{...register('dateRange.startDate', {
											setValueAs: (value) => {
												if (!value) return new Date();
												if (dateFormat === 'month-year') {
													return new Date(`${value}-01`);
												}
												return new Date(`${value}-01-01`);
											},
										})}
									/>
								</div>

								{!isCurrentPosition && (
									<div className='space-y-2'>
										<Label className='text-sm font-medium'>End Date</Label>
										<Input
											type={dateFormat === 'month-year' ? 'month' : 'number'}
											placeholder={
												dateFormat === 'month-year' ? '2024-01' : '2024'
											}
											{...register('dateRange.endDate', {
												setValueAs: (value) => {
													if (!value) return undefined;
													if (dateFormat === 'month-year') {
														return new Date(`${value}-01`);
													}
													return new Date(`${value}-01-01`);
												},
											})}
										/>
									</div>
								)}
							</FormGrid>
						</div>
					</div>

					<div className='space-y-2'>
						<Label className='text-sm font-medium'>Job Description *</Label>
						<Textarea
							placeholder='Describe your role, responsibilities, and key contributions...'
							className='min-h-[100px]'
							{...register('description')}
						/>
						{errors.description && (
							<p className='text-sm text-destructive'>{errors.description.message}</p>
						)}
					</div>

					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Label className='text-sm font-medium'>Key Achievements</Label>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={handleAddAchievement}
								className='gap-2 bg-transparent'
							>
								<Plus className='h-4 w-4' />
								Add Achievement
							</Button>
						</div>

						<AnimatePresence>
							{achievements.map((achievement, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className='flex gap-2'
								>
									<Input
										placeholder='Increased team productivity by 25% through process optimization...'
										value={achievement}
										onChange={(e) =>
											handleUpdateAchievement(index, e.target.value)
										}
										className='flex-1'
									/>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => handleRemoveAchievement(index)}
										className='text-muted-foreground hover:text-destructive'
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</motion.div>
							))}
						</AnimatePresence>

						{achievements.length === 0 && (
							<p className='text-sm text-muted-foreground italic text-center py-4 border border-dashed border-border rounded-lg'>
								No achievements added yet. Click "Add Achievement" to showcase your
								impact.
							</p>
						)}
					</div>

					<div className='flex justify-end pt-6 border-t border-border'>
						<Button
							type='submit'
							className='px-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-2'
						>
							<Save className='h-4 w-4' />
							{workItem ? 'Update' : 'Add'} Experience
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
