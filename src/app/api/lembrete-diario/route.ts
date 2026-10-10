import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const hojeISO = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

export async function GET(request: NextRequest) {
  try {
    const segredo = process.env.CRON_SECRET;
    if (segredo && request.headers.get('authorization') !== `Bearer ${segredo}`) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const apiKey = process.env.WASENDER_API_KEY;
    const meuNumero = process.env.LEMBRETE_TELEFONE;
    if (!apiKey || !meuNumero) {
      return NextResponse.json({ error: 'Configure WASENDER_API_KEY e LEMBRETE_TELEFONE' }, { status: 500 });
    }

    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data, error } = await db.from('crm_dados').select('valor').eq('chave', 'leads').maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const leads: any[] = Array.isArray(data?.valor) ? data.valor : [];
    const hoje = hojeISO();
    const pendentes = leads
      .filter((l) => l.proximaData && l.proximaData <= hoje && l.telefone)
      .sort((a, b) => (a.proximaData < b.proximaData ? -1 : 1));

    if (pendentes.length === 0) {
      return NextResponse.json({ enviado: false, motivo: 'Nenhum contato para hoje' });
    }

    const linhas = pendentes.map((l, i) => {
      const data = l.proximaData.split('-').reverse().join('/');
      return `${i + 1}. ${l.nome} (${l.telefone}) - etapa: ${l.etapa || '—'} - previsto: ${data}`;
    });

    const texto = `🔔 Falar hoje com:\n\n${linhas.join('\n')}\n\nAbra o Follow-up no admin para ver as mensagens prontas.`;

    const resposta = await fetch('https://wasenderapi.com/api/send-message', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: meuNumero, text: texto }),
    });

    const retorno = await resposta.text();
    if (!resposta.ok) {
      return NextResponse.json({ error: 'Falha ao enviar', status: resposta.status, retorno }, { status: 502 });
    }

    return NextResponse.json({ enviado: true, quantidade: pendentes.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
