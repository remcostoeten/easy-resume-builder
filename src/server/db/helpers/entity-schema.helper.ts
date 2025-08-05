import { serial } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamp-schema.helper';

/**
 * Defines the base schema for entities, including an ID and timestamps.
 */
export const entityBase = {
  id: serial('id').primaryKey(),
  ...timestamps
};
