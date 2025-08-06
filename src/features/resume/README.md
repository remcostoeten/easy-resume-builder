# Resume Management Feature

This feature provides CRUD operations for managing user resumes.

## Components

### ResumeListServer (Server Component)
Server component that fetches resumes and renders the client component.

```tsx
import { ResumeListServer } from '@/components/dashboard';

export default async function DashboardPage() {
  const userId = 'user-123'; // Get from auth
  
  return (
    <div>
      <ResumeListServer userId={userId} />
    </div>
  );
}
```

### ResumeList (Client Component)
Client component that handles user interactions and state management.

```tsx
'use client';

import { ResumeList } from '@/components/dashboard';
import { listUserResumes } from '@/features/resume/server/actions';

export default function MyComponent({ userId }) {
  const [resumes, setResumes] = useState([]);
  
  useEffect(() => {
    async function loadResumes() {
      const data = await listUserResumes(userId);
      setResumes(data);
    }
    loadResumes();
  }, [userId]);
  
  return <ResumeList userId={userId} initialResumes={resumes} />;
}
```

## Server Actions

- `listUserResumes(userId)` - Get all active resumes for a user
- `createUserResume(data)` - Create a new resume
- `getUserResume(id)` - Get a specific resume
- `updateUserResume(id, data)` - Update a resume
- `deleteUserResume(id)` - Delete a resume

## Features

- ✅ Table layout with resume information
- ✅ Create, Edit, Delete buttons
- ✅ Server-side data fetching
- ✅ Client-side state management
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Placeholder pages for Create/Edit routes

## Database Schema

The resume table includes:
- `id` - Primary key
- `userId` - User identifier
- `title` - Resume title
- `template` - Template name
- `personalInfo` - JSON data for personal information
- `workExperience` - JSON data for work experience
- `education` - JSON data for education
- `skills` - JSON data for skills
- `sections` - JSON data for sections configuration
- `isActive` - Boolean flag for soft delete
- `lastModified` - Timestamp of last modification
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

## Routes

- `/dashboard/resume/create` - Create new resume (placeholder)
- `/dashboard/resume/edit/[id]` - Edit existing resume (placeholder)
