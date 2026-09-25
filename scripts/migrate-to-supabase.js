/**
 * Script de migração: localStorage → Supabase
 * USAR APENAS NO NAVEGADOR (DevTools Console)
 *
 * Copie e cole todo este código no console do navegador
 */

async function migrateData() {
  console.log("🚀 Iniciando migração de dados...\n");

  // ============ IMPORTAR SUPABASE ============
  const { createClient } = window.supabase;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "❌ Variáveis de ambiente não encontradas. Verifique .env.local"
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("✅ Conectado ao Supabase\n");

  // ============ MIGRAR PARTNERS ============
  console.log("📍 Migrando Partners...");
  const partnersData = localStorage.getItem("belezanativa_partners");
  if (partnersData) {
    const partners = JSON.parse(partnersData);
    for (const partner of partners) {
      const { error } = await supabase.from("partners").insert([partner]);
      if (error) {
        console.warn(`⚠️  Erro ao inserir ${partner.name}:`, error.message);
      } else {
        console.log(`✅ ${partner.name} migrado`);
      }
    }
  } else {
    console.log("⏭️  Nenhum partner para migrar");
  }

  // ============ MIGRAR ORDERS ============
  console.log("\n📍 Migrando Orders...");
  const ordersData = localStorage.getItem("belezanativa_orders");
  if (ordersData) {
    const orders = JSON.parse(ordersData);
    for (const order of orders) {
      const { error } = await supabase.from("orders").insert([
        {
          id: order.id,
          partnerId: order.partnerId,
          partnerName: order.partnerName,
          partnerPhone: order.partnerPhone,
          items: JSON.stringify(order.items),
          total: order.total,
          date: order.date,
          status: order.status,
        },
      ]);
      if (error) {
        console.warn(`⚠️  Erro ao inserir pedido ${order.id}:`, error.message);
      } else {
        console.log(`✅ Pedido ${order.id} migrado`);
      }
    }
  } else {
    console.log("⏭️  Nenhum order para migrar");
  }

  // ============ MIGRAR RESELLER PURCHASES ============
  console.log("\n📍 Migrando Reseller Purchases...");
  const allKeys = Object.keys(localStorage);
  const purchaseKeys = allKeys.filter((key) =>
    key.startsWith("belezanativa_purchases_")
  );

  for (const key of purchaseKeys) {
    const partnerId = key.replace("belezanativa_purchases_", "");
    const purchasesData = localStorage.getItem(key);
    if (purchasesData) {
      const purchases = JSON.parse(purchasesData);
      for (const purchase of purchases) {
        const { error } = await supabase
          .from("reseller_purchases")
          .insert([
            {
              partnerId,
              ...purchase,
            },
          ]);
        if (error) {
          console.warn(`⚠️  Erro ao inserir compra:`, error.message);
        } else {
          console.log(
            `✅ Compra ${purchase.ref} de ${partnerId.slice(0, 4)}... migrada`
          );
        }
      }
    }
  }

  // ============ MIGRAR SHOPPING CARTS ============
  console.log("\n📍 Migrando Shopping Carts...");
  const cartKeys = allKeys.filter((key) =>
    key.startsWith("catalogo_cart_")
  );

  for (const key of cartKeys) {
    const partnerId = key.replace("catalogo_cart_", "");
    const cartData = localStorage.getItem(key);
    if (cartData) {
      const cartItems = JSON.parse(cartData);
      for (const item of cartItems) {
        const { error } = await supabase.from("shopping_carts").insert([
          {
            partnerId,
            ...item,
          },
        ]);
        if (error) {
          console.warn(`⚠️  Erro ao inserir item carrinho:`, error.message);
        } else {
          console.log(
            `✅ Item ${item.ref} carrinho de ${partnerId.slice(0, 4)}... migrado`
          );
        }
      }
    }
  }

  console.log(
    "\n✅ MIGRAÇÃO CONCLUÍDA!\n\n📊 Próximos passos:\n1. Atualizar componentes pra usar Supabase\n2. Testar tudo\n3. Deletar dados antigos de localStorage (se tudo funcionar)"
  );
}

// Executar migração
migrateData().catch(console.error);
