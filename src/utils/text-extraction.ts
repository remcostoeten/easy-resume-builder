import type {
	TPersonalInfo,
	TWorkItem,
	TEducationItem,
	TSkillCategory,
	TSkill,
	TDateRange,
} from '../types/resume';
import type { TEntityBase } from '../types/base';

type TExtractedPersonalInfo = Omit<TPersonalInfo, keyof TEntityBase>;
type TExtractedWorkItem = Omit<TWorkItem, keyof TEntityBase>;
type TExtractedEducationItem = Omit<TEducationItem, keyof TEntityBase>;
type TExtractedSkillCategory = Omit<TSkillCategory, keyof TEntityBase | 'skills'> & {
	skills: readonly TExtractedSkill[];
};
type TExtractedSkill = Omit<TSkill, keyof TEntityBase>;

export type TExtractedResumeData = {
	personalInfo: TExtractedPersonalInfo;
	workExperience: readonly TExtractedWorkItem[];
	education: readonly TExtractedEducationItem[];
	skills: readonly TExtractedSkillCategory[];
};

export function extractPersonalInfo(text: string): TExtractedPersonalInfo {
	const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
	const phoneRegex = /(\+?[1-9]\d{1,14}|[0-9\-\(\)\s\.]{7,15})/;
	const linkedinRegex = /(?:linkedin\.com\/in\/([a-zA-Z0-9\-]+)|LinkedIn: ([a-zA-Z0-9\-]+))/i;
	const githubRegex = /(?:github\.com\/([a-zA-Z0-9\-]+)|GitHub: ([a-zA-Z0-9\-]+))/i;
	const websiteRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,})/;

	const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
	
	const email = text.match(emailRegex)?.[0] || '';
	const phone = text.match(phoneRegex)?.[0] || '';
	const linkedin = text.match(linkedinRegex)?.[1] || text.match(linkedinRegex)?.[2] || '';
	const github = text.match(githubRegex)?.[1] || text.match(githubRegex)?.[2] || '';
	const website = text.match(websiteRegex)?.[1] || '';

	const namePattern = /^([A-Z][a-zA-Z\s]+)$/;
	const possibleName = lines.find(line => namePattern.test(line) && line.length < 50);
	const [firstName = '', lastName = ''] = possibleName ? possibleName.split(' ') : ['', ''];

	return {
		firstName,
		lastName,
		email,
		phone,
		location: '',
		jobTitle: '',
		website,
		portfolio: '',
		linkedin,
		github,
		twitter: '',
		summary: '',
	};
}

export function extractWorkExperience(text: string): readonly TExtractedWorkItem[] {
	const workSectionRegex = /(?:work experience|experience|employment|professional experience)([\s\S]*?)(?:education|skills|projects|$)/i;
	const workSection = text.match(workSectionRegex)?.[1] || '';
	
	if (!workSection) return [];

	const jobBlocks = workSection.split(/\n\s*\n/).filter(block => block.trim().length > 20);
	
	return jobBlocks.map((block, index) => {
		const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
		
		const dateRange: TDateRange = {
			startDate: new Date(),
			endDate: undefined,
			isCurrentPosition: false,
			dateFormat: 'year' as const,
		};

		return {
			company: lines[1] || `Company ${index + 1}`,
			position: lines[0] || `Position ${index + 1}`,
			location: '',
			dateRange,
			description: lines.slice(2).join(' ') || '',
			achievements: [],
		};
	});
}

export function extractEducation(text: string): readonly TExtractedEducationItem[] {
	const educationSectionRegex = /(?:education|academic|qualifications)([\s\S]*?)(?:skills|experience|projects|$)/i;
	const educationSection = text.match(educationSectionRegex)?.[1] || '';
	
	if (!educationSection) return [];

	const educationBlocks = educationSection.split(/\n\s*\n/).filter(block => block.trim().length > 10);
	
	return educationBlocks.map((block, index) => {
		const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
		
		const dateRange: TDateRange = {
			startDate: new Date(),
			endDate: new Date(),
			isCurrentPosition: false,
			dateFormat: 'year' as const,
		};

		return {
			institution: lines[1] || `Institution ${index + 1}`,
			degree: lines[0] || `Degree ${index + 1}`,
			field: lines[2] || '',
			location: '',
			dateRange,
			gpa: '',
			achievements: [],
		};
	});
}

export function extractSkills(text: string): readonly TExtractedSkillCategory[] {
	const skillsSectionRegex = /(?:skills|technologies|technical skills|competencies)([\s\S]*?)(?:education|experience|projects|$)/i;
	const skillsSection = text.match(skillsSectionRegex)?.[1] || '';
	
	if (!skillsSection) return [];

	const skillText = skillsSection
		.split(/[,\n•\-\*]/)
		.map(skill => skill.trim())
		.filter(skill => skill.length > 1 && skill.length < 50);

	if (skillText.length === 0) return [];

	return [
		{
			name: 'Technical Skills',
			skills: skillText.map(name => ({
				name,
				proficiency: undefined,
			})),
			showGroupLabel: true,
		},
	];
}
