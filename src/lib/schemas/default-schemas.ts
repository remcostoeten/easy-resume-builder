import type { SectionSchema } from "@/lib/types/resume"

// Header schema
export const headerSchema: SectionSchema = {
  id: "schema_header",
  name: "header",
  displayName: "Header",
  icon: "User",
  isCustom: false,
  fields: [
    {
      id: "field_avatar",
      name: "avatar",
      label: "Profile Photo",
      type: "image",
      required: false,
      placeholder: "Upload a professional profile photo",
      helpText: "Recommended: Square image, at least 300x300px",
      order: -1,
    },
    {
      id: "field_name",
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "John Doe",
      order: 0,
    },
    {
      id: "field_title",
      name: "title",
      label: "Professional Title",
      type: "text",
      required: false,
      placeholder: "Software Engineer",
      order: 1,
    },
    {
      id: "field_email",
      name: "email",
      label: "Email",
      type: "email",
      required: false,
      placeholder: "john@example.com",
      order: 2,
    },
    {
      id: "field_phone",
      name: "phone",
      label: "Phone",
      type: "phone",
      required: false,
      placeholder: "(555) 123-4567",
      order: 3,
    },
    {
      id: "field_location",
      name: "location",
      label: "Location",
      type: "text",
      required: false,
      placeholder: "San Francisco, CA",
      order: 4,
    },
    {
      id: "field_website",
      name: "website",
      label: "Website",
      type: "url",
      required: false,
      placeholder: "https://johndoe.com",
      order: 5,
    },
    {
      id: "field_linkedin",
      name: "linkedin",
      label: "LinkedIn",
      type: "url",
      required: false,
      placeholder: "https://linkedin.com/in/johndoe",
      order: 6,
    },
    {
      id: "field_github",
      name: "github",
      label: "GitHub",
      type: "url",
      required: false,
      placeholder: "https://github.com/johndoe",
      order: 7,
    },
  ],
  repeatableGroups: [],
}

// Summary schema
export const summarySchema: SectionSchema = {
  id: "schema_summary",
  name: "summary",
  displayName: "Professional Summary",
  icon: "FileText",
  isCustom: false,
  fields: [
    {
      id: "field_text",
      name: "text",
      label: "Summary",
      type: "textarea",
      required: false,
      placeholder: "Write a brief professional summary...",
      order: 0,
    },
  ],
  repeatableGroups: [],
}

// Work Experience schema
export const experienceSchema: SectionSchema = {
  id: "schema_experience",
  name: "experience",
  displayName: "Work Experience",
  icon: "Briefcase",
  isCustom: false,
  fields: [],
  repeatableGroups: [
    {
      id: "group_experience_items",
      name: "items",
      label: "Experience Entry",
      fields: [
        {
          id: "field_company",
          name: "company",
          label: "Company",
          type: "text",
          required: true,
          placeholder: "Company Name",
          order: 0,
        },
        {
          id: "field_position",
          name: "position",
          label: "Position",
          type: "text",
          required: true,
          placeholder: "Job Title",
          order: 1,
        },
        {
          id: "field_location",
          name: "location",
          label: "Location",
          type: "text",
          required: false,
          placeholder: "City, State",
          order: 2,
        },
        {
          id: "field_start_date",
          name: "startDate",
          label: "Start Date",
          type: "date",
          required: false,
          order: 3,
          dateOptions: {
            allowPrecisionToggle: true,
            defaultPrecision: "month",
          },
        },
        {
          id: "field_end_date",
          name: "endDate",
          label: "End Date",
          type: "date",
          required: false,
          order: 4,
          dateOptions: {
            allowPrecisionToggle: true,
            defaultPrecision: "month",
          },
        },
        {
          id: "field_current",
          name: "current",
          label: "I currently work here",
          type: "checkbox",
          required: false,
          defaultValue: false,
          order: 5,
        },
        {
          id: "field_description",
          name: "description",
          label: "Description",
          type: "list",
          required: false,
          placeholder: "Describe your responsibilities and achievements...",
          helpText: "Add bullet points describing your role",
          order: 6,
        },
        {
          id: "field_skills",
          name: "skills",
          label: "Skills Used",
          type: "list",
          required: false,
          placeholder: "Add skills used in this role...",
          helpText: "List the key skills and technologies you used",
          order: 7,
        },
      ],
    },
  ],
}

