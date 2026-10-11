import { negarSeNaoAdmin } from '@/lib/sessao';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  { const negado = negarSeNaoAdmin(request, ['admin']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('crm_clientes')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  { const negado = negarSeNaoAdmin(request, ['admin']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );

    const { id } = await params;

    const { error } = await supabase
      .from('crm_clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Cliente deletado' });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return NextResponse.json({ error: 'Erro ao deletar cliente' }, { status: 500 });
  }
}
