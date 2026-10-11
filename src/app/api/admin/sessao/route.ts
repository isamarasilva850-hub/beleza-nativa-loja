import { NextRequest, NextResponse } from 'next/server';
import { lerToken, COOKIE_SESSAO } from '@/lib/sessao';

// Diz quem está logado no admin (ou 401 se ninguém)
export async function GET(request: NextRequest) {
  const sessao = lerToken(request.cookies.get(COOKIE_SESSAO)?.value);
  if (!sessao) return NextResponse.json({ error: 'Não logado.' }, { status: 401 });
  return NextResponse.json(sessao);
}

// Sair
export async function DELETE() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE_SESSAO, '', { path: '/', maxAge: 0 });
  return resposta;
}
