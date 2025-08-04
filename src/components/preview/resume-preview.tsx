'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { formatDateRange } from '../../utils/date-utils';
import type { TResumeData } from '../../types/resume';

export type TResumePreviewProps = {
	readonly resumeData: TResumeData;
};

export function ResumePreview({ resumeData }: TResumePreviewProps) {
	const { personalInfo, workExperience, skills, sections } = resumeData;
	const enabledSections = sections
		.filter((section) => section.isEnabled)
		.sort((a, b) => a.order - b.order);

	const hasPersonalInfo = personalInfo.firstName || personalInfo.lastName || personalInfo.email;

	function renderSkillProficiency(skill: any) {
		if (!skill.proficiency?.showLevel) return null;

		const { level, displayType } = skill.proficiency;

		switch (displayType) {
			case 'bar':
				return <Progress value={(level / 10) * 100} className="h-2 w-20" />;
			case 'dots':
				return (
					<div className="flex gap-1">
						{Array.from({ length: 5 }, (_, i) => (
							<div
								key={i}
								className={`w-1.5 h-1.5 rounded-full ${i < Math.ceil(level / 2) ? 'bg-gray-800' : 'bg-gray-300'}`}
							/>
						))}
					</div>
				);
			case 'text':
				return (
					<span className="text-xs text-gray-600">
						{level <= 3
							? 'Beginner'
							: level <= 6
								? 'Intermediate'
								: level <= 8
									? 'Advanced'
									: 'Expert'}
					</span>
				);
			default:
				return null;
		}
	}

	return (
		<div className="w-full bg-white text-black p-8 space-y-6">
			<AnimatePresence>
				{hasPersonalInfo && (
					<motion.header
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="text-center space-y-4"
					>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								{personalInfo.firstName} {personalInfo.lastName}
							</h1>
							{personalInfo.summary && (
								<p className="text-gray-600 mt-2 max-w-2xl mx-auto leading-relaxed">
									{personalInfo.summary}
								</p>
							)}
						</div>

						<div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
							{personalInfo.email && (
								<div className="flex items-center gap-1">
									<Mail className="h-4 w-4" />
									<span>{personalInfo.email}</span>
								</div>
							)}
							{personalInfo.phone && (
								<div className="flex items-center gap-1">
									<Phone className="h-4 w-4" />
									<span>{personalInfo.phone}</span>
								</div>
							)}
							{personalInfo.location && (
								<div className="flex items-center gap-1">
									<MapPin className="h-4 w-4" />
									<span>{personalInfo.location}</span>
								</div>
							)}
							{personalInfo.website && (
								<div className="flex items-center gap-1">
									<Globe className="h-4 w-4" />
									<span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
								</div>
							)}
							{personalInfo.linkedin && (
								<div className="flex items-center gap-1">
									<Linkedin className="h-4 w-4" />
									<span>LinkedIn</span>
								</div>
							)}
							{personalInfo.github && (
								<div className="flex items-center gap-1">
									<Github className="h-4 w-4" />
									<span>GitHub</span>
								</div>
							)}
						</div>
					</motion.header>
				)}
			</AnimatePresence>

			{hasPersonalInfo && enabledSections.length > 1 && <Separator />}

			<div className="space-y-6">
				<AnimatePresence>
					{enabledSections
						.filter((section) => section.type !== 'personal-info')
						.map((section, index) => (
							<motion.section
								key={section.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ delay: index * 0.1 }}
								className="space-y-4"
							>
								<h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
									{section.title}
								</h2>

								<div className="space-y-4">
									{section.type === 'work-experience' && (
										<>
											{workExperience.length === 0 ? (
												<p className="text-gray-500 italic">
													No work experience added yet.
												</p>
											) : (
												workExperience.map((item) => (
													<div key={item.id} className="space-y-2">
														<div className="flex items-start justify-between">
															<div>
																<h3 className="font-semibold text-gray-900">
																	{item.position}
																</h3>
																<div className="flex items-center gap-2 text-gray-700">
																	<Building className="h-4 w-4" />
																	<span>{item.company}</span>
																</div>
															</div>
															<div className="text-right text-sm text-gray-600">
																<div className="flex items-center gap-1">
																	<Calendar className="h-3 w-3" />
																	<span>
																		{formatDateRange(
																			item.dateRange
																		)}
																	</span>
																</div>
																<div className="flex items-center gap-1 mt-1">
																	<MapPin className="h-3 w-3" />
																	<span>{item.location}</span>
																</div>
															</div>
														</div>
														<p className="text-gray-600 text-sm leading-relaxed">
															{item.description}
														</p>
														{item.achievements.length > 0 && (
															<ul className="text-sm text-gray-600 space-y-1 ml-4">
																{item.achievements.map(
																	(achievement, idx) => (
																		<li
																			key={idx}
																			className="flex items-start gap-2"
																		>
																			<span className="text-gray-400 mt-1.5 text-xs">
																				•
																			</span>
																			<span>
																				{achievement}
																			</span>
																		</li>
																	)
																)}
															</ul>
														)}
													</div>
												))
											)}
										</>
									)}

									{section.type === 'skills' && (
										<>
											{skills.length === 0 ? (
												<p className="text-gray-500 italic">
													No skills added yet.
												</p>
											) : (
												<div className="space-y-4">
													{skills.map((category) => (
														<div
															key={category.id}
															className="space-y-2"
														>
															{category.showGroupLabel && (
																<h3 className="font-medium text-gray-800">
																	{category.name}
																</h3>
															)}
															<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
																{category.skills.map((skill) => (
																	<div
																		key={skill.id}
																		className="flex items-center justify-between"
																	>
																		<span className="text-sm text-gray-700">
																			{skill.name}
																		</span>
																		{renderSkillProficiency(
																			skill
																		)}
																	</div>
																))}
															</div>
														</div>
													))}
												</div>
											)}
										</>
									)}

									{section.type === 'education' &&
										resumeData.education.length === 0 && (
											<p className="text-gray-500 italic">
												No education added yet.
											</p>
										)}

									{(section.type === 'projects' ||
										section.type === 'certifications' ||
										section.type === 'languages') && (
										<p className="text-gray-500 italic">
											This section is coming soon.
										</p>
									)}
								</div>
							</motion.section>
						))}
				</AnimatePresence>
			</div>

			{enabledSections.length === 0 && (
				<div className="text-center py-12 text-gray-500">
					<p>Enable sections from the sidebar to see your resume preview.</p>
				</div>
			)}
		</div>
	);
}
