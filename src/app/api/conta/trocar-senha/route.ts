import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { conferirSenha, gerarHashSenha } from '@/lib/senha';

// A própria cliente troca a senha: precisa informar a senha atual.
const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const login = String(body.login || '').trim().toLowerCase();
    const senhaAtual = String(body.senhaAtual || '');
    const senhaNova = String(body.senhaNova || '');

    if (senhaNova.length < 4) {
      return NextResponse.json({ error: 'A nova senha deve ter pelo menos 4 caracteres.' }, { status: 400 });
    }

    const db = supabase();
    const { data: conta } = await db.from('clientes_conta').select('login, senha_hash').eq('login', login).maybeSingle();

    if (!conta || !(await conferirSenha(senhaAtual, conta.senha_hash))) {
      return NextResponse.json({ error: 'A senha atual está incorreta.' }, { status: 401 });
    }

    const { error } = await db
      .from('clientes_conta')
      .update({ senha_hash: await gerarHashSenha(senhaNova) })
      .eq('login', login);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    return NextResponse.json({ error: 'Não foi possível trocar a senha agora.' }, { status: 500 });
  }
}
