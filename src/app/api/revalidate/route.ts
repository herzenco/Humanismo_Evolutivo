import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getAdminClient } from '@/lib/require-admin';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }
  if (!await getAdminClient()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  revalidateTag('public-content', { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
