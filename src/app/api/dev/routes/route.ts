import { NextResponse } from 'next/server';
import fg from 'fast-glob';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function normalizeRoute(p: string): string {
  const withoutSrcApp = p.replace(/^src\/app\//, '');
  const withoutPage = withoutSrcApp.replace(/\/page\.(tsx|ts|jsx|js)$/i, '');
  const withoutGroups = withoutPage.replace(/\([^\)]*\)\/?/g, '');
  const withLeadingSlash = `/${withoutGroups}`.replace(/\/+/g, '/');
  const cleaned = withLeadingSlash.replace(/\/$/, '') || '/';
  return cleaned;
}

export async function GET(): Promise<Response> {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ routes: [] }, { status: 200 });
  }

  const entries = await fg(['src/app/**/page.{tsx,ts,jsx,js}'], {
    ignore: ['src/app/api/**', 'node_modules/**', '.next/**'],
    dot: false,
    onlyFiles: true,
    cwd: process.cwd(),
  });

  const routes = entries
    .map((p) => normalizeRoute(p))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a.localeCompare(b, 'en'));

  return NextResponse.json({ routes });
}
