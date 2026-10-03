import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('crm_atividades')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    return NextResponse.json({
      error: 'Erro ao carregar atividades',
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
      .from('crm_atividades')
      .insert({
        id: body.id || Date.now().toString(),
        tipo: body.tipo,
        cliente_id: body.clienteId,
        cliente_nome: body.clienteNome,
        descricao: body.descricao,
        data: body.data || new Date().toISOString().split('T')[0],
        usuario: body.usuario || 'Isamara',
        resultado: body.resultado || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    return NextResponse.json({ error: 'Erro ao criar atividade' }, { status: 500 });
  }
}
