(async () => {
  console.log('🚀 Iniciando migração para Supabase...\n');

  const SUPABASE_URL = 'https://icktrsrkjxjriknfydqr.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_GxT5EwdsNLZADeOPuS4lgg_DG3fZbvg';

  const insertData = async (table, data) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });
    return response.ok;
  };

  try {
    const partners = JSON.parse(localStorage.getItem('partners') || '[]');
    if (partners.length > 0) {
      console.log(`📤 PARTNERS: ${partners.length} registros`);
      for (const p of partners) await insertData('partners', p);
      console.log('✅ PARTNERS OK\n');
    }

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 0) {
      console.log(`📤 ORDERS: ${orders.length} registros`);
      for (const o of orders) await insertData('orders', o);
      console.log('✅ ORDERS OK\n');
    }

    const resellerPurchases = JSON.parse(localStorage.getItem('resellerPurchases') || '[]');
    if (resellerPurchases.length > 0) {
      console.log(`📤 RESELLER PURCHASES: ${resellerPurchases.length} registros`);
      for (const rp of resellerPurchases) await insertData('reseller_purchases', rp);
      console.log('✅ RESELLER PURCHASES OK\n');
    }

    const shoppingCarts = JSON.parse(localStorage.getItem('shoppingCarts') || '[]');
    if (shoppingCarts.length > 0) {
      console.log(`📤 SHOPPING CARTS: ${shoppingCarts.length} registros`);
      for (const sc of shoppingCarts) await insertData('shopping_carts', sc);
      console.log('✅ SHOPPING CARTS OK\n');
    }

    console.log('🎉 MIGRAÇÃO COMPLETA!');
  } catch (error) {
    console.error('❌ ERRO:', error);
  }
})();