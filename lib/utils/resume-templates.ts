import type { Resume, ResumeSection } from "../types/resume"

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  createResume: () => Resume
}

// Software Engineer Template
function createSoftwareEngineerResume(): Resume {
  const sections: ResumeSection[] = [
    {
      id: crypto.randomUUID(),
      schemaId: "schema_header",
      title: "Header",
      order: 0,
      visible: true,
      content: {
        schemaId: "schema_header",
        fieldValues: {
          name: "Alex Johnson",
          title: "Senior Software Engineer",
          email: "alex.johnson@email.com",
          phone: "(555) 123-4567",
          location: "San Francisco, CA",
          website: "https://alexjohnson.dev",
          linkedin: "https://linkedin.com/in/alexjohnson",
          github: "https://github.com/alexjohnson",
        },
        groupEntries: {},
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_summary",
      title: "Professional Summary",
      order: 1,
      visible: true,
      content: {
        schemaId: "schema_summary",
        fieldValues: {
          text: "Innovative software engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Specialized in full-stack development with React, Node.js, and cloud technologies. Proven track record of delivering high-impact features that improve user experience and drive business growth.",
        },
        groupEntries: {},
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_experience",
      title: "Work Experience",
      order: 2,
      visible: true,
      content: {
        schemaId: "schema_experience",
        fieldValues: {},
        groupEntries: {
          items: [
            {
              id: crypto.randomUUID(),
              values: {
                company: "TechCorp Inc.",
                position: "Senior Software Engineer",
                location: "San Francisco, CA",
                startDate: { value: "2021-03", precision: "month" },
                endDate: null,
                current: true,
                description: [
                  "Led development of microservices architecture serving 5M+ daily active users",
                  "Reduced API response time by 60% through optimization and caching strategies",
                  "Mentored team of 5 junior engineers and conducted code reviews",
                  "Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes",
                ],
                skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                company: "StartupXYZ",
                position: "Full Stack Developer",
                location: "Remote",
                startDate: { value: "2019-01", precision: "month" },
                endDate: { value: "2021-02", precision: "month" },
                current: false,
                description: [
                  "Built customer-facing dashboard using React and Redux, increasing user engagement by 40%",
                  "Developed RESTful APIs with Node.js and Express serving 100K+ requests per day",
                  "Collaborated with design team to implement responsive UI components",
                  "Integrated third-party payment systems (Stripe, PayPal) for subscription management",
                ],
                skills: ["React", "Redux", "Node.js", "MongoDB", "Express", "Stripe API"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                company: "Digital Solutions Ltd.",
                position: "Software Developer",
                location: "New York, NY",
                startDate: { value: "2016-06", precision: "month" },
                endDate: { value: "2018-12", precision: "month" },
                current: false,
                description: [
                  "Developed and maintained e-commerce platform handling $2M+ in monthly transactions",
                  "Implemented automated testing suite achieving 85% code coverage",
                  "Optimized database queries reducing page load time by 45%",
                ],
                skills: ["JavaScript", "Python", "Django", "MySQL", "jQuery"],
              },
            },
          ],
        },
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_education",
      title: "Education",
      order: 3,
      visible: true,
      content: {
        schemaId: "schema_education",
        fieldValues: {},
        groupEntries: {
          items: [
            {
              id: crypto.randomUUID(),
              values: {
                institution: "University of California, Berkeley",
                degree: "Bachelor of Science",
                field: "Computer Science",
                location: "Berkeley, CA",
                startDate: { value: "2012", precision: "year" },
                endDate: { value: "2016", precision: "year" },
                current: false,
                gpa: "3.8",
                courses: ["Data Structures & Algorithms", "Operating Systems", "Database Systems", "Machine Learning"],
              },
            },
          ],
        },
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_skills",
      title: "Skills",
      order: 4,
      visible: true,
      content: {
        schemaId: "schema_skills",
        fieldValues: {},
        groupEntries: {
          categories: [
            {
              id: crypto.randomUUID(),
              values: {
                name: "Programming Languages",
                skills: ["JavaScript", "TypeScript", "Python", "Go", "SQL"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                name: "Frontend",
                skills: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Redux", "HTML/CSS"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                name: "Backend",
                skills: ["Node.js", "Express", "Django", "GraphQL", "REST APIs"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                name: "DevOps & Tools",
                skills: ["AWS", "Docker", "Kubernetes", "Git", "CI/CD", "Jenkins"],
              },
            },
          ],
        },
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_projects",
      title: "Projects",
      order: 5,
      visible: true,
      content: {
        schemaId: "schema_projects",
        fieldValues: {},
        groupEntries: {
          items: [
            {
              id: crypto.randomUUID(),
              values: {
                name: "Open Source Task Manager",
                description:
                  "Built a collaborative task management application with real-time updates using WebSockets. Features include drag-and-drop interface, team collaboration, and analytics dashboard.",
                technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Tailwind CSS"],
                link: "https://github.com/alexjohnson/task-manager",
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                name: "AI Code Review Assistant",
                description:
                  "Developed an AI-powered tool that analyzes pull requests and provides automated code review suggestions. Integrated with GitHub API and uses GPT-4 for intelligent feedback.",
                technologies: ["Python", "OpenAI API", "FastAPI", "GitHub Actions"],
                link: "https://github.com/alexjohnson/ai-code-reviewer",
              },
            },
          ],
        },
      },
    },
  ]

  return {
    id: crypto.randomUUID(),
    name: "Software Engineer Resume",
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Marketing Manager Template
function createMarketingManagerResume(): Resume {
  const sections: ResumeSection[] = [
    {
      id: crypto.randomUUID(),
      schemaId: "schema_header",
      title: "Header",
      order: 0,
      visible: true,
      content: {
        schemaId: "schema_header",
        fieldValues: {
          name: "Sarah Martinez",
          title: "Digital Marketing Manager",
          email: "sarah.martinez@email.com",
          phone: "(555) 987-6543",
          location: "Austin, TX",
          website: "https://sarahmarketingpro.com",
          linkedin: "https://linkedin.com/in/sarahmartinez",
          github: "",
        },
        groupEntries: {},
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_summary",
      title: "Professional Summary",
      order: 1,
      visible: true,
      content: {
        schemaId: "schema_summary",
        fieldValues: {
          text: "Results-driven marketing professional with 6+ years of experience developing and executing data-driven digital marketing strategies. Expert in SEO, content marketing, and social media management. Proven ability to increase brand awareness, drive customer acquisition, and deliver measurable ROI across multiple channels.",
        },
        groupEntries: {},
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_experience",
      title: "Work Experience",
      order: 2,
      visible: true,
      content: {
        schemaId: "schema_experience",
        fieldValues: {},
        groupEntries: {
          items: [
            {
              id: crypto.randomUUID(),
              values: {
                company: "GrowthTech Solutions",
                position: "Digital Marketing Manager",
                location: "Austin, TX",
                startDate: { value: "2020-08", precision: "month" },
                endDate: null,
                current: true,
                description: [
                  "Increased organic traffic by 250% through comprehensive SEO strategy and content optimization",
                  "Managed $500K annual marketing budget across paid search, social media, and content marketing",
                  "Led team of 4 marketing specialists and coordinated with external agencies",
                  "Launched email marketing campaigns achieving 35% open rate and 8% conversion rate",
                  "Implemented marketing automation workflows reducing lead nurturing time by 40%",
                ],
                skills: ["SEO", "Google Analytics", "HubSpot", "Content Strategy", "PPC", "Email Marketing"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                company: "BrandBoost Agency",
                position: "Senior Marketing Specialist",
                location: "Remote",
                startDate: { value: "2018-03", precision: "month" },
                endDate: { value: "2020-07", precision: "month" },
                current: false,
                description: [
                  "Developed social media strategies for 15+ B2B and B2C clients across various industries",
                  "Created and managed content calendars resulting in 150% increase in engagement",
                  "Conducted A/B testing on landing pages improving conversion rates by 45%",
                  "Analyzed campaign performance and provided actionable insights to clients",
                ],
                skills: ["Social Media Marketing", "Content Creation", "Google Ads", "Facebook Ads", "Analytics"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                company: "E-commerce Plus",
                position: "Marketing Coordinator",
                location: "Dallas, TX",
                startDate: { value: "2017-01", precision: "month" },
                endDate: { value: "2018-02", precision: "month" },
                current: false,
                description: [
                  "Assisted in planning and executing multi-channel marketing campaigns",
                  "Managed company blog and social media accounts, growing followers by 80%",
                  "Coordinated with design team to create marketing collateral and promotional materials",
                ],
                skills: ["Content Writing", "Social Media", "Email Marketing", "Canva", "WordPress"],
              },
            },
          ],
        },
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_education",
      title: "Education",
      order: 3,
      visible: true,
      content: {
        schemaId: "schema_education",
        fieldValues: {},
        groupEntries: {
          items: [
            {
              id: crypto.randomUUID(),
              values: {
                institution: "University of Texas at Austin",
                degree: "Bachelor of Business Administration",
                field: "Marketing",
                location: "Austin, TX",
                startDate: { value: "2013", precision: "year" },
                endDate: { value: "2017", precision: "year" },
                current: false,
                gpa: "3.7",
                courses: ["Digital Marketing", "Consumer Behavior", "Brand Management", "Marketing Analytics"],
              },
            },
          ],
        },
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_skills",
      title: "Skills",
      order: 4,
      visible: true,
      content: {
        schemaId: "schema_skills",
        fieldValues: {},
        groupEntries: {
          categories: [
            {
              id: crypto.randomUUID(),
              values: {
                name: "Digital Marketing",
                skills: ["SEO/SEM", "Content Marketing", "Email Marketing", "Social Media Marketing", "PPC"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                name: "Analytics & Tools",
                skills: ["Google Analytics", "Google Ads", "HubSpot", "Mailchimp", "SEMrush", "Hootsuite"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                name: "Content & Design",
                skills: ["Copywriting", "Content Strategy", "Adobe Creative Suite", "Canva", "WordPress"],
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                name: "Soft Skills",
                skills: ["Team Leadership", "Project Management", "Data Analysis", "Strategic Planning"],
              },
            },
          ],
        },
      },
    },
    {
      id: crypto.randomUUID(),
      schemaId: "schema_projects",
      title: "Certifications & Projects",
      order: 5,
      visible: true,
      content: {
        schemaId: "schema_projects",
        fieldValues: {},
        groupEntries: {
          items: [
            {
              id: crypto.randomUUID(),
              values: {
                name: "Google Analytics Certification",
                description:
                  "Completed advanced Google Analytics certification demonstrating proficiency in data analysis, reporting, and conversion tracking.",
                technologies: ["Google Analytics", "Data Analysis", "Conversion Optimization"],
                link: "",
              },
            },
            {
              id: crypto.randomUUID(),
              values: {
                name: "HubSpot Inbound Marketing Certification",
                description:
                  "Earned certification in inbound marketing methodology, including content strategy, lead nurturing, and marketing automation.",
                technologies: ["HubSpot", "Inbound Marketing", "Marketing Automation"],
                link: "",
              },
            },
          ],
        },
      },
    },
  ]

  return {
    id: crypto.randomUUID(),
    name: "Marketing Manager Resume",
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    description: "Full-stack developer with 8+ years experience",
    createResume: createSoftwareEngineerResume,
  },
  {
    id: "marketing-manager",
    name: "Marketing Manager",
    description: "Digital marketing professional with proven ROI",
    createResume: createMarketingManagerResume,
  },
]
