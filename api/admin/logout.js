const { clearSession } = require('../../lib/admin-auth');
module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  clearSession(res);
  return res.status(200).json({ ok: true });
};
