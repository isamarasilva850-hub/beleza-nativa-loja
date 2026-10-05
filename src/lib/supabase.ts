import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'operador' | 'vendedor' | 'financeiro';
  created_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  nome: string;
  telefone: string;
  etapa: string;
  proximaAcao: string;
  proximaData: string;
  notas: string;
  ultimaRespostaDato: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Message {
  id: string;
  lead_id: string;
  tipo: 'enviada' | 'recebida';
  texto: string;
  timestamp: string;
}

export interface Template {
  id: string;
  user_id: string;
  etapa: string;
  conteudo: string;
  criado_em: string;
}

export interface AuditLog {
  id: number;
  user_id: string;
  acao: string;
  tabela: string;
  registro_id: string;
  dados_antigos: any;
  dados_novos: any;
  criado_em: string;
}
