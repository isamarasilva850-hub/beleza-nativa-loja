import { negarSeNaoAdmin } from '@/lib/sessao';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!);

// Manda para o WhatsApp da Isa quem visitou o site identificado (nome e telefone).
// Só avisa na primeira visita identificada do dia de cada aparelho.
async function avisarVisitaIdentificada(db: any, aparelho: string, nome: string, telefone: string, pagina: string) {
  const apiKey = process.env.WASENDER_API_KEY;
  const meuNumero = process.env.LEMBRETE_TELEFONE;
  if (!apiKey || !meuNumero) return;

  const hojeBrasil = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const inicioDoDia = new Date(`${hojeBrasil}T00:00:00-03:00`).toISOString();
  const { count } = await db
    .from('visitas')
    .select('id', { count: 'exact', head: true })
    .eq('aparelho', aparelho)
    .not('telefone', 'is', null)
    .gte('criado_em', inicioDoDia);
  if ((count || 0) > 1) return; // já avisou hoje

  await fetch('https://wasenderapi.com/api/send-message', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: meuNumero,
      text: `👀 Visita no site\n\nNome: ${nome}\nWhatsApp: ${telefone}\nÚltima página: ${pagina}\n\nVale entrar em contato.`,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { aparelho, nome, telefone, pagina } = await request.json();

    if (!aparelho) {
      return NextResponse.json({ error: 'aparelho é obrigatório' }, { status: 400 });
    }

    const db = supabase();
    const { error } = await db
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

    // Visitante identificado (com WhatsApp): avisa a Isa, só na primeira visita do dia
    if (telefone) {
      avisarVisitaIdentificada(db, String(aparelho).slice(0, 80), String(nome || 'Sem nome').slice(0, 120), String(telefone).slice(0, 30), String(pagina || '/').slice(0, 200)).catch((err) =>
        console.error('Erro ao avisar visita', err)
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  { const negado = negarSeNaoAdmin(request, ['admin']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
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
