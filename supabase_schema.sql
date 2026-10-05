-- Tabela de usuários (estendida do auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'operador' CHECK (role IN ('admin', 'operador', 'vendedor', 'financeiro')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  etapa TEXT DEFAULT 'abrir' CHECK (etapa IN ('abrir', 'conectar', 'diagnosticar', 'divulgacao', 'personalizar', 'apresentar', 'negociar', 'convertido')),
  proximaAcao TEXT,
  proximaData DATE,
  notas TEXT,
  ultimaRespostaDato TIMESTAMP,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, telefone)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('enviada', 'recebida')),
  texto TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Tabela de templates
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, etapa)
);

-- Tabela de histórico de ações (auditoria)
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  tabela TEXT,
  registro_id TEXT,
  dados_antigos JSONB,
  dados_novos JSONB,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  numero INT UNIQUE,
  data TIMESTAMP DEFAULT NOW(),
  revendedora TEXT NOT NULL,
  total DECIMAL(10, 2),
  totalItems INT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'enviado', 'entregue', 'cancelado')),
  items JSONB,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_etapa ON leads(etapa);
CREATE INDEX idx_leads_proximaData ON leads(proximaData);
CREATE INDEX idx_messages_lead_id ON messages(lead_id);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_criado_em ON audit_log(criado_em);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Row Level Security (RLS) - Usuários veem apenas seus dados
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários veem seus leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários modificam seus leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários inserem seus leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários veem mensagens de seus leads" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leads WHERE leads.id = messages.lead_id AND leads.user_id = auth.uid()
    )
  );

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários veem seus templates" ON templates
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários modificam seus templates" ON templates
  FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários veem seus pedidos" ON orders
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários veem seu histórico" ON audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- Função para auto-atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
