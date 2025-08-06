import { z } from 'zod';

const envSchema = z.object({
	DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
	BA_SECRET: z.string().min(1, 'BA_SECRET is required'),
	GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
	GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
	GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
	GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
	DOMAIN: z.string().url('DOMAIN must be a valid URL').default('http://localhost:3000'),
});

type TEnv = z.infer<typeof envSchema>;

function validateEnv(): TEnv {
	try {
		return envSchema.parse(process.env);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const missingVars = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
			throw new Error(`Environment validation failed:\n${missingVars.join('\n')}`);
		}
		throw error;
	}
}

export { validateEnv, envSchema };
export type { TEnv };
