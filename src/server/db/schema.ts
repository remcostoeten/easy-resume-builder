/**
 * Defines the database schema for the application.
 * This file imports and consolidates schemas from various features.
 * @NOTE Schemas are NEVER directly defined here, only imported.
 */

// Better Auth schemas for migrations
export * from '@/lib/db/schema';

// Resume schemas
export * from '@/features/resume/server/schemas';
