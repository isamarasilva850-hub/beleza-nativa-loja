import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('crm_propostas')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar proposta:', error);
    return NextResponse.json({ error: 'Erro ao atualizar proposta' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { id } = await params;

    const { error } = await supabase
      .from('crm_propostas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Proposta deletada' });
  } catch (error) {
    console.error('Erro ao deletar proposta:', error);
    return NextResponse.json({ error: 'Erro ao deletar proposta' }, { status: 500 });
  }
}
