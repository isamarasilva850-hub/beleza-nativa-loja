import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { conferirSenha, gerarHashSenha } from '@/lib/senha';

// Passo 2 do "Esqueci minha senha": confere o código recebido por WhatsApp e grava a senha nova.
// Máximo de 5 tentativas por código, e o código vale por 10 minutos.

const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

const MAX_TENTATIVAS = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const digitos = String(body.telefone || '').replace(/\D/g, '');
    const codigo = String(body.codigo || '').replace(/\D/g, '');
    const senhaNova = String(body.senhaNova || '');

    if (senhaNova.length < 4) {
      return NextResponse.json({ error: 'A nova senha deve ter pelo menos 4 caracteres.' }, { status: 400 });
    }

    const login = `${digitos}@belezanativa.local`;
    const db = supabase();
    const { data: conta } = await db
      .from('clientes_conta')
      .select('login, reset_codigo_hash, reset_expira, reset_tentativas')
      .eq('login', login)
      .maybeSingle();

    const invalido = { error: 'Código inválido ou vencido. Peça um novo código.' };
    if (!conta || !conta.reset_codigo_hash || !conta.reset_expira) {
      return NextResponse.json(invalido, { status: 400 });
    }
    if (new Date(conta.reset_expira).getTime() < Date.now() || (conta.reset_tentativas || 0) >= MAX_TENTATIVAS) {
      return NextResponse.json(invalido, { status: 400 });
    }

    if (!(await conferirSenha(codigo, conta.reset_codigo_hash))) {
      await db
        .from('clientes_conta')
        .update({ reset_tentativas: (conta.reset_tentativas || 0) + 1 })
        .eq('login', login);
      return NextResponse.json(invalido, { status: 400 });
    }

    const { error } = await db
      .from('clientes_conta')
      .update({
        senha_hash: await gerarHashSenha(senhaNova),
        reset_codigo_hash: null,
        reset_expira: null,
        reset_tentativas: 0,
      })
      .eq('login', login);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao redefinir senha com código:', error);
    return NextResponse.json({ error: 'Não foi possível redefinir a senha agora.' }, { status: 500 });
  }
}
