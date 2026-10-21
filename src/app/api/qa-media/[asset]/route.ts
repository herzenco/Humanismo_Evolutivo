import { get } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { qaMediaAssets } from '@/config/home-videos';
import { QA_COOKIE, qaGateEnabled, qaGateConfig, validQaSession } from '@/lib/qa-gate';
import { privateQaResponse, qaRequestOrigin } from '@/lib/qa-gate-response';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;
type Context = { params: Promise<{ asset: string }> };

async function serve(request: NextRequest, context: Context, head = false) {
  if (!qaGateEnabled()) return new NextResponse(null,{status:404});
  try {
    if (!validQaSession(request.cookies.get(QA_COOKIE)?.value,new URL(qaRequestOrigin(request)).host,qaGateConfig())) {
      return privateQaResponse(new NextResponse(null,{status:401}));
    }
  } catch { return privateQaResponse(new NextResponse(null,{status:503})); }
  const id = (await context.params).asset;
  const asset = Object.hasOwn(qaMediaAssets,id) ? qaMediaAssets[id] : undefined;
  if (!asset) return privateQaResponse(new NextResponse(null,{status:404}));
  if (!process.env.QA_MEDIA_STORE_ID) return privateQaResponse(new NextResponse(null,{status:503}));
  const range = request.headers.get('range');
  if (range && !/^bytes=(\d+-\d*|-\d+)$/.test(range)) return privateQaResponse(new NextResponse(null,{status:416}));
  try {
    const result = await get(asset.pathname, {
      access:'private', storeId:process.env.QA_MEDIA_STORE_ID,
      oidcToken:process.env.VERCEL_OIDC_TOKEN,
      abortSignal:request.signal,
      ...(range ? {headers:{Range:range}} : {}),
    });
    if (!result || result.statusCode !== 200) return privateQaResponse(new NextResponse(null,{status:404}));
    const headers = new Headers({'Content-Type':asset.contentType,'Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff'});
    for (const name of ['content-length','content-range']) {
      const value = result.headers.get(name);if(value)headers.set(name,value);
    }
    if (head) await result.stream.cancel();
    return privateQaResponse(new NextResponse(head ? null : result.stream, {status:headers.has('content-range') ? 206 : 200,headers}));
  } catch (error) {
    if (!request.signal.aborted) console.error('qa_media_read_failed', {kind:error instanceof Error ? error.name : 'Unknown'});
    return privateQaResponse(new NextResponse(null,{status:502}));
  }
}
export async function GET(request: NextRequest, context: Context) {return serve(request,context);}
export async function HEAD(request: NextRequest, context: Context) {return serve(request,context,true);}
