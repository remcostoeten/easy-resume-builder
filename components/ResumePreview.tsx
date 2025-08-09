"use client"

import type React from "react"

// Keep this as a leaf client component used only in preview tab
export type TPersonalInfo = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
  photo?: string
}

export type TWorkExperience = {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export type TEducation = {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
}

export type TProject = {
  id: string
  name: string
  description: string
  technologies: string[]
  link?: string
}

export type TResumeData = {
  personalInfo: TPersonalInfo
  summary: string
  workExperience: TWorkExperience[]
  education: TEducation[]
  skills: string[]
  projects: TProject[]
}

export default function ResumePreview({ data }: { data: TResumeData }) {
  return (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" style={{ minHeight: "11in" }}>
      <div className="flex items-start gap-6 mb-8 pb-6 border-b-2 border-gray-300">
        {data.personalInfo.photo && (
          <div className="flex-shrink-0">
            <img
              src={data.personalInfo.photo || "/placeholder.svg"}
              alt={data.personalInfo.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.name}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{data.personalInfo.title}</h2>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              📧{" "}
              <a href={`mailto:${data.personalInfo.email}`} className="text-blue-600 hover:underline">
                {data.personalInfo.email}
              </a>
            </div>
            <div>📱 {data.personalInfo.phone}</div>
            <div>📍 {data.personalInfo.location}</div>
            <div>
              🌐{" "}
              <a
                href={`https://${data.personalInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {data.personalInfo.website}
              </a>
            </div>
            <div>
              💼{" "}
              <a
                href={data.personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {data.personalInfo.linkedin}
              </a>
            </div>
            <div>
              💻{" "}
              <a
                href={`https://${data.personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {data.personalInfo.github}
              </a>
            </div>
          </div>
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.workExperience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Work Experience</h3>
          {data.workExperience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-900">
                  {exp.position} - {exp.company}
                </h4>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{exp.location}</div>
              <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Education</h3>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h4>
                  <div className="text-sm text-gray-600">{edu.institution}</div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>
                    {edu.startDate} - {edu.endDate}
                  </div>
                  {edu.gpa && <div>GPA: {edu.gpa}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.projects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Projects</h3>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-1">
                {project.name}
                {project.link && (
                  <span className="text-sm ml-2">
                    (
                    <a
                      href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {project.link}
                    </a>
                    )
                  </span>
                )}
              </h4>
              <p className="text-gray-700 text-sm mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

