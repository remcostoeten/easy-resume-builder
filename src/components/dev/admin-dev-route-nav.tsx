import { headers } from 'next/headers';
import { isAdmin } from '@/features/auth/server/is-admin';
import { DevRouteNav } from './dev-route-nav';

type TProps = {};

export async function AdminDevRouteNav({}: TProps) {
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie');
  const admin = await isAdmin(cookieHeader || undefined);
  
  if (admin || process.env.NODE_ENV === 'development') {
    return <DevRouteNav />;
  }
  
  return null;
}
