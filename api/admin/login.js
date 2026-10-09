const crypto = require('crypto');
const { setSession } = require('../../lib/admin-auth');
module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  const expected = process.env.ADMIN_PASSWORD;
  const supplied = String((req.body && req.body.password) || '');
  if (!expected || !process.env.ADMIN_SESSION_SECRET) return res.status(500).json({ error: 'Configure ADMIN_PASSWORD e ADMIN_SESSION_SECRET na Vercel.' });
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'Senha incorreta.' });
  setSession(res);
  return res.status(200).json({ ok: true });
};
