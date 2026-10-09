const { requireAdmin, supabaseRequest } = require('../../lib/admin-auth');
module.exports = async function handler(req, res) {
  if (!['GET','POST','PATCH','DELETE'].includes(req.method)) return res.status(405).json({ error: 'Método não permitido' });
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const vehicles = await supabaseRequest('/rest/v1/vehicles?select=*&order=created_at.desc');
      return res.status(200).json({ vehicles });
    }
    const body = req.body || {};
    if (req.method === 'POST') {
      const payload = { brand: body.brand, model: body.model, version: body.version || '', price: Number(body.price), year: Number(body.year), km: Number(body.km || 0), fuel: body.fuel || 'Flex', transmission: body.transmission || 'Manual', color: body.color || '', description: body.description || '', active: body.active !== false, featured: body.featured === true, photos: Array.isArray(body.photos) ? body.photos : [] };
      if (!payload.brand || !payload.model || !payload.year || !payload.photos.length) return res.status(400).json({ error: 'Informe marca, modelo, ano e ao menos uma foto.' });
      const result = await supabaseRequest('/rest/v1/vehicles', { method: 'POST', headers: { 'Content-Type':'application/json', Prefer:'return=representation' }, body: JSON.stringify(payload) });
      return res.status(201).json({ vehicle: result && result[0] });
    }
    const id = String(body.id || '');
    if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: 'ID de veículo inválido.' });
    if (req.method === 'PATCH') {
      const allowed = ['brand','model','version','price','year','km','fuel','transmission','color','description','active','featured','photos'];
      const payload = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
      const result = await supabaseRequest('/rest/v1/vehicles?id=eq.' + encodeURIComponent(id), { method:'PATCH', headers:{'Content-Type':'application/json',Prefer:'return=representation'}, body:JSON.stringify(payload) });
      return res.status(200).json({ vehicle: result && result[0] });
    }
    await supabaseRequest('/rest/v1/vehicles?id=eq.' + encodeURIComponent(id), { method:'DELETE', headers:{Prefer:'return=minimal'} });
    return res.status(200).json({ ok:true });
  } catch (error) { console.error('Admin vehicles error:', error.message); return res.status(500).json({ error: 'Erro ao acessar o banco de dados. Confira as variáveis e a tabela vehicles no Supabase.' }); }
};
