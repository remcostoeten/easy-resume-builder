import { redirect } from 'next/navigation';

export function redirectUnauthenticated(): never {
	redirect('/login');
}
