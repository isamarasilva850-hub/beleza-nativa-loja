import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { negarSeNaoAdmin } from '@/lib/sessao';

// Pessoas que preencheram nome e WhatsApp na página "Quero começar" mas não enviaram o formulário
// (não viraram lead). Só a equipe vê.
const supabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!);

export async function GET(request: NextRequest) {
  const negado = negarSeNaoAdmin(request, ['admin']);
  if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status });
  try {
    const db = supabase();
    const { data: visitas, error } = await db
      .from('visitas')
      .select('nome, telefone, pagina, criado_em')
      .not('telefone', 'is', null)
      .like('pagina', '/quero-comecar%')
      .order('criado_em', { ascending: false })
      .limit(2000);
    if (error) throw error;

    const { data: leads } = await db.from('crm_leads').select('telefone');
    const jaViraramLead = new Set((leads || []).map((l: any) => String(l.telefone || '').replace(/\D/g, '')));

    // Agrupa por WhatsApp: última visita, nome informado e quantas vezes voltou
    const porTelefone = new Map<string, { nome: string; telefone: string; ultimaVisita: string; visitas: number }>();
    for (const v of visitas || []) {
      const digitos = String(v.telefone || '').replace(/\D/g, '');
      if (!digitos || jaViraramLead.has(digitos)) continue;
      const atual = porTelefone.get(digitos);
      if (atual) {
        atual.visitas += 1;
      } else {
        porTelefone.set(digitos, { nome: v.nome || '', telefone: v.telefone, ultimaVisita: v.criado_em, visitas: 1 });
      }
    }

    return NextResponse.json([...porTelefone.values()]);
  } catch (error) {
    console.error('Erro ao listar interessadas:', error);
    return NextResponse.json({ error: 'Não foi possível carregar a lista.' }, { status: 500 });
  }
}
