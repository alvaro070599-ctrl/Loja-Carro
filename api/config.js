module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json({
    storeName: process.env.STORE_NAME || 'Sua Loja de Veículos',
    storeSubtitle: process.env.STORE_SUBTITLE || 'VEÍCULOS SELECIONADOS',
    whatsapp: process.env.WHATSAPP_NUMBER || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || ''
  });
};
