import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { aparelho, nome, telefone, pagina } = await request.json();

    if (!aparelho) {
      return NextResponse.json({ error: 'aparelho é obrigatório' }, { status: 400 });
    }

    const { error } = await supabase()
      .from('visitas')
      .insert({
        aparelho: String(aparelho).slice(0, 80),
        nome: nome ? String(nome).slice(0, 120) : null,
        telefone: telefone ? String(telefone).slice(0, 30) : null,
        pagina: pagina ? String(pagina).slice(0, 200) : null,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase()
      .from('visitas')
      .select('aparelho, nome, telefone, pagina, criado_em')
      .order('criado_em', { ascending: false })
      .limit(2000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const porAparelho = new Map<string, any>();
    for (const v of data || []) {
      const atual = porAparelho.get(v.aparelho);
      if (!atual) {
        porAparelho.set(v.aparelho, {
          aparelho: v.aparelho,
          nome: v.nome,
          telefone: v.telefone,
          ultimaVisita: v.criado_em,
          ultimaPagina: v.pagina,
          totalVisitas: 1,
        });
      } else {
        atual.totalVisitas += 1;
        if (!atual.nome && v.nome) atual.nome = v.nome;
        if (!atual.telefone && v.telefone) atual.telefone = v.telefone;
      }
    }

    return NextResponse.json([...porAparelho.values()]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
