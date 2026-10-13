import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { negarSeNaoAdmin } from '@/lib/sessao';
import { invalidarCatalogo } from '@/lib/cache-catalogo';

// Correção de nomes de cor de produtos antigos (do arquivo). Guardado em crm_dados, chave "ajustes_cor":
// { "<ref>": { "<cor original>": "<cor corrigida>" } }. A loja aplica esses nomes ao montar os produtos.
const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

async function lerAjustes(): Promise<Record<string, Record<string, string>>> {
  const { data } = await supabase().from('crm_dados').select('valor').eq('chave', 'ajustes_cor').maybeSingle();
  return data?.valor && typeof data.valor === 'object' ? (data.valor as any) : {};
}

export async function GET(request: NextRequest) {
  const negado = negarSeNaoAdmin(request, ['admin', 'palmira']);
  if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status });
  try {
    return NextResponse.json(await lerAjustes());
  } catch (error) {
    console.error('Erro ao ler ajustes de cor:', error);
    return NextResponse.json({ error: 'Não foi possível carregar.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const negado = negarSeNaoAdmin(request, ['admin', 'palmira']);
  if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status });
  try {
    const body = await request.json();
    const ref = String(body.ref || '').trim();
    const mapa: Record<string, string> = body.mapa && typeof body.mapa === 'object' ? body.mapa : {};
    if (!ref) return NextResponse.json({ error: 'Informe a referência do produto.' }, { status: 400 });

    // Só guarda nomes preenchidos e diferentes do original
    const limpo: Record<string, string> = {};
    for (const [original, nova] of Object.entries(mapa)) {
      const n = String(nova || '').trim();
      if (n && n !== original) limpo[original] = n;
    }

    const atuais = await lerAjustes();
    if (Object.keys(limpo).length === 0) delete atuais[ref];
    else atuais[ref] = limpo;

    const { error } = await supabase()
      .from('crm_dados')
      .upsert({ chave: 'ajustes_cor', valor: atuais }, { onConflict: 'chave' });
    if (error) throw error;
    invalidarCatalogo();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao salvar ajustes de cor:', error);
    return NextResponse.json({ error: 'Não foi possível salvar as cores.' }, { status: 500 });
  }
}
