'use client';

import { useState } from 'react';
import { authClient } from '@/features/auth/client/auth-client';
import { Button } from '@/shared/components/ui/button';
import { getEnabledOAuthProviders } from '../client/oauth-providers-config';

type TProps = {
  className?: string;
  onError?: (error: string) => void;
};

const providerDisplayNames: Record<string, string> = {
  google: 'Google',
  github: 'GitHub',
  discord: 'Discord',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  apple: 'Apple',
  microsoft: 'Microsoft',
  tiktok: 'TikTok',
};

export function OAuthButtons({ className, onError }: TProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  async function handleSignIn(provider: string) {
    setLoadingStates((prev) => ({ ...prev, [provider]: true }));
    try {
      await authClient.signIn.social({
        provider: provider,
        callbackURL: '/dashboard',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${providerDisplayNames[provider]} sign in failed`;
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [provider]: false }));
    }
  }

  const availableProviders = getEnabledOAuthProviders();

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {availableProviders.map((providerId) => (
        <Button
          key={providerId}
          type='button'
          variant='outline'
          onClick={() => handleSignIn(providerId)}
          disabled={loadingStates[providerId] || Object.values(loadingStates).some(Boolean)}
          className='w-full'
        >
          {loadingStates[providerId] ? `Signing in with ${providerDisplayNames[providerId]}...` : `Continue with ${providerDisplayNames[providerId]}`}
        </Button>
      ))}
    </div>
  );
}
