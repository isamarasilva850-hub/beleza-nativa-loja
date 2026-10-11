import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Conta um uso do cupom quando a compra é confirmada. Pública, mas só soma 1 ao cupom
// (não permite alterar a lista de cupons).
const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const codigo = String(body.code || '').trim().toUpperCase();
    if (!codigo) return NextResponse.json({ error: 'Código obrigatório' }, { status: 400 });

    const db = supabase();
    const { data } = await db.from('crm_dados').select('valor').eq('chave', 'cupons').maybeSingle();
    const lista: any[] = Array.isArray(data?.valor) ? data!.valor : [];

    let achou = false;
    const atualizada = lista.map((c) => {
      if (String(c.code).toUpperCase() !== codigo) return c;
      achou = true;
      return { ...c, usedCount: (c.usedCount || 0) + 1, lastUsedAt: new Date().toISOString() };
    });
    if (!achou) return NextResponse.json({ error: 'Cupom não encontrado' }, { status: 404 });

    const { error } = await db.from('crm_dados').upsert({ chave: 'cupons', valor: atualizada }, { onConflict: 'chave' });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao contar uso do cupom:', error);
    return NextResponse.json({ error: 'Não foi possível registrar o uso.' }, { status: 500 });
  }
}
