'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { SkeletonText, SkeletonTitle, SkeletonBadge, SkeletonIcon, SkeletonButton } from './skeleton-factory';

type TProps = {
	readonly showCurrentBadge?: boolean;
	readonly achievementCount?: number;
};

export function WorkExperienceCardSkeleton({ 
	showCurrentBadge = false,
	achievementCount = 2
}: TProps) {
	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardContent className="p-4">
				<div className="flex items-start justify-between">
					<div className="flex-1 space-y-2">
						{/* Position title and current badge */}
						<div className="flex items-center gap-2">
							<SkeletonTitle className="w-48 h-6" />
							{showCurrentBadge && (
								<SkeletonBadge className="h-5 w-16" />
							)}
						</div>

						{/* Company, Location, Date info */}
						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-1">
								<SkeletonIcon className="h-4 w-4" />
								<SkeletonText className="w-32 h-4" />
							</div>
							<div className="flex items-center gap-1">
								<SkeletonIcon className="h-4 w-4" />
								<SkeletonText className="w-24 h-4" />
							</div>
							<div className="flex items-center gap-1">
								<SkeletonIcon className="h-4 w-4" />
								<SkeletonText className="w-28 h-4" />
							</div>
						</div>

						{/* Description */}
						<div className="space-y-1">
							<SkeletonText className="w-full h-4" />
							<SkeletonText className="w-3/4 h-4" />
						</div>

						{/* Key achievements */}
						{achievementCount > 0 && (
							<div className="space-y-1">
								<SkeletonText className="w-32 h-3" />
								<div className="space-y-1">
									{Array.from({ length: achievementCount }).map((_, idx) => (
										<div key={idx} className="flex items-start gap-2">
											<SkeletonText className="w-1 h-3 mt-1.5" />
											<SkeletonText className="flex-1 h-4" />
										</div>
									))}
									{achievementCount > 2 && (
										<SkeletonText className="w-40 h-3" />
									)}
								</div>
							</div>
						)}
					</div>

					{/* Edit button */}
					<SkeletonButton className="w-8 h-8 opacity-0" />
				</div>
			</CardContent>
		</Card>
	);
}