// Education schema
export const educationSchema: SectionSchema = {
  id: "schema_education",
  name: "education",
  displayName: "Education",
  icon: "GraduationCap",
  isCustom: false,
  fields: [],
  repeatableGroups: [
    {
      id: "group_education_items",
      name: "items",
      label: "Education Entry",
      fields: [
        {
          id: "field_institution",
          name: "institution",
          label: "Institution",
          type: "text",
          required: true,
          placeholder: "University Name",
          order: 0,
        },
        {
          id: "field_degree",
          name: "degree",
          label: "Degree",
          type: "text",
          required: true,
          placeholder: "Bachelor of Science",
          order: 1,
        },
        {
          id: "field_field",
          name: "field",
          label: "Field of Study",
          type: "text",
          required: false,
          placeholder: "Computer Science",
          order: 2,
        },
        {
          id: "field_location",
          name: "location",
          label: "Location",
          type: "text",
          required: false,
          placeholder: "City, State",
          order: 3,
        },
        {
          id: "field_start_date",
          name: "startDate",
          label: "Start Date",
          type: "date",
          required: false,
          order: 4,
          dateOptions: {
            allowPrecisionToggle: true,
            defaultPrecision: "year",
          },
        },
        {
          id: "field_end_date",
          name: "endDate",
          label: "End Date",
          type: "date",
          required: false,
          order: 5,
          dateOptions: {
            allowPrecisionToggle: true,
            defaultPrecision: "year",
          },
        },
        {
          id: "field_current",
          name: "current",
          label: "I am currently attending",
          type: "checkbox",
          required: false,
          defaultValue: false,
          order: 6,
        },
        {
          id: "field_gpa",
          name: "gpa",
          label: "Grade/Score",
          type: "text",
          required: false,
          placeholder: "e.g., 3.8/4.0, 85%, First Class",
          helpText: "Enter your academic performance (GPA, percentage, classification, etc.)",
          order: 7,
        },
        {
          id: "field_courses",
          name: "courses",
          label: "Relevant Courses",
          type: "list",
          required: false,
          placeholder: "Add relevant courses...",
          order: 8,
        },
      ],
    },
  ],
}

// Skills schema
export const skillsSchema: SectionSchema = {
  id: "schema_skills",
  name: "skills",
  displayName: "Skills",
  icon: "Wrench",
  isCustom: false,
  fields: [],
  repeatableGroups: [
    {
      id: "group_skill_categories",
      name: "categories",
      label: "Skill Category",
      fields: [
        {
          id: "field_category_name",
          name: "name",
          label: "Category Name",
          type: "text",
          required: true,
          placeholder: "Programming Languages",
          order: 0,
        },
        {
          id: "field_skills",
          name: "skills",
          label: "Skills",
          type: "list",
          required: false,
          placeholder: "Add skills...",
          order: 1,
        },
      ],
    },
  ],
}

// Projects schema
export const projectsSchema: SectionSchema = {
  id: "schema_projects",
  name: "projects",
  displayName: "Projects",
  icon: "FolderGit2",
  isCustom: false,
  fields: [],
  repeatableGroups: [
    {
      id: "group_project_items",
      name: "items",
      label: "Project Entry",
      fields: [
        {
          id: "field_name",
          name: "name",
          label: "Project Name",
          type: "text",
          required: true,
          placeholder: "My Awesome Project",
          order: 0,
        },
        {
          id: "field_description",
          name: "description",
          label: "Description",
          type: "textarea",
          required: false,
          placeholder: "Describe the project...",
          order: 1,
        },
        {
          id: "field_technologies",
          name: "technologies",
          label: "Technologies",
          type: "list",
          required: false,
          placeholder: "Add technologies used...",
          order: 2,
        },
        {
          id: "field_link",
          name: "link",
          label: "Project Link",
          type: "url",
          required: false,
          placeholder: "https://github.com/...",
          order: 3,
        },
      ],
    },
  ],
}

// Export all default schemas
export const defaultSchemas: SectionSchema[] = [
  headerSchema,
  summarySchema,
  experienceSchema,
  educationSchema,
  skillsSchema,
  projectsSchema,
]

// Helper to get schema by ID
export function getSchemaById(schemaId: string): SectionSchema | undefined {
  return defaultSchemas.find((s) => s.id === schemaId)
}

// Helper to create empty section content from schema
export function createEmptySectionContent(schema: SectionSchema): any {
  const fieldValues: Record<string, any> = {}

  // Initialize direct fields with default values
  schema.fields.forEach((field) => {
    fieldValues[field.name] = field.defaultValue ?? null
  })

  const groupEntries: Record<string, any[]> = {}

  // Initialize repeatable groups as empty arrays
  schema.repeatableGroups.forEach((group) => {
    groupEntries[group.name] = []
  })

  return {
    schemaId: schema.id,
    fieldValues,
    groupEntries,
  }
}
