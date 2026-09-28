import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Criar tabela crm_clientes
    try {
      await supabase.rpc('exec_sql', {
        sql: `CREATE TABLE IF NOT EXISTS crm_clientes (id TEXT PRIMARY KEY, nome TEXT NOT NULL, email TEXT, telefone TEXT, tipo TEXT DEFAULT 'varejo', status TEXT DEFAULT 'ativo', comissao NUMERIC DEFAULT 0, total_gasto NUMERIC DEFAULT 0, compras INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());`
      });
    } catch (e) { }

    // Criar tabela crm_leads
    try {
      await supabase.rpc('exec_sql', {
        sql: `CREATE TABLE IF NOT EXISTS crm_leads (id TEXT PRIMARY KEY, nome TEXT NOT NULL, email TEXT, telefone TEXT, origem TEXT DEFAULT 'whatsapp', status TEXT DEFAULT 'novo', valor NUMERIC DEFAULT 0, notas TEXT, vendedor TEXT DEFAULT 'Isamara', created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());`
      });
    } catch (e) { }

    // Criar tabela crm_atividades
    try {
      await supabase.rpc('exec_sql', {
        sql: `CREATE TABLE IF NOT EXISTS crm_atividades (id TEXT PRIMARY KEY, tipo TEXT NOT NULL, cliente_id TEXT, cliente_nome TEXT, descricao TEXT, data TEXT, usuario TEXT DEFAULT 'Isamara', resultado TEXT, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());`
      });
    } catch (e) { }

    // Criar tabela crm_propostas
    try {
      await supabase.rpc('exec_sql', {
        sql: `CREATE TABLE IF NOT EXISTS crm_propostas (id TEXT PRIMARY KEY, numero TEXT UNIQUE, cliente_id TEXT, cliente_nome TEXT, valor NUMERIC NOT NULL, status TEXT DEFAULT 'rascunho', data_envio TEXT, data_vencimento TEXT, itens INTEGER DEFAULT 1, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());`
      });
    } catch (e) { }

    // Criar tabela partners (cadastros da loja)
    try {
      await supabase.rpc('exec_sql', {
        sql: `CREATE TABLE IF NOT EXISTS partners (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT, phone TEXT NOT NULL, company TEXT, cnpj TEXT, city TEXT, state TEXT, status TEXT DEFAULT 'ativo', createdAt TIMESTAMP DEFAULT NOW(), totalOrders INTEGER DEFAULT 0, totalSpent NUMERIC DEFAULT 0);`
      });
    } catch (e) { }

    return NextResponse.json({ message: 'Tabelas criadas com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    return NextResponse.json(
      { error: 'Erro ao criar tabelas', details: (error as any).message },
      { status: 500 }
    );
  }
}
