'use client';

import { FormSectionSkeleton } from './form-section-skeleton';
import { FormFieldSkeleton } from './form-field-skeleton';
import { SkeletonButton, SkeletonText } from './skeleton-factory';

export function PersonalInfoSkeleton() {
	return (
		<FormSectionSkeleton isRequired titleWidth="long">
			<form className="space-y-6">
				{/* First row - First Name, Last Name */}
				<div className="grid grid-cols-2 gap-4">
					<FormFieldSkeleton required labelWidth="medium" />
					<FormFieldSkeleton required labelWidth="medium" />
				</div>

				{/* Second row - Email, Phone */}
				<div className="grid grid-cols-2 gap-4">
					<FormFieldSkeleton type="email" required labelWidth="short" />
					<FormFieldSkeleton type="tel" required labelWidth="short" />
				</div>

				{/* Location */}
				<FormFieldSkeleton required labelWidth="medium" />

				{/* Third row - Website, LinkedIn, GitHub */}
				<div className="grid grid-cols-3 gap-4">
					<FormFieldSkeleton type="url" labelWidth="medium" />
					<FormFieldSkeleton type="url" labelWidth="medium" />
					<FormFieldSkeleton type="url" labelWidth="medium" />
				</div>

				{/* Professional Summary */}
				<FormFieldSkeleton type="textarea" labelWidth="long" />

				{/* Action buttons and status */}
				<div className="flex justify-between items-center pt-4">
					<div className="flex items-center gap-2">
						<SkeletonText className="h-4 w-32" />
					</div>
					<div className="flex gap-2">
						<SkeletonButton className="w-28" />
						<SkeletonButton className="w-32" />
					</div>
				</div>
			</form>
		</FormSectionSkeleton>
	);
}
