import { negarSeNaoAdmin } from '@/lib/sessao';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { invalidarCatalogo } from '@/lib/cache-catalogo';

const COLECOES = ['Lingerie', 'Moda Praia', 'Linha Noite'];

// Troca só a coleção de um produto (sem mexer em cores, fotos ou preço)
export async function POST(request: NextRequest) {
  { const negado = negarSeNaoAdmin(request, ['admin', 'palmira']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  try {
    const { ref, colecao, name, price } = await request.json();
    if (!ref || !COLECOES.includes(colecao)) {
      return NextResponse.json({ error: 'REF e coleção válida são obrigatórias' }, { status: 400 });
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );
    const { data, error } = await supabase
      .from('products')
      .update({ category: colecao })
      .eq('ref', String(ref))
      .select('ref')
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      // Produto do catálogo original (ainda sem cópia no banco): cria a cópia só com a coleção
      const { error: insErr } = await supabase.from('products').insert({
        id: `${ref}-${Date.now().toString(36)}`,
        ref: String(ref),
        name: String(name || ref),
        price: Number(price) || 0,
        category: colecao,
      });
      if (insErr) throw insErr;
    }
    invalidarCatalogo();
    return NextResponse.json({ success: true, ref, colecao });
  } catch (error) {
    console.error('Erro ao trocar coleção:', error);
    return NextResponse.json({ error: 'Erro ao trocar a coleção' }, { status: 500 });
  }
}
