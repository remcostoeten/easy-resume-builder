import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/server/db';
import { env } from '@/server/env';
import { account, session, user, verification } from './better-auth-schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user,
			session,
			account,
			verification,
		},
	}),
	trustedOrigins: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	socialProviders: {
		// ToDoo: add linkedin, facebook, microsoft, tiktok
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			redirectURI: `${env.DOMAIN}/api/auth/callback/google`,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			redirectURI: `${env.DOMAIN}/api/auth/callback/github`,
		},
	},
	secret: env.BA_SECRET,
	baseURL: env.DOMAIN,
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60 * 24 * 7,
		},
	},
	cookies: {
		sessionToken: {
			name: 'session',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			httpOnly: true,
		},
		csrfToken: {
			name: 'csrf-token',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			httpOnly: true,
		},
	},
});
