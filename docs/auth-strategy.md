# Authentication Strategy

This document outlines the authentication setup and protected route implementation for the application.

## Architecture Overview

### 1. Better Auth Client Configuration ✅
- **Location**: `src/features/auth/client/auth-client.ts`
- **Status**: Properly configured for Next.js App Router
- **Features**: Configured with dynamic base URL detection

### 2. Authentication Hooks ✅
- **Location**: `src/features/auth/hooks/hooks.ts`
- **Hooks Available**:
  - `useSession()` - Fetches current user session with SWR caching
  - `useRequireAuth()` - Automatically redirects unauthenticated users to `/sign-in`

### 3. Route Protection Strategy

#### Client-Side Protection (Preferred for `/dashboard`) ✅
- **Implementation**: Using `useRequireAuth()` hook
- **Benefits**: 
  - Faster initial page loads
  - Better user experience with loading states
  - Automatic redirect handling
- **Usage**: Applied to `/app/dashboard/page.tsx`

#### Server-Side Protection (Available when needed) ✅
- **Implementation**: Using `redirectUnauthenticated()` utility
- **Location**: `src/shared/utilities/auth-utils.ts`
- **Usage**: For server components requiring authentication
- **Example**: `src/features/auth/components/server-auth-example.tsx`

## Protected Routes

### `/dashboard` ✅
- **Protection**: Client-side with `useRequireAuth()`
- **Redirect Target**: `/sign-in`
- **Loading State**: Displays spinner while checking authentication
- **Features**: 
  - Automatic redirect for unauthenticated users
  - Personalized welcome message
  - Responsive dashboard layout

## Authentication Flow

1. **User accesses protected route** → 
2. **`useRequireAuth()` checks session** → 
3. **If authenticated**: Render protected content
4. **If not authenticated**: Redirect to `/sign-in`
5. **After successful login**: User can access protected routes

## Utilities

### `redirectUnauthenticated()` ✅
- **Purpose**: DRY utility for server-side redirects
- **Returns**: `never` (always redirects)
- **Target**: `/sign-in`
- **Usage**: Call from server components when session is invalid

## Route Mapping

- `/sign-in` - Sign in page (replaces `/login`)
- `/register` - Registration page
- `/dashboard` - Protected dashboard (client-side)
- Any server component can use `redirectUnauthenticated()` for server-side protection

## Implementation Notes

1. **Client vs Server Protection**: 
   - Use client-side (`useRequireAuth`) for better UX when SSR isn't critical
   - Use server-side (`redirectUnauthenticated`) when you need server-side rendering of protected content

2. **Consistency**: All redirects point to `/sign-in` to maintain consistent auth flow

3. **Error Handling**: Authentication errors gracefully fallback to unauthenticated state

4. **Performance**: SWR caching reduces unnecessary auth checks with 60-second deduplication
