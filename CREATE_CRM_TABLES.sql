-- Criar tabelas CRM para sincronizar entre usuários
-- Execute no Supabase: https://app.supabase.com/project/icktrsrkjxjriknfydqr/sql

CREATE TABLE IF NOT EXISTS crm_clientes (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  tipo TEXT DEFAULT 'varejo',
  status TEXT DEFAULT 'ativo',
  comissao NUMERIC DEFAULT 0,
  total_gasto NUMERIC DEFAULT 0,
  compras INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_leads (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  origem TEXT DEFAULT 'whatsapp',
  status TEXT DEFAULT 'novo',
  valor NUMERIC DEFAULT 0,
  notas TEXT,
  vendedor TEXT DEFAULT 'Isamara',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_atividades (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL,
  cliente_id TEXT,
  cliente_nome TEXT,
  descricao TEXT,
  data TEXT,
  usuario TEXT DEFAULT 'Isamara',
  resultado TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_propostas (
  id TEXT PRIMARY KEY,
  numero TEXT UNIQUE,
  cliente_id TEXT,
  cliente_nome TEXT,
  valor NUMERIC NOT NULL,
  status TEXT DEFAULT 'rascunho',
  data_envio TEXT,
  data_vencimento TEXT,
  itens INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pronto! Agora todos veem os mesmos dados
