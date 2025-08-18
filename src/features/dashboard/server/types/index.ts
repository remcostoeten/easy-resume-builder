export type TQuickStats = {
	totalResumes: number;
	lastEditedDate: Date | null;
	profileCompletionPercentage: number;
};

export type TStatCard = {
	title: string;
	value: string | number;
	icon?: React.ReactNode;
	description?: string;
};
