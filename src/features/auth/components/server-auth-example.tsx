import { headers } from 'next/headers';
import { auth } from '@/features/auth/server/auth';
import { redirectUnauthenticated } from '@/shared/utilities';

export async function ServerProtectedComponent() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirectUnauthenticated();
	}

	return (
		<div className='p-4 bg-card rounded-lg border'>
			<h3 className='text-lg font-semibold mb-2'>Server Protected Content</h3>
			<p className='text-muted-foreground'>
				This component is rendered on the server and automatically redirects unauthenticated
				users to /login
			</p>
			<p className='text-sm text-muted-foreground mt-2'>
				User: {session.user.name} ({session.user.email})
			</p>
		</div>
	);
}
