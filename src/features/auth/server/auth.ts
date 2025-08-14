import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/server/db';
import { env } from '@/server/env';

import { buildSocialProviders } from './auth.config';
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
    ...buildSocialProviders(env.DOMAIN),
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
