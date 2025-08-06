import type {
	TPersonalInfo,
	TWorkItemRaw,
	TEducationItemRaw,
	TSkillRaw,
} from '../types/extracted-data';

function extractPersonalInfo(text: string): TPersonalInfo {
	const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
	const phoneRegex = /(?:\+?1[-.\\s]?)?\(?([0-9]{3})\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})/;

	const email = text.match(emailRegex)?.[0] || '';
	const phone = text.match(phoneRegex)?.[0] || '';

	const lines = text.split('\n').filter((line) => line.trim());
	const firstLine = lines[0] || '';
	const nameParts = firstLine.split(/\s+/);

	const firstName = nameParts[0] || '';
	const lastName = nameParts.slice(1).join(' ') || '';

	const locationKeywords = ['address', 'location', 'city', 'state'];
	const locationLine =
		lines.find((line) =>
			locationKeywords.some((keyword) => line.toLowerCase().includes(keyword))
		) || '';

	const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
	const summaryIndex = lines.findIndex((line) =>
		summaryKeywords.some((keyword) => line.toLowerCase().includes(keyword))
	);

	let summary = '';
	if (summaryIndex !== -1) {
		const summaryLines = lines.slice(summaryIndex + 1, summaryIndex + 4);
		summary = summaryLines.join(' ').trim();
	}

	return {
		firstName,
		lastName,
		email,
		phone,
		location: locationLine.replace(/address|location|city|state/gi, '').trim(),
		summary,
	};
}

function extractWorkExperience(text: string): TWorkItemRaw[] {
	const experienceKeywords = [
		'experience',
		'employment',
		'work history',
		'professional experience',
	];
	const lines = text.split('\n').filter((line) => line.trim());

	const experienceIndex = lines.findIndex((line) =>
		experienceKeywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()))
	);

	if (experienceIndex === -1) return [];

	const experienceSection = lines.slice(experienceIndex + 1);
	const workExperience: TWorkItemRaw[] = [];

	let currentJob: TWorkItemRaw | null = null;
	let id = 1;

	for (const line of experienceSection) {
		const trimmedLine = line.trim();
		if (!trimmedLine) continue;

		if (
			trimmedLine.toLowerCase().includes('education') ||
			trimmedLine.toLowerCase().includes('skills') ||
			trimmedLine.toLowerCase().includes('certifications')
		) {
			break;
		}

		const dateMatch = trimmedLine.match(/\b(20\d{2}|19\d{2})\b/);
		const companyIndicators = /\b(inc|llc|corp|company|ltd|limited)\b/i;

		if (dateMatch || companyIndicators.test(trimmedLine)) {
			if (currentJob) {
				workExperience.push(currentJob);
			}

			const parts = trimmedLine.split(/[-–—]/);
			const company = parts[0]?.trim() || trimmedLine;
			const position = parts[1]?.trim() || '';

			currentJob = {
				id: `work-${id++}`,
				company: company.replace(companyIndicators, '').trim(),
				position,
				startDate: dateMatch?.[0] || '',
				endDate: '',
				description: '',
				isCurrent:
					trimmedLine.toLowerCase().includes('present') ||
					trimmedLine.toLowerCase().includes('current'),
			};
		} else if (currentJob && trimmedLine.length > 20) {
			currentJob.description += (currentJob.description ? ' ' : '') + trimmedLine;
		}
	}

	if (currentJob) {
		workExperience.push(currentJob);
	}

	return workExperience;
}

function extractEducation(text: string): TEducationItemRaw[] {
	const educationKeywords = ['education', 'academic', 'degree', 'university', 'college'];
	const lines = text.split('\n').filter((line) => line.trim());

	const educationIndex = lines.findIndex((line) =>
		educationKeywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()))
	);

	if (educationIndex === -1) return [];

	const educationSection = lines.slice(educationIndex + 1);
	const education: TEducationItemRaw[] = [];

	let id = 1;
	const degreeKeywords = [
		'bachelor',
		'master',
		'phd',
		'doctorate',
		'associate',
		'diploma',
		'certificate',
	];

	for (const line of educationSection) {
		const trimmedLine = line.trim();
		if (!trimmedLine) continue;

		if (
			trimmedLine.toLowerCase().includes('experience') ||
			trimmedLine.toLowerCase().includes('skills')
		) {
			break;
		}

		const hasDegree = degreeKeywords.some((degree) =>
			trimmedLine.toLowerCase().includes(degree)
		);

		const dateMatch = trimmedLine.match(/\b(20\d{2}|19\d{2})\b/);

		if (hasDegree || dateMatch) {
			const parts = trimmedLine.split(/[-–—,]/);
			const institution = parts[0]?.trim() || '';
			const degreeInfo =
				parts
					.find((part) =>
						degreeKeywords.some((degree) => part.toLowerCase().includes(degree))
					)
					?.trim() || '';

			education.push({
				id: `edu-${id++}`,
				institution,
				degree: degreeInfo,
				field: '',
				startDate: '',
				endDate: dateMatch?.[0] || '',
				gpa: '',
			});
		}
	}

	return education;
}

function extractSkills(text: string): TSkillRaw[] {
	const skillsKeywords = ['skills', 'technical skills', 'competencies', 'technologies'];
	const lines = text.split('\n').filter((line) => line.trim());

	const skillsIndex = lines.findIndex((line) =>
		skillsKeywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()))
	);

	if (skillsIndex === -1) return [];

	const skillsSection = lines.slice(skillsIndex + 1, skillsIndex + 10);
	const skills: TSkillRaw[] = [];

	let id = 1;
	const commonSkills = [
		'javascript',
		'typescript',
		'python',
		'java',
		'react',
		'nodejs',
		'html',
		'css',
		'sql',
		'git',
		'docker',
		'aws',
		'azure',
		'kubernetes',
		'mongodb',
		'postgresql',
		'express',
		'nextjs',
		'vue',
		'angular',
		'php',
		'laravel',
		'django',
		'flask',
	];

	for (const line of skillsSection) {
		const trimmedLine = line.trim().toLowerCase();
		if (!trimmedLine) continue;

		const foundSkills = commonSkills.filter((skill) =>
			trimmedLine.includes(skill.toLowerCase())
		);

		foundSkills.forEach((skill) => {
			skills.push({
				id: `skill-${id++}`,
				name: skill.charAt(0).toUpperCase() + skill.slice(1),
				level: 'intermediate' as const,
			});
		});

		const skillSeparators = /[,;|]/;
		if (skillSeparators.test(trimmedLine)) {
			const skillsList = trimmedLine.split(skillSeparators);
			skillsList.forEach((skillName) => {
				const cleanSkill = skillName.trim();
				if (cleanSkill.length > 2 && cleanSkill.length < 30) {
					skills.push({
						id: `skill-${id++}`,
						name: cleanSkill.charAt(0).toUpperCase() + cleanSkill.slice(1),
						level: 'intermediate' as const,
					});
				}
			});
		}
	}

	const uniqueSkills = skills.filter(
		(skill, index, self) =>
			index === self.findIndex((s) => s.name.toLowerCase() === skill.name.toLowerCase())
	);

	return uniqueSkills.slice(0, 15);
}

export { extractPersonalInfo, extractWorkExperience, extractEducation, extractSkills };
