import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { conferirSenha } from '@/lib/senha';
import { criarToken, COOKIE_SESSAO, OPCOES_COOKIE } from '@/lib/sessao';

// Entrar no admin com usuário e senha da equipe
const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const usuario = String(body.usuario || '').trim().toLowerCase();
    const senha = String(body.senha || '');

    const { data: conta } = await supabase()
      .from('usuarios_admin')
      .select('usuario, nome, perfil, senha_hash')
      .eq('usuario', usuario)
      .maybeSingle();

    // Mesma resposta para usuário inexistente e senha errada
    if (!conta || !(await conferirSenha(senha, conta.senha_hash))) {
      return NextResponse.json({ error: 'Usuário ou senha incorretos.' }, { status: 401 });
    }

    const resposta = NextResponse.json({ usuario: conta.usuario, nome: conta.nome || conta.usuario, perfil: conta.perfil });
    resposta.cookies.set(COOKIE_SESSAO, criarToken(conta.usuario, conta.perfil), OPCOES_COOKIE);
    return resposta;
  } catch (error) {
    console.error('Erro ao entrar no admin:', error);
    return NextResponse.json({ error: 'Não foi possível entrar agora.' }, { status: 500 });
  }
}
