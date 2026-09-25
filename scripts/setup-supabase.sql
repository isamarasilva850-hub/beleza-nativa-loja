-- ============ PARTNERS ============
CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  cnpj TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  state TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  createdAt TIMESTAMP DEFAULT NOW(),
  totalOrders INTEGER DEFAULT 0,
  totalSpent DECIMAL(10, 2) DEFAULT 0,
  markupPercentage DECIMAL(5, 2),
  logo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  partnerId TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  partnerName TEXT NOT NULL,
  partnerPhone TEXT NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ RESELLER PURCHASES ============
CREATE TABLE IF NOT EXISTS reseller_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partnerId TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  productId INTEGER NOT NULL,
  ref TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  purchaseDate TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ SHOPPING CARTS ============
CREATE TABLE IF NOT EXISTS shopping_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partnerId TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  productId INTEGER NOT NULL,
  ref TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ ÍNDICES PARA PERFORMANCE ============
CREATE INDEX IF NOT EXISTS idx_orders_partnerId ON orders(partnerId);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reseller_purchases_partnerId ON reseller_purchases(partnerId);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_partnerId ON shopping_carts(partnerId);

-- ============ RLS (ROW LEVEL SECURITY) - OPCIONAL ============
-- Se quiser segurança mais rigorosa, descomente:
/*
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
*/
