![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-green.svg)

## Resume builder v2

[!NOTE] v1 (abandoned) can be found [here](https://ez-resume-builder.vercel.app).

Create, edit, store, optimize, and download your resume. Offering an intuitive editor with all the flexibility to create your professional resume to get your dream job.

We offer various options:
- Start completely fresh
- Start from a boilerplate to give you an idea of the content you should include
- Import your existing resume and let AI parse it in our format
- Various theming options
- Download to json or PDF.

### Development

This application is still in beta and has features in progress such as storage and authentication. To get up and running simply clone the repository, install the packages. We use bun, and run it.

As there is no authentication or database implemented *currently* the only (optional) environment variable is:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

You can get your API key from: https://aistudio.google.com/app/apikey

This key is used for AI-powered resume features like content optimization and resume parsing. 
