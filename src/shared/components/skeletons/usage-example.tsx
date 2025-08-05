// USAGE EXAMPLES - Remove this file after integration

'use client';

import { SectionSkeleton } from './section-skeleton';
import { PersonalInfoSkeleton, WorkExperienceSkeleton } from './index';

// Example 1: Enhanced SectionRenderer with loading states
export function EnhancedSectionRenderer({ section, resumeData, isLoading }: {
	readonly section: any;
	readonly resumeData: any;
	readonly isLoading?: boolean;
}) {
	// Show skeleton while loading
	if (isLoading) {
		return <SectionSkeleton sectionType={section.type} />;
	}

	// Regular section rendering...
	return <div>Your actual section content</div>;
}

// Example 2: Individual section with loading state
export function PersonalInfoWithSkeleton({ data, isLoading }: {
	readonly data: any;
	readonly isLoading?: boolean;
}) {
	if (isLoading) {
		return <PersonalInfoSkeleton />;
	}

	// Your actual PersonalInfoSection component
	return <div>PersonalInfoSection content</div>;
}

// Example 3: Work experience with dynamic card count
export function WorkExperienceWithSkeleton({ data, isLoading }: {
	readonly data: any[];
	readonly isLoading?: boolean;
}) {
	if (isLoading) {
		// Show skeleton with estimated card count
		const estimatedCount = data?.length || 2;
		return <WorkExperienceSkeleton cardCount={estimatedCount} />;
	}

	// Your actual WorkExperienceSection component
	return <div>WorkExperienceSection content</div>;
}

// Example 4: Usage in a loading wrapper
export function LoadingWrapper({ 
	children, 
	isLoading, 
	sectionType, 
	fallback 
}: {
	readonly children: React.ReactNode;
	readonly isLoading: boolean;
	readonly sectionType?: any;
	readonly fallback?: React.ReactNode;
}) {
	if (isLoading) {
		if (fallback) return <>{fallback}</>;
		if (sectionType) return <SectionSkeleton sectionType={sectionType} />;
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}

/*
INTEGRATION STEPS:

1. Import the skeletons:
   import { PersonalInfoSkeleton, SectionSkeleton } from '@/shared/components/skeletons';

2. Add loading state to your component:
   const [isLoading, setIsLoading] = useState(true);

3. Show skeleton while loading:
   if (isLoading) return <PersonalInfoSkeleton />;

4. For dynamic content, use appropriate props:
   <WorkExperienceSkeleton cardCount={data.length || 2} />

5. For section renderer:
   <SectionSkeleton sectionType={section.type} isLoading={isLoading} />
*/
