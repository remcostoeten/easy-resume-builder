import { User, Briefcase, GraduationCap, Code, FolderOpen, Award, Languages } from 'lucide-react';
import type { TSectionType } from '../types/resume';

export type TSectionMetadata = {
	readonly type: TSectionType;
	readonly title: string;
	readonly icon: typeof User;
	readonly isRequired: boolean;
	readonly defaultOrder: number;
	readonly description: string;
};

export const SECTION_CONFIGS: Record<TSectionType, TSectionMetadata> = {
	'personal-info': {
		type: 'personal-info',
		title: 'Personal Information',
		icon: User,
		isRequired: true,
		defaultOrder: 0,
		description: 'Basic contact information and summary',
	},
	'work-experience': {
		type: 'work-experience',
		title: 'Work Experience',
		icon: Briefcase,
		isRequired: false,
		defaultOrder: 1,
		description: 'Professional work history and achievements',
	},
	education: {
		type: 'education',
		title: 'Education',
		icon: GraduationCap,
		isRequired: false,
		defaultOrder: 2,
		description: 'Academic background and qualifications',
	},
	skills: {
		type: 'skills',
		title: 'Skills',
		icon: Code,
		isRequired: false,
		defaultOrder: 3,
		description: 'Technical and professional skills',
	},
	projects: {
		type: 'projects',
		title: 'Projects',
		icon: FolderOpen,
		isRequired: false,
		defaultOrder: 4,
		description: 'Personal and professional projects',
	},
	certifications: {
		type: 'certifications',
		title: 'Certifications',
		icon: Award,
		isRequired: false,
		defaultOrder: 5,
		description: 'Professional certifications and licenses',
	},
	languages: {
		type: 'languages',
		title: 'Languages',
		icon: Languages,
		isRequired: false,
		defaultOrder: 6,
		description: 'Language proficiencies',
	},
};
