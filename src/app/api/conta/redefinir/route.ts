import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import { gerarHashSenha } from '@/lib/senha';

// Redefine a senha de uma cliente com uma senha temporária.
// Exige o segredo ADMIN_RESET_SECRET (configurado na Vercel) no cabeçalho x-admin-secret.
// Sem esse segredo, a rota fica desligada.

const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

function senhaTemporaria(): string {
  // Sem letras confusas (0/O, 1/I/l), para ser fácil de ditar pelo WhatsApp
  const alfabeto = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = randomBytes(8);
  let senha = '';
  for (const b of bytes) senha += alfabeto[b % alfabeto.length];
  return senha;
}

export async function POST(request: NextRequest) {
  const segredo = process.env.ADMIN_RESET_SECRET;
  if (!segredo) {
    return NextResponse.json({ error: 'Redefinição de senha não configurada.' }, { status: 503 });
  }
  if (request.headers.get('x-admin-secret') !== segredo) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const entrada = String(body.login || '').trim().toLowerCase();
    // Aceita o e-mail da conta ou só o WhatsApp (números), que vira o login do formulário
    // WhatsApp com espaço, traço ou parênteses também vale: fica só com os números
    const digitos = entrada.replace(/\D/g, '');
    const login = !entrada.includes('@') && digitos.length >= 10 ? `${digitos}@belezanativa.local` : entrada;
    if (!login) {
      return NextResponse.json({ error: 'Informe o WhatsApp ou o e-mail da cliente.' }, { status: 400 });
    }

    const db = supabase();
    const { data: conta } = await db.from('clientes_conta').select('login, nome').eq('login', login).maybeSingle();
    if (!conta) {
      return NextResponse.json({ error: 'Cliente não encontrada.' }, { status: 404 });
    }

    const temporaria = senhaTemporaria();
    const { error } = await db
      .from('clientes_conta')
      .update({ senha_hash: await gerarHashSenha(temporaria) })
      .eq('login', login);
    if (error) throw error;

    return NextResponse.json({ login: conta.login, nome: conta.nome || '', senhaTemporaria: temporaria });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return NextResponse.json({ error: 'Não foi possível redefinir a senha agora.' }, { status: 500 });
  }
}
