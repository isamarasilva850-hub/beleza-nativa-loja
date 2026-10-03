import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('crm_propostas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao carregar propostas:', error);
    return NextResponse.json({
      error: 'Erro ao carregar propostas',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await request.json();
    const { data, error } = await supabase
      .from('crm_propostas')
      .insert({
        id: body.id || Date.now().toString(),
        numero: body.numero,
        cliente_id: body.clienteId,
        cliente_nome: body.clienteNome,
        valor: body.valor,
        status: body.status || 'rascunho',
        data_envio: body.dataEnvio || new Date().toISOString().split('T')[0],
        data_vencimento: body.dataVencimento,
        itens: body.itens || 1,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar proposta:', error);
    return NextResponse.json({ error: 'Erro ao criar proposta' }, { status: 500 });
  }
}
