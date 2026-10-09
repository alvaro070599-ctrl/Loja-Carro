const { requireAdmin } = require('../../lib/admin-auth');
module.exports = function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });
  if (!requireAdmin(req, res)) return;
  return res.status(200).json({ authenticated: true });
};
