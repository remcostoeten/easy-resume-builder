import type { TEntityBase } from './base';

export type TPersonalInfo = TEntityBase & {
	readonly firstName: string;
	readonly lastName: string;
	readonly email: string;
	readonly phone: string;
	readonly location: string;
	readonly website?: string;
	readonly linkedin?: string;
	readonly github?: string;
	readonly summary?: string;
};

export type TDateRange = {
	readonly startDate: Date;
	readonly endDate?: Date;
	readonly isCurrentPosition: boolean;
	readonly dateFormat: 'year' | 'month-year' | 'full-date';
};

export type TWorkItem = TEntityBase & {
	readonly company: string;
	readonly position: string;
	readonly location: string;
	readonly dateRange: TDateRange;
	readonly description: string;
	readonly achievements: readonly string[];
};

export type TSkillProficiency = {
	readonly level: number; // 1-5 or 1-10
	readonly showLevel: boolean;
	readonly displayType: 'bar' | 'dots' | 'text';
};

export type TSkill = TEntityBase & {
	readonly name: string;
	readonly proficiency?: TSkillProficiency;
};

export type TSkillCategory = TEntityBase & {
	readonly name: string;
	readonly skills: readonly TSkill[];
	readonly showGroupLabel: boolean;
};

export type TEducationItem = TEntityBase & {
	readonly institution: string;
	readonly degree: string;
	readonly field: string;
	readonly location: string;
	readonly dateRange: TDateRange;
	readonly gpa?: string;
	readonly achievements: readonly string[];
};

export type TSectionType =
	| 'personal-info'
	| 'work-experience'
	| 'education'
	| 'skills'
	| 'projects'
	| 'certifications'
	| 'languages';

export type TResumeSection = TEntityBase & {
	type: TSectionType;
	title: string;
	isEnabled: boolean;
	order: number;
	isRequired: boolean;
};

export type TResumeData = TEntityBase & {
	readonly personalInfo: TPersonalInfo;
	readonly workExperience: readonly TWorkItem[];
	readonly education: readonly TEducationItem[];
	readonly skills: readonly TSkillCategory[];
	sections: TResumeSection[];
	readonly metadata: {
		readonly title: string;
		readonly template: string;
		readonly lastModified: Date;
	};
};
