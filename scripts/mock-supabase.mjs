// Local integration-test fixture only. Never used by the application or deployed to Supabase.
import http from 'node:http';
const user = { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated', email: 'admin@example.test', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const token = [Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'), Buffer.from(JSON.stringify({ sub: user.id, role: 'authenticated', aud: 'authenticated', exp: Math.floor(Date.now()/1000)+86400, iat: Math.floor(Date.now()/1000) })).toString('base64url'), 'test-signature'].join('.');
const state = { site_content: [], site_images: [], podcast_series: [], book_downloads: [] };
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
  if(req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  const url = new URL(req.url, 'http://127.0.0.1');
  const chunks = []; for await(const chunk of req) chunks.push(chunk);
  const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : null;
  const send = (value, status = 200) => { res.writeHead(status, { 'Content-Type':'application/json' }); res.end(JSON.stringify(value)); };
  if(url.pathname === '/test/state') return send(state);
  if(url.pathname === '/test/fail-downloads') { state.failDownloads = Boolean(body?.fail); return send({ok:true}); }
  if(url.pathname === '/auth/v1/token') return send({ access_token: token, refresh_token: 'test-refresh', expires_in: 86400, expires_at: Math.floor(Date.now()/1000)+86400, token_type: 'bearer', user });
  if(url.pathname === '/auth/v1/user') return req.headers.authorization?.includes(token) ? send(user) : send({ message: 'Invalid JWT', code: 'bad_jwt' },401);
  if(url.pathname === '/auth/v1/logout') return send({});
  if(url.pathname.startsWith('/rest/v1/')) {
    const table = url.pathname.split('/').pop();
    if(table === 'user_roles') return send(req.headers.authorization?.includes(token) ? [{ user_id:user.id, role:'admin' }] : []);
    if(!(table in state) || !Array.isArray(state[table])) return send({message:'Unknown table'},404);
    if(table === 'book_downloads' && state.failDownloads && req.method === 'POST') return send({ message:'Test insert rejected' },403);
    if(req.method === 'POST') {
      for(const row of Array.isArray(body) ? body : [body]) state[table].push({ id:crypto.randomUUID(), updated_at:new Date().toISOString(), ...row });
      return send(null,201);
    }
    if(req.method === 'PATCH' || req.method === 'DELETE') {
      const id = url.searchParams.get('id')?.replace('eq.','');
      if(req.method === 'PATCH') state[table] = state[table].map(row => row.id === id ? {...row,...body} : row);
      else state[table] = state[table].filter(row=> row.id !== id);
      return send(null);
    }
    let rows = state[table];
    const category = url.searchParams.get('category')?.replace('eq.','');
    if(category) rows = rows.filter(row => row.category === category);
    res.setHeader('Content-Range', `0-${Math.max(0,rows.length-1)}/${rows.length}`);
    return send(rows);
  }
  send({message:'Not found'},404);
});
server.listen(54329,'127.0.0.1',()=>console.log('Supabase test fixture ready on 54329'));
