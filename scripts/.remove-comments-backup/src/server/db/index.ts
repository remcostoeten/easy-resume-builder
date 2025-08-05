/**
 * Initializes the Drizzle ORM with the Neon HTTP driver.
 * This file sets up the database connection using the DATABASE_URL environment variable.
 */
import { drizzle } from 'drizzle-orm/neon-http';
export const db = drizzle(process.env.DATABASE_URL);
