import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(request: NextRequest) {
  try {
    const chave = request.nextUrl.searchParams.get('chave');
    if (!chave) {
      return NextResponse.json({ error: 'chave é obrigatória' }, { status: 400 });
    }

    const { data, error } = await supabase()
      .from('crm_dados')
      .select('valor')
      .eq('chave', chave)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ valor: data?.valor ?? null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { chave, valor } = await request.json();
    if (!chave || valor === undefined) {
      return NextResponse.json({ error: 'chave e valor são obrigatórios' }, { status: 400 });
    }

    const { error } = await supabase()
      .from('crm_dados')
      .upsert({ chave, valor, atualizado_em: new Date().toISOString() }, { onConflict: 'chave' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
