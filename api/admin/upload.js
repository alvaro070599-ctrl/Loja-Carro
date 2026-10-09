const crypto = require('crypto');
const { requireAdmin, config } = require('../../lib/admin-auth');
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  if (!requireAdmin(req, res)) return;
  try {
    const { fileName, contentType, base64 } = req.body || {};
    const allowed = ['image/jpeg','image/png','image/webp','image/avif'];
    if (!allowed.includes(contentType) || typeof base64 !== 'string') return res.status(400).json({ error: 'Formato de imagem inválido.' });
    const bytes = Buffer.from(base64, 'base64');
    if (!bytes.length || bytes.length > 8 * 1024 * 1024) return res.status(413).json({ error: 'Cada foto deve ter no máximo 8 MB.' });
    const ext = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'})[contentType];
    const name = crypto.randomUUID() + '.' + ext;
    const {url,key} = config();
    const response = await fetch(url + '/storage/v1/object/vehicle-photos/admin/' + name, { method:'POST', headers:{ apikey:key, Authorization:'Bearer '+key, 'Content-Type':contentType, 'x-upsert':'false' }, body:bytes });
    if (!response.ok) { console.error('Storage upload error:', await response.text()); return res.status(502).json({ error:'O armazenamento recusou a foto. Confira se o bucket vehicle-photos existe no Supabase.' }); }
    return res.status(201).json({ url:url + '/storage/v1/object/public/vehicle-photos/admin/' + name });
  } catch (error) { console.error('Upload error:', error.message); return res.status(500).json({ error:'Não foi possível enviar a foto.' }); }
};
