export const getEnabledOAuthProviders = () => {
  const enabledProviders: string[] = [];

  if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    enabledProviders.push('google');
  }

  if (process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) {
    enabledProviders.push('github');
  }

  if (process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID) {
    enabledProviders.push('facebook');
  }

  if (process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID) {
    enabledProviders.push('twitter');
  }

  if (process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID) {
    enabledProviders.push('discord');
  }

  if (process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID) {
    enabledProviders.push('linkedin');
  }

  if (process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID) {
    enabledProviders.push('microsoft');
  }

  if (process.env.NEXT_PUBLIC_APPLE_CLIENT_ID) {
    enabledProviders.push('apple');
  }

  if (process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID) {
    enabledProviders.push('tiktok');
  }

  return enabledProviders;
};
