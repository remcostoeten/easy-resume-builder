Better Auth One-Shot Implementation Prompt
You are an expert developer implementing a complete authentication system using Better Auth. You need to create a full-featured auth solution with the following specifications:
Project Structure Requirements

Database setup at @/server/db/ with schema at @/server/db/schema
Using Neon PostgreSQL database
All auth-related code should be organized within @/features/auth/ directory
Include both server-side and client-side components

Authentication Features Required

Email and Password Authentication

User registration with email/password
User sign-in with email/password
Password validation (minimum 8 characters)
Auto sign-in after registration


Social OAuth Providers

Google OAuth integration
GitHub OAuth integration
Proper callback URL handling
Error handling for OAuth flows


Session Management

Server-side session handling
Client-side session hooks
Session persistence and security



Implementation Tasks
1. Database Schema Setup
Create the complete database schema file at @/server/db/schema that includes:

User table with all required fields (id, email, name, image, etc.)
Session table for session management
Account table for OAuth provider linking
Any additional tables required by Better Auth

2. Server Configuration
Create the main auth server configuration at @/features/auth/server/auth.ts:

Configure Better Auth with email/password authentication
Set up Google and GitHub OAuth providers
Configure database connection to Neon PostgreSQL
Set up proper environment variables handling

3. Client Configuration
Create the auth client at @/features/auth/client/auth-client.ts:

Set up Better Auth client with proper typing
Configure client-side OAuth handling
Set up session management hooks

4. Components Directory Structure
Create components in @/features/auth/components/:

SignInForm.tsx - Email/password sign-in form
SignUpForm.tsx - User registration form
OAuthButtons.tsx - Google and GitHub OAuth buttons
UserProfile.tsx - Display user session info
AuthGuard.tsx - Route protection component

5. Server Actions/API Routes
Create server-side handlers in @/features/auth/server/:

Sign-in server actions
Sign-up server actions
Session management
OAuth callback handling

6. Environment Variables
Provide a complete .env.example file with all required variables:

Database connection string for Neon
Google OAuth credentials
GitHub OAuth credentials
Better Auth secret keys

7. Type Definitions
Create proper TypeScript types in @/features/auth/types/:

User type definitions
Session type definitions
Auth response types

Technical Requirements
Database Connection

Use Neon PostgreSQL with proper connection pooling
Implement proper database migrations
Handle connection errors gracefully

Security

Implement CSRF protection
Secure cookie configuration
Proper session encryption
OAuth state validation

Error Handling

Comprehensive error handling for all auth flows
User-friendly error messages
Proper logging for debugging

UI/UX

Clean, modern form designs
Loading states for all auth operations
Success/error feedback messages
Responsive design for mobile

Code Structure Example
@/features/auth/
├── server/
│   ├── auth.ts (main Better Auth config)
│   ├── actions.ts (server actions)
│   └── db.ts (database utilities)
├── client/
│   ├── auth-client.ts (Better Auth client)
│   └── hooks.ts (custom auth hooks)
├── components/
│   ├── SignInForm.tsx
│   ├── SignUpForm.tsx
│   ├── OAuthButtons.tsx
│   ├── UserProfile.tsx
│   └── AuthGuard.tsx
├── types/
│   └── index.ts (type definitions)
└── lib/
    └── utils.ts (auth utilities)
Implementation Guidelines

Use modern React patterns (hooks, functional components)
Implement proper TypeScript typing throughout
Follow Next.js 14+ App Router conventions
Use Tailwind CSS for styling
Implement proper error boundaries
Add loading states and optimistic updates
Ensure accessibility compliance
Include comprehensive JSDoc comments

Environment Setup
Create configuration for:

Development environment
Production deployment
Environment variable validation
Database connection testing

Testing Considerations
Include basic setup for:

Unit tests for auth functions
Integration tests for auth flows
E2E tests for complete user journeys

Generate a complete, production-ready authentication system that can be immediately deployed and used. All code should be fully functional, well-typed, and follow modern best practices.
Expected Deliverables

Complete file structure with all necessary files
Working database schema and migrations
Functional authentication forms and components
Proper OAuth integration with Google and GitHub
Session management and route protection
Error handling and user feedback
Environment configuration
Type definitions and documentation

Implement everything needed for a professional authentication system that handles user registration, login, OAuth, and session management using Better Auth with Neon PostgreSQL.
