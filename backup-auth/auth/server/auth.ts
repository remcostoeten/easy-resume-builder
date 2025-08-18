import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/server/db";
import { env } from "@/server/env";

import { buildSocialProviders } from "./auth.config";
import { account, session, user, verification } from "./better-auth-schema";

// Helper to generate localhost origins from a port range
const localhostRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => `http://localhost:${start + i}`);

const DEV_ORIGINS = [
  ...localhostRange(3000, 3010),
  "http://localhost:3333",
  "http://localhost:34343",
];

const TRUSTED_ORIGINS =
  process.env.NODE_ENV === "development"
    ? DEV_ORIGINS
    : ["https://your-production-domain.com"];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  trustedOrigins: TRUSTED_ORIGINS,
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  cookies: {
    sessionToken: {
      name: "session",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
    csrfToken: {
      name: "csrf-token",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  },
});
