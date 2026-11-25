import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { newsletterImagePath } from '@/lib/qa-resource-contract';
import { qaResourceReaderConfig } from '@/lib/qa-resources';

export async function GET(request: NextRequest) {
  const path = newsletterImagePath.safeParse(request.nextUrl.searchParams.get('path'));
  const config = qaResourceReaderConfig();
  if (!config || !path.success) return new NextResponse(null, { status: 404 });

  const { url, publishableKey } = config;
  const client = createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
  const { data, error } = await client.storage.from('qa-newsletter-images').download(path.data);
  if (error || !data) return new NextResponse(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  return new NextResponse(data, { headers: {
    'Content-Type': data.type || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  } });
}
