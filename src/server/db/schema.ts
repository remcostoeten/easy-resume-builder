/**
 * Defines the database schema for the application.
 * This file imports and consolidates schemas from various features.
 * @NOTE Schemas are NEVER directly defined here, only imported.
 */

// Better Auth schemas for migrations
export * from '@/features/auth/server/better-auth-schema';

// TODO: Import actual schemas when they are created
// import * as resumeSchemas from '@/features/resume-schemas';
