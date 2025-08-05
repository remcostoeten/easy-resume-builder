'use client';

import { FormFieldSkeleton } from './form-field-skeleton';
import { FormSectionSkeleton } from './form-section-skeleton';
import { SkeletonIcon, SkeletonText } from './skeleton-factory';

export function PersonalInfoSkeleton() {
	return (
		<FormSectionSkeleton isRequired titleWidth='long'>
			<form className='space-y-6'>
				{/* First Row - First Name & Last Name */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormFieldSkeleton required labelWidth='medium' />
					<FormFieldSkeleton required labelWidth='medium' />
				</div>

				{/* Second Row - Email & Phone */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormFieldSkeleton type='email' required labelWidth='short' />
					<FormFieldSkeleton type='tel' required labelWidth='short' />
				</div>

				{/* Third Row - Location & Job Title */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormFieldSkeleton required labelWidth='medium' />
					<FormFieldSkeleton labelWidth='medium' />
				</div>

				{/* Fourth Row - Website, Portfolio, LinkedIn */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<FormFieldSkeleton type='url' labelWidth='medium' />
					<FormFieldSkeleton type='url' labelWidth='medium' />
					<FormFieldSkeleton type='url' labelWidth='medium' />
				</div>

				{/* Fifth Row - GitHub, Twitter */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormFieldSkeleton type='url' labelWidth='medium' />
					<FormFieldSkeleton type='url' labelWidth='medium' />
				</div>

				{/* Professional Summary */}
				<FormFieldSkeleton type='textarea' labelWidth='long' />

				{/* Save Status and Button - matches the border-t styling */}
				<div className='flex justify-between items-center pt-4 border-t'>
					<div className='flex items-center gap-2 text-sm'>
						<SkeletonIcon className='h-4 w-4' />
						<SkeletonText className='h-4 w-32' />
					</div>
				</div>
			</form>
		</FormSectionSkeleton>
	);
}
