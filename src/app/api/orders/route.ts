import { negarSeNaoAdmin } from '@/lib/sessao';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );
    // Consulta de um pedido pelo número (página de arte do cliente) é pública.
    // A lista completa de pedidos é só da equipe.
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      const negado = negarSeNaoAdmin(request, ['admin']);
      if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status });
    }
    let consulta = supabase.from('orders').select('*');
    if (id) consulta = consulta.eq('id', id);
    const { data, error } = await consulta.order('created_at', { ascending: false });

    if (error) throw error;
    const pedidos = (data || []).map((o: any) => ({
      ...o,
      partnerId: o.partnerid,
      partnerName: o.partnername,
      partnerPhone: o.partnerphone,
    }));
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    return NextResponse.json({ error: 'Erro ao carregar pedidos' }, { status: 500 });
  }
}

// Número da Palmira (com DDI 55), que recebe o aviso de separação
const PALMIRA_WHATSAPP = '5535997380503';

// Envia pelo WaSender a lista de separação. Erros aqui não impedem o pedido de ser salvo.
async function avisarPalmiraSeparar(pedidoId: string, cliente: string, itens: any[]) {
  const apiKey = process.env.WASENDER_API_KEY;
  if (!apiKey) {
    console.error('WASENDER_API_KEY não configurada: aviso para a Palmira não enviado');
    return;
  }
  try {
    const linhas = (itens || []).map((i: any) =>
      `• REF ${i.ref} - ${i.name}\n  ${i.color} | ${i.size} | Qtd: ${i.quantity}`
    );
    const texto = `📦 *PEDIDO #${pedidoId} para separar*\nCliente: ${cliente || 'Não informado'}\n\n${linhas.join('\n')}`;

    const resposta = await fetch('https://wasenderapi.com/api/send-message', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: PALMIRA_WHATSAPP, text: texto }),
    });
    if (!resposta.ok) console.error('WaSender recusou o aviso da Palmira', resposta.status);
  } catch (err) {
    console.error('Erro ao avisar a Palmira', err);
  }
}

// Soma 1 em usedCount do cupom (lista em crm_dados "cupons"). Erro aqui não derruba o pedido.
async function contarUsoCupom(supabase: any, codigo: string) {
  try {
    const alvo = codigo.trim().toUpperCase();
    const { data } = await supabase.from('crm_dados').select('valor').eq('chave', 'cupons').maybeSingle();
    const lista: any[] = Array.isArray(data?.valor) ? data!.valor : [];
    const atualizada = lista.map((c) =>
      String(c.code).toUpperCase() === alvo
        ? { ...c, usedCount: (c.usedCount || 0) + 1, lastUsedAt: new Date().toISOString() }
        : c
    );
    await supabase.from('crm_dados').upsert({ chave: 'cupons', valor: atualizada }, { onConflict: 'chave' });
  } catch (err) {
    console.error('Erro ao contar uso do cupom:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );
    const body = await request.json();
    const { partnerId, partnerName, partnerPhone, items, total, date, status, cupom } = body;

    // partnerId é opcional: pedido do site (cliente sem parceira cadastrada) vai sem ele
    if (!items) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Número do pedido vem do servidor: o ID é o próprio número (ex.: "12").
    // Se duas pessoas gravarem ao mesmo tempo, tenta o número seguinte.
    const { data: existentes, error: erroIds } = await supabase.from('orders').select('id');
    if (erroIds) throw erroIds;
    const numeros = (existentes || []).map((r: any) => String(r.id)).filter((id) => /^\d+$/.test(id)).map(Number);
    let numero = (numeros.length ? Math.max(...numeros) : 0) + 1;

    let data: any = null;
    let error: any = null;
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      const resultado = await supabase
        .from('orders')
        .insert({
          id: String(numero),
          partnerid: partnerId || null,
          partnername: partnerName,
          partnerphone: partnerPhone,
          items: items,
          total: typeof total === 'string' ? parseFloat(total) : total,
          date: date || new Date().toISOString().split('T')[0],
          status: status || 'pendente',
        })
        .select()
        .single();
      data = resultado.data;
      error = resultado.error;
      if (!error) break;
      numero += 1;
    }

    if (error) throw error;

    // Avisa a Palmira para separar o pedido. Se o envio falhar, o pedido continua salvo.
    await avisarPalmiraSeparar(String(data.id), String(data.partnername || ''), items);

    // Conta 1 uso do cupom, só porque o pedido foi salvo de verdade
    if (cupom) await contarUsoCupom(supabase, String(cupom));

    return NextResponse.json(
      { ...data, partnerId: data.partnerid, partnerName: data.partnername, partnerPhone: data.partnerphone },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 });
  }
}
