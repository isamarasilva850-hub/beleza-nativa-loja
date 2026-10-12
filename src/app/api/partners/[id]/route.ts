import { negarSeNaoAdmin } from '@/lib/sessao';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Troca a vendedora responsável por uma revendedora (só a equipe)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  { const negado = negarSeNaoAdmin(request, ['admin']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  try {
    const { id } = await params;
    const body = await request.json();
    const vendedor = typeof body.vendedor === 'string' ? body.vendedor.trim() : '';
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );
    const { data, error } = await supabase
      .from('partners')
      .update({ vendedor: vendedor || null })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar parceiro' }, { status: 500 });
  }
}
