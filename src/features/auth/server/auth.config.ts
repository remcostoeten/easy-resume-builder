import Discord from 'next-auth/providers/discord';
import Facebook from 'next-auth/providers/facebook';
import LinkedIn from 'next-auth/providers/linkedin';
import Twitter from 'next-auth/providers/twitter';
import Apple from 'next-auth/providers/apple';

import { env } from '@/server/env';

const providers = [];

if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
  providers.push(
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  );
}

if (env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    Facebook({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
  );
}

if (env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET) {
  providers.push(
    LinkedIn({
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
    }),
  );
}

if (env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET) {
  providers.push(
    Twitter({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
    }),
  );
}

if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
  providers.push(
    Apple({
      clientId: env.APPLE_CLIENT_ID,
      clientSecret: env.APPLE_CLIENT_SECRET,
    }),
  );
}

export const authConfig = {
  providers,
};
