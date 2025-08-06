# Dashboard Feature

This feature provides dashboard components and server actions for displaying user statistics and analytics.

## Components

### QuickStats

The `QuickStats` widget provides three key performance indicators (KPIs) for the user's resume data:

- **Total Resumes**: Number of active resumes in the user's account
- **Last Edited**: Time since the most recent resume modification (formatted as "X ago")
- **Profile Completion**: Percentage of resume sections completed (personal info, work experience, education, skills)

#### Usage

```tsx
import { QuickStats } from '@/features/dashboard';

export default function DashboardPage() {
  return (
    <div>
      <QuickStats />
    </div>
  );
}
```

#### With Suspense (Recommended)

```tsx
import { Suspense } from 'react';
import { QuickStats } from '@/features/dashboard';

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading stats...</div>}>
        <QuickStats />
      </Suspense>
    </div>
  );
}
```

## Server Actions

### getQuickStats()

Fetches and calculates dashboard statistics for the authenticated user.

**Returns:** `Promise<TQuickStats>`

```typescript
type TQuickStats = {
  totalResumes: number;
  lastEditedDate: Date | null;
  profileCompletionPercentage: number;
};
```

**Features:**
- Requires user authentication
- Counts only active resumes
- Calculates profile completion based on 4 main sections
- Handles cases where no resumes exist

## Types

### TQuickStats
Main data type returned by the stats server action.

### TStatCard
Generic type for individual stat card components.

## Architecture

- **Server Actions**: Located in `server/actions/`
- **Components**: Located in `components/`
- **Types**: Located in `server/types/`
- **Error Handling**: Built-in try/catch with fallback UI
- **Authentication**: Uses better-auth for session management
- **Database**: Uses Drizzle ORM with PostgreSQL

## Dependencies

- `date-fns`: For human-readable date formatting
- `better-auth`: For session management
- `drizzle-orm`: For database queries
- Card components from shared UI library
