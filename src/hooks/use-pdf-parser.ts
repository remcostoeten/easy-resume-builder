'use client';

import { useSetAtom } from 'jotai/react';
import { type Mutable, resumeAtom } from '@/store/resume-store';
import type { TExtractedResumeData } from '@/types/extracted-data';
import type { TEducationItem, TSkill, TWorkItem } from '@/types/resume';

export function usePdfParser() {
	const setResumeData = useSetAtom(resumeAtom);

	function handleExtractedData(extractedData: TExtractedResumeData) {
		setResumeData((currentData) => {
			const updatedData = { ...currentData };

			updatedData.personalInfo = {
				...updatedData.personalInfo,
				firstName:
					extractedData.personalInfo.firstName || updatedData.personalInfo.firstName,
				lastName: extractedData.personalInfo.lastName || updatedData.personalInfo.lastName,
				email: extractedData.personalInfo.email || updatedData.personalInfo.email,
				phone: extractedData.personalInfo.phone || updatedData.personalInfo.phone,
				location: extractedData.personalInfo.location || updatedData.personalInfo.location,
				summary: extractedData.personalInfo.summary || updatedData.personalInfo.summary,
			};

			if (extractedData.workExperience.length > 0) {
				updatedData.workExperience = [
					...updatedData.workExperience,
					...extractedData.workExperience.map(
						(exp) =>
							({
								id: exp.id,
								createdAt: new Date(),
								updatedAt: new Date(),
								company: exp.company,
								position: exp.position,
								location: '',
								dateRange: {
									startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
									endDate: exp.isCurrent
										? undefined
										: exp.endDate
											? new Date(exp.endDate)
											: undefined,
									isCurrentPosition: exp.isCurrent,
									dateFormat: 'month-year' as const,
								},
								description: exp.description,
								achievements: [],
							}) as Mutable<TWorkItem>
					),
				];
			}

			if (extractedData.education.length > 0) {
				updatedData.education = [
					...updatedData.education,
					...extractedData.education.map(
						(edu) =>
							({
								id: edu.id,
								createdAt: new Date(),
								updatedAt: new Date(),
								institution: edu.institution,
								degree: edu.degree,
								field: edu.field,
								location: '',
								dateRange: {
									startDate: edu.startDate ? new Date(edu.startDate) : new Date(),
									endDate: edu.endDate ? new Date(edu.endDate) : new Date(),
									isCurrentPosition: false,
									dateFormat: 'month-year' as const,
								},
								gpa: edu.gpa,
								achievements: [],
							}) as Mutable<TEducationItem>
					),
				];
			}

			if (extractedData.skills.length > 0) {
				// Create a default skills category
				const skillsCategory = {
					id: 'technical-skills',
					createdAt: new Date(),
					updatedAt: new Date(),
					name: 'Technical Skills',
					skills: extractedData.skills.map(
						(skill) =>
							({
								id: skill.id,
								createdAt: new Date(),
								updatedAt: new Date(),
								name: skill.name,
								proficiency: {
									level:
										skill.level === 'beginner'
											? 2
											: skill.level === 'intermediate'
												? 3
												: skill.level === 'advanced'
													? 4
													: 5,
									showLevel: true,
									displayType: 'bar' as const,
								},
							}) as Mutable<TSkill>
					),
					showGroupLabel: true,
				};
				updatedData.skills = [...updatedData.skills, skillsCategory];
			}

			const sectionsToEnable = ['personal-info'];
			if (extractedData.workExperience.length > 0) sectionsToEnable.push('work-experience');
			if (extractedData.education.length > 0) sectionsToEnable.push('education');
			if (extractedData.skills.length > 0) sectionsToEnable.push('skills');

			updatedData.sections = updatedData.sections.map((section) => ({
				...section,
				isEnabled: sectionsToEnable.includes(section.id) || section.isEnabled,
			}));

			return updatedData;
		});
	}

	function handleParsingError(error: string) {
		console.error('PDF parsing error:', error);
	}

	return {
		handleExtractedData,
		handleParsingError,
	};
}
