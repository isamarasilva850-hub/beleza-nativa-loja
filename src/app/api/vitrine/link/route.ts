import { negarSeNaoAdmin } from '@/lib/sessao';
import { tokenVitrine } from '@/lib/vitrine-token';
import { NextRequest, NextResponse } from 'next/server';

// Entrega a assinatura do link de edição da vitrine (só a equipe)
export async function GET(request: NextRequest) {
  { const negado = negarSeNaoAdmin(request, ['admin', 'palmira']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  const pedidoId = request.nextUrl.searchParams.get('pedidoId');
  if (!pedidoId) return NextResponse.json({ error: 'pedidoId é obrigatório' }, { status: 400 });
  try {
    return NextResponse.json({ k: tokenVitrine(pedidoId) });
  } catch (error) {
    console.error('Erro ao gerar link da vitrine:', error);
    return NextResponse.json({ error: 'Não foi possível gerar o link.' }, { status: 500 });
  }
}
