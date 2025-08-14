import { env } from '@/server/env';

type TProviderConfig = {
  clientId: string;
  clientSecret: string;
  redirectURI: string;
  clientKey?: string;
};

export function buildSocialProviders(domain: string): Record<string, TProviderConfig | any> {
  const providers: Record<string, TProviderConfig | any> = {};

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      redirectURI: `${domain}/api/auth/callback/github`,
    };
  }

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectURI: `${domain}/api/auth/callback/google`,
    };
  }

  if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
    providers.discord = {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      redirectURI: `${domain}/api/auth/callback/discord`,
    };
  }

  if (env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET) {
    providers.facebook = {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
      redirectURI: `${domain}/api/auth/callback/facebook`,
    };
  }

  if (env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET) {
    providers.linkedin = {
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
      redirectURI: `${domain}/api/auth/callback/linkedin`,
    };
  }

  if (env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET) {
    providers.twitter = {
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      redirectURI: `${domain}/api/auth/callback/twitter`,
    };
  }

  if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
    providers.apple = {
      clientId: env.APPLE_CLIENT_ID,
      clientSecret: env.APPLE_CLIENT_SECRET,
      redirectURI: `${domain}/api/auth/callback/apple`,
    };
  }

  if (env.TIKTOK_CLIENT_ID && env.TIKTOK_CLIENT_SECRET && env.TIKTOK_CLIENT_KEY) {
    providers.tiktok = {
      clientId: env.TIKTOK_CLIENT_ID,
      clientSecret: env.TIKTOK_CLIENT_SECRET,
      clientKey: env.TIKTOK_CLIENT_KEY,
      redirectURI: `${domain}/api/auth/callback/tiktok`,
    };
  }

  return providers;
}

export const authConfig = {
  providers: buildSocialProviders(env.DOMAIN),
};
