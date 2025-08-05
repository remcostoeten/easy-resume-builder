'use client';

import { FormSectionSkeleton } from './form-section-skeleton';
import { SkeletonTitle, SkeletonText, SkeletonButton, SkeletonBadge, SkeletonAvatar } from './skeleton-factory';
import { Card, CardContent } from '@/shared/components/ui/card';

type TProps = {
	readonly cardCount?: number;
	readonly showAddButton?: boolean;
	readonly showEmptyState?: boolean;
};

export function SkillsSkeleton({ 
	cardCount = 2, 
	showAddButton = true, 
	showEmptyState = false 
}: TProps) {
	if (showEmptyState) {
		return (
			<FormSectionSkeleton titleWidth="medium">
				<div className="flex flex-col items-center justify-center py-12 space-y-4">
					<SkeletonAvatar className="h-16 w-16" />
					<SkeletonTitle className="w-48 h-6" />
					<div className="space-y-2 text-center">
						<SkeletonText className="w-96 h-4" />
						<SkeletonText className="w-80 h-4" />
					</div>
					<SkeletonButton className="w-36 h-10" />
				</div>
			</FormSectionSkeleton>
		);
	}

	return (
		<FormSectionSkeleton titleWidth="medium">
			<div className="space-y-6">
				{Array.from({ length: cardCount }).map((_, index) => (
					<Card key={index} className="hover:shadow-md transition-shadow">
						<CardContent className="p-4">
							<div className="flex items-start justify-between">
								<div className="flex-1 space-y-3">
									<div className="flex items-center gap-2">
										<SkeletonTitle className="w-48 h-5" />
										<SkeletonBadge className="w-16 h-5" />
									</div>
									<div className="grid gap-3">
										{Array.from({ length: 3 }).map((_, i) => (
											<div key={i} className="flex items-center justify-between">
												<span className="text-sm font-medium">
													<SkeletonText className="w-48 h-4" />
												</span>
												<SkeletonBadge className="w-16 h-4" />
											</div>
										))}
									</div>
								</div>
								<SkeletonButton className="w-8 h-8 opacity-0" />
							</div>
						</CardContent>
					</Card>
				))}

				{showAddButton && (
					<SkeletonButton className="w-full h-12 flex items-center justify-center gap-2 bg-transparent border border-dashed" />
				)}
			</div>
		</FormSectionSkeleton>
	);
}
