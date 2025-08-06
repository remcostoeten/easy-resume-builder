type TPersonalInfo = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	location: string;
	summary: string;
};

type TWorkItemRaw = {
	id: string;
	company: string;
	position: string;
	startDate: string;
	endDate: string;
	description: string;
	isCurrent: boolean;
};

type TEducationItemRaw = {
	id: string;
	institution: string;
	degree: string;
	field: string;
	startDate: string;
	endDate: string;
	gpa: string;
};

type TSkillRaw = {
	id: string;
	name: string;
	level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
};

type TExtractedResumeData = {
	personalInfo: TPersonalInfo;
	workExperience: TWorkItemRaw[];
	education: TEducationItemRaw[];
	skills: TSkillRaw[];
};

export type {
	TPersonalInfo,
	TWorkItemRaw,
	TEducationItemRaw,
	TSkillRaw,
	TExtractedResumeData,
};
