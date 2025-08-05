'use client';

import { FormSectionSkeleton } from './form-section-skeleton';
import { WorkExperienceCardSkeleton } from './work-experience-card-skeleton';
import { SkeletonButton } from './skeleton-factory';

type TProps = {
	readonly cardCount?: number;
	readonly showAddButton?: boolean;
};

export function WorkExperienceSkeleton({ 
	cardCount = 2, 
	showAddButton = true 
}: TProps) {
	return (
		<FormSectionSkeleton titleWidth="long">
			<div className="space-y-6">
				<div className="space-y-4">
					{Array.from({ length: cardCount }).map((_, index) => (
						<WorkExperienceCardSkeleton 
							key={index}
							showCurrentBadge={index === 0} // First item shows current badge
							achievementCount={index === 0 ? 3 : 2} // First item has more achievements
						/>
					))}
					
					{showAddButton && cardCount > 0 && (
						<SkeletonButton className="w-full h-12 flex items-center justify-center gap-2 bg-transparent border border-dashed" />
					)}
				</div>
			</div>
		</FormSectionSkeleton>
	);
}
