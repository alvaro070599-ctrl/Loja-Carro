const crypto = require('crypto');

function cookieOptions(maxAge) {
  return 'admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=' + maxAge;
}
function sign(value) {
  return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(value).digest('base64url');
}
function setSession(res) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const token = payload + '.' + sign(payload);
  res.setHeader('Set-Cookie', 'admin_session=' + token + '; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800');
}
function clearSession(res) { res.setHeader('Set-Cookie', cookieOptions(0)); }
function isAdmin(req) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map(s => s.trim()).find(s => s.startsWith('admin_session='));
  if (!match || !process.env.ADMIN_SESSION_SECRET) return false;
  const token = match.slice('admin_session='.length);
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const expected = sign(parts[0]);
  const a = Buffer.from(parts[1]);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try { return JSON.parse(Buffer.from(parts[0], 'base64url').toString()).exp > Date.now(); } catch (_) { return false; }
}
function requireAdmin(req, res) {
  if (!isAdmin(req)) { res.status(401).json({ error: 'Não autorizado' }); return false; }
  return true;
}
function config(res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY na Vercel.');
  return { url: url.replace(/\/$/, ''), key };
}
async function supabaseRequest(path, options = {}) {
  const {url,key} = config();
  const response = await fetch(url + path, {
    ...options,
    headers: { apikey: key, Authorization: 'Bearer ' + key, ...(options.headers || {}) }
  });
  const body = await response.text();
  if (!response.ok) throw new Error(body || 'Erro do Supabase (' + response.status + ')');
  return body ? JSON.parse(body) : null;
}
module.exports = { setSession, clearSession, requireAdmin, supabaseRequest, config };
