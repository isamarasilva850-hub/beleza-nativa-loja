import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const searchParams = request.nextUrl.searchParams;
    const clienteId = searchParams.get('clienteId');
    const status = searchParams.get('status');
    const dataAte = searchParams.get('dataAte');

    let query = supabase.from('crm_actions').select('*');

    if (clienteId) query = query.eq('cliente_id', clienteId);
    if (status) query = query.eq('status', status);
    if (dataAte) query = query.lte('data_agendada', dataAte);

    const { data, error } = await query.order('data_agendada', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao carregar ações:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar ações', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await request.json();
    const { clienteId, tipo, descricao, dataAgendada, mensagemSugerida } = body;

    if (!clienteId || !tipo || !dataAgendada) {
      return NextResponse.json(
        { error: 'Cliente ID, Tipo e Data são obrigatórios' },
        { status: 400 }
      );
    }

    const actionId = `action_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;

    const { error } = await supabase.from('crm_actions').insert({
      id: actionId,
      cliente_id: clienteId,
      tipo,
      descricao: descricao || '',
      data_agendada: dataAgendada,
      status: 'pendente',
      mensagem_sugerida: mensagemSugerida || '',
    });

    if (error) throw error;

    return NextResponse.json({ id: actionId }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ação', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await request.json();
    const { id, status, descricao } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID da ação é obrigatório' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('crm_actions')
      .update({
        status: status || undefined,
        descricao: descricao || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar ação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar ação', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da ação é obrigatório' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('crm_actions').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar ação:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar ação', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
