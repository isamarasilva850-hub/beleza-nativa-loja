import { SupabaseClient } from '@supabase/supabase-js';

// Lista de REFs excluídas pela equipe (guardada em crm_dados, chave "produtos_ocultos").
// Serve também para produtos do catálogo original, que não existem no banco.
const CHAVE = 'produtos_ocultos';

export async function lerOcultos(supabase: SupabaseClient): Promise<string[]> {
  const { data } = await supabase.from('crm_dados').select('valor').eq('chave', CHAVE).maybeSingle();
  return Array.isArray(data?.valor) ? data!.valor.map(String) : [];
}

export async function salvarOcultos(supabase: SupabaseClient, refs: string[]) {
  const unicas = [...new Set(refs.map(String))];
  const { error } = await supabase.from('crm_dados').upsert({ chave: CHAVE, valor: unicas }, { onConflict: 'chave' });
  if (error) throw error;
}
