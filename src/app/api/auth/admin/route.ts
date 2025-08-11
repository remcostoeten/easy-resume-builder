import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/features/auth/server/is-admin';

export async function GET(request: NextRequest) {
	const sessionToken = request.cookies.get('session')?.value;
	
	const admin = await isAdmin(sessionToken);
	
	return NextResponse.json({ admin });
}
