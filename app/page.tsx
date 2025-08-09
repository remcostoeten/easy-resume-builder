"use client"

import type React from "react"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Plus, Trash2, Edit3, Upload, Eye, User } from "lucide-react"
import ResumePreview from "@/components/ResumePreview"

type TPersonalInfo = {
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

type TWorkExperience = {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  description: string
}

type TEducation = {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
}

type TProject = {
  id: string
  name: string
  description: string
  technologies: string[]
  link?: string
}

type TResumeData = {
  personalInfo: TPersonalInfo
  summary: string
  workExperience: TWorkExperience[]
  education: TEducation[]
  skills: string[]
  projects: TProject[]
}

export default function ResumeEditor() {
  // Default resume data
  const defaultResumeData: TResumeData = {
    personalInfo: {
      name: "Remco Stoeten",
      title: "Front-end Engineer",
      email: "remco@example.com",
      phone: "+31 6 36 59 07 07",
      location: "Lemmer, the Netherlands, CET",
      website: "remcostoeten.nl",
      linkedin: "https://linkedin.com/in/remco-stoeten",
      github: "github.com/remcostoeten",
    },
    summary:
      "Front-end engineer with a degree in graphic design. Aspiring to be more than a styles archiver. Front-end engineer with a college degree in Graphic Design. Loads of experience in e-commerce (Magento 1 & 2) and SaaS platforms (primarily React, Next.js, TypeScript). Prefer writing in modern web stack (Next.js, TypeScript, TailwindCSS - at last, for hobby projects) - Obsessed with DX experience, automating tasks and creating intuitive CLI tools or scripts to enhance DX and productivity - and just as important, having fun. Experienced in various team environments from agile/scrum to fully remote. Currently focused on government/non-profit sector while expanding into full-stack development and DevOps.",
    workExperience: [
      {
        id: "1",
        company: "Exact Online",
        position: "Software Engineer",
        location: "Hybrid",
        startDate: "2024",
        endDate: "Present",
        description:
          "Working on Exact Online's software, primarily the construction application. Building integrations and developing new features for the construction industry solutions using modern web technologies. Serving close to all MKB (small businesses) in the Netherlands. Currently at Exact Online in the construction department, building a SaaS platform for construction companies where most MKBs (small businesses) in the Netherlands benefit from our help with planning, invoicing, payroll, and more.",
      },
    ],
    education: [
      {
        id: "1",
        institution: "College/University",
        degree: "College Degree",
        field: "Graphic Design",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "TailwindCSS",
      "Magento 1 & 2",
      "SaaS Platforms",
      "E-commerce",
      "DevOps",
      "CLI Tools",
      "Agile/Scrum",
      "Remote Work",
      "Graphic Design",
      "DX (Developer Experience)",
      "Automation",
    ],
    projects: [
      {
        id: "1",
        name: "Construction SaaS Platform",
        description:
          "Building a comprehensive SaaS platform for construction companies at Exact Online, helping MKBs (small businesses) in the Netherlands with planning, invoicing, payroll, and more.",
        technologies: ["React", "TypeScript", "Next.js", "SaaS"],
      },
      {
        id: "2",
        name: "E-commerce Solutions",
        description:
          "Extensive experience building custom Magento 1 & 2 solutions for various B2B and B2C clients, focusing on pixel-perfect design and high-traffic applications.",
        technologies: ["Magento", "PHP", "JavaScript", "CSS"],
      },
      {
        id: "3",
        name: "Developer Experience Tools",
        description:
          "Created intuitive CLI tools and automation scripts to enhance developer experience and productivity in various development workflows.",
        technologies: ["Node.js", "CLI", "Automation", "DevOps"],
      },
    ],
  }

  // Load data from localStorage or use default
  const loadResumeData = (): TResumeData => {
    try {
      if (typeof window !== "undefined") {
        const savedData = localStorage.getItem("resumeData")
        if (savedData) {
          return JSON.parse(savedData)
        }
      }
    } catch (error) {
      console.error("Error loading resume data from localStorage:", error)
    }
    return defaultResumeData
  }

  const [resumeData, setResumeData] = useState<TResumeData>(defaultResumeData)

  // Load data on component mount
  useEffect(() => {
    setResumeData(loadResumeData())
  }, [])

  // Save data to localStorage whenever resumeData changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("resumeData", JSON.stringify(resumeData))
      }
    } catch (error) {
      console.error("Error saving resume data to localStorage:", error)
    }
  }, [resumeData])

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Photo size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setResumeData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            photo: base64,
          },
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove photo
  const removePhoto = () => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        photo: undefined,
      },
    }))
  }

  // Add a function to clear all data
  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all resume data? This action cannot be undone.")) {
      try {
        localStorage.removeItem("resumeData")
        setResumeData(defaultResumeData)
      } catch (error) {
        console.error("Error clearing resume data:", error)
      }
    }
  }

  // Add a function to export data as JSON
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(resumeData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${resumeData.personalInfo.name.replace(/\s+/g, "_")}_resume_data.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  // Add a function to import data from JSON
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          setResumeData(importedData)
        } catch (error) {
          console.error("Error importing data:", error)
          alert("Error importing data. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  // Function to download PDF
  const downloadPDF = () => {
    // Create a new window with the resume content for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resumeData.personalInfo.name} - Resume</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
            .header { display: flex; align-items: flex-start; gap: 24px; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .photo { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; border: 2px solid #ccc; }
            .header-content { flex: 1; }
            .name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
            .title { font-size: 18px; color: #666; margin-bottom: 10px; }
            .contact { font-size: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .experience-item, .education-item, .project-item { margin-bottom: 15px; }
            .item-header { font-weight: bold; margin-bottom: 5px; }
            .item-meta { color: #666; font-size: 14px; margin-bottom: 5px; }
            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 14px; }
            .technologies { margin-top: 5px; }
            .tech { background: #e3f2fd; padding: 2px 6px; border-radius: 3px; font-size: 12px; margin-right: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            ${resumeData.personalInfo.photo ? `<img src="${resumeData.personalInfo.photo}" alt="${resumeData.personalInfo.name}" class="photo">` : ""}
            <div class="header-content">
              <div class="name">${resumeData.personalInfo.name}</div>
              <div class="title">${resumeData.personalInfo.title}</div>
              <div class="contact">
                <div>📧 <a href="mailto:${resumeData.personalInfo.email}" style="color: #2563eb; text-decoration: none;">${resumeData.personalInfo.email}</a></div>
                <div>📱 ${resumeData.personalInfo.phone}</div>
                <div>📍 ${resumeData.personalInfo.location}</div>
                <div>🌐 <a href="https://${resumeData.personalInfo.website}" target="_blank" style="color: #2563eb; text-decoration: none;">${resumeData.personalInfo.website}</a></div>
                <div>💼 <a href="${resumeData.personalInfo.linkedin}" target="_blank" style="color: #2563eb; text-decoration: none;">${resumeData.personalInfo.linkedin}</a></div>
                <div>💻 <a href="https://${resumeData.personalInfo.github}" target="_blank" style="color: #2563eb; text-decoration: none;">${resumeData.personalInfo.github}</a></div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${resumeData.summary}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Work Experience</div>
            ${resumeData.workExperience
              .map(
                (exp) => `
              <div class="experience-item">
                <div class="item-header">${exp.position} - ${exp.company}</div>
                <div class="item-meta">${exp.location} | ${exp.startDate} - ${exp.endDate}</div>
                <p>${exp.description}</p>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="section">
            <div class="section-title">Education</div>
            ${resumeData.education
              .map(
                (edu) => `
              <div class="education-item">
                <div class="item-header">${edu.degree} in ${edu.field}</div>
                <div class="item-meta">${edu.institution} | ${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</div>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills">
              ${resumeData.skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Projects</div>
            ${resumeData.projects
              .map(
                (project) => `
              <div class="project-item">
                <div class="item-header">${project.name}${project.link ? ` - <a href="${project.link.startsWith("http") ? project.link : `https://${project.link}`}" target="_blank" style="color: #2563eb; text-decoration: none;">${project.link}</a>` : ""}</div>
                <p>${project.description}</p>
                <div class="technologies">
                  ${project.technologies.map((tech) => `<span class="tech">${tech}</span>`).join("")}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Function to update personal info
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [field]: value,
      },
    }))
  }

  // Function to update summary
  const updateSummary = (value: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      summary: value,
    }))
  }

  // Function to add work experience
  const addWorkExperience = () => {
    setResumeData((prevData) => ({
      ...prevData,
      workExperience: [
        ...prevData.workExperience,
        {
          id: `${Date.now()}`,
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }))
  }

  // Function to remove work experience
  const removeWorkExperience = (id: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      workExperience: prevData.workExperience.filter((exp) => exp.id !== id),
    }))
  }

  // Function to update work experience
  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      workExperience: prevData.workExperience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  // Function to add education
  const addEducation = () => {
    setResumeData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        {
          id: `${Date.now()}`,
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
        },
      ],
    }))
  }

  // Function to remove education
  const removeEducation = (id: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((edu) => edu.id !== id),
    }))
  }

  // Function to update education
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      education: prevData.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  // Function to add skill
  const addSkill = () => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, ""],
    }))
  }

  // Function to update skill
  const updateSkill = (index: number, value: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skill, i) => (i === index ? value : skill)),
    }))
  }

  // Function to remove skill
  const removeSkill = (index: number) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((_, i) => i !== index),
    }))
  }

  // Function to add project
  const addProject = () => {
    setResumeData((prevData) => ({
      ...prevData,
      projects: [
        ...prevData.projects,
        {
          id: `${Date.now()}`,
          name: "",
          description: "",
          technologies: [],
        },
      ],
    }))
  }

  // Function to remove project
  const removeProject = (id: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      projects: prevData.projects.filter((project) => project.id !== id),
    }))
  }

  // Function to update project
  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setResumeData((prevData) => ({
      ...prevData,
      projects: prevData.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <div className="flex gap-2">
            <Button onClick={exportData} variant="outline" size="sm">
              Export Data
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>Import Data</span>
              </Button>
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <Button onClick={clearAllData} variant="destructive" size="sm">
              Clear All
            </Button>
            <Button onClick={downloadPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Resume
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Photo Upload */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0">
                    {resumeData.personalInfo.photo ? (
                      <div className="relative">
                        <img
                          src={resumeData.personalInfo.photo || "/placeholder.svg"}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        <Button
                          onClick={removePhoto}
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload Photo
                        </span>
                      </Button>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      value={resumeData.personalInfo.name}
                      onChange={(e) => updatePersonalInfo("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Professional Title</label>
                    <Input
                      value={resumeData.personalInfo.title}
                      onChange={(e) => updatePersonalInfo("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo("location", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <Input
                      value={resumeData.personalInfo.website}
                      onChange={(e) => updatePersonalInfo("website", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn</label>
                    <Input
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GitHub</label>
                    <Input
                      value={resumeData.personalInfo.github}
                      onChange={(e) => updatePersonalInfo("github", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={resumeData.summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Work Experience</CardTitle>
                  <Button onClick={addWorkExperience} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.workExperience.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-4 relative">
                    <Button
                      onClick={() => removeWorkExperience(exp.id)}
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(exp.id, "company", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Position</label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateWorkExperience(exp.id, "position", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateWorkExperience(exp.id, "location", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Start Date</label>
                          <Input
                            value={exp.startDate}
                            onChange={(e) => updateWorkExperience(exp.id, "startDate", e.target.value)}
                            placeholder="YYYY-MM"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">End Date</label>
                          <Input
                            value={exp.endDate}
                            onChange={(e) => updateWorkExperience(exp.id, "endDate", e.target.value)}
                            placeholder="YYYY-MM or Present"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateWorkExperience(exp.id, "description", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Skills</CardTitle>
                  <Button onClick={addSkill} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Badge variant="secondary" className="px-3 py-1">
                        <Input
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          className="border-none p-0 h-auto bg-transparent text-sm"
                          style={{ width: `${skill.length + 1}ch` }}
                        />
                        <Button
                          onClick={() => removeSkill(index)}
                          size="sm"
                          variant="ghost"
                          className="ml-1 h-4 w-4 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Projects</CardTitle>
                  <Button onClick={addProject} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 relative">
                    <Button
                      onClick={() => removeProject(project.id)}
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Project Name</label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                        <Input
                          value={project.link || ""}
                          onChange={(e) => updateProject(project.id, "link", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Technologies (comma-separated)</label>
                      <Input
                        value={project.technologies.join(", ")}
                        onChange={(e) =>
                          updateProject(
                            project.id,
                            "technologies",
                            e.target.value.split(", ").filter((t) => t.trim()),
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <ResumePreview data={resumeData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
