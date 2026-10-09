import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const MAX_LOGO = 400_000;

export async function GET(request: NextRequest) {
  try {
    const pedidoId = request.nextUrl.searchParams.get('pedidoId');
    if (!pedidoId) {
      return NextResponse.json({ error: 'pedidoId é obrigatório' }, { status: 400 });
    }

    const db = supabase();
    const { data: pedido, error: pedidoError } = await db
      .from('orders')
      .select('id, partnername, items')
      .eq('id', pedidoId)
      .maybeSingle();

    if (pedidoError) {
      return NextResponse.json({ error: pedidoError.message }, { status: 500 });
    }
    if (!pedido) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }
    const pedidoFormatado = {
      id: pedido.id,
      partnerName: pedido.partnername,
      items: (pedido.items || []).map((i: any) => ({
        ref: i.ref,
        name: i.name,
        color: i.color,
        size: i.size,
        quantity: i.quantity,
      })),
    };

    const { data: vitrine } = await db
      .from('vitrines')
      .select('nome, logo, mensagem, whatsapp, precos')
      .eq('pedido_id', pedidoId)
      .maybeSingle();

    return NextResponse.json({ pedido: pedidoFormatado, vitrine });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pedidoId, nome, logo, mensagem, whatsapp, precos } = await request.json();

    if (!pedidoId) {
      return NextResponse.json({ error: 'pedidoId é obrigatório' }, { status: 400 });
    }
    if (logo && String(logo).length > MAX_LOGO) {
      return NextResponse.json({ error: 'Logo muito grande. Use uma imagem menor.' }, { status: 400 });
    }

    const { error } = await supabase()
      .from('vitrines')
      .upsert(
        {
          pedido_id: pedidoId,
          nome: nome ? String(nome).slice(0, 80) : null,
          logo: logo || null,
          mensagem: mensagem ? String(mensagem).slice(0, 600) : null,
          whatsapp: whatsapp ? String(whatsapp).slice(0, 30) : null,
          precos: precos && typeof precos === 'object' ? precos : {},
          atualizado_em: new Date().toISOString(),
        },
        { onConflict: 'pedido_id' }
      );

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
