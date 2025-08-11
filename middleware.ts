import { auth } from '@/features/auth/server/auth';

export const middleware = auth.handler;

export const config = {
  matcher: ['/((?!_next|.*\..*).*)'],
};