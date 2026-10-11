import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { gerarHashSenha } from '@/lib/senha';

// Cria uma pessoa da equipe ou troca a senha dela.
// Usa o mesmo segredo da redefinição de senha de clientes (ADMIN_RESET_SECRET), no cabeçalho x-admin-secret.

const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

export async function POST(request: NextRequest) {
  const segredo = process.env.ADMIN_RESET_SECRET;
  if (!segredo || request.headers.get('x-admin-secret') !== segredo) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const usuario = String(body.usuario || '').trim().toLowerCase();
    const senha = String(body.senha || '');
    const perfil = body.perfil === 'palmira' ? 'palmira' : 'admin';

    if (!usuario || senha.length < 4) {
      return NextResponse.json({ error: 'Informe o usuário e uma senha com pelo menos 4 caracteres.' }, { status: 400 });
    }

    const { error } = await supabase()
      .from('usuarios_admin')
      .upsert(
        { usuario, nome: body.nome || usuario, perfil, senha_hash: await gerarHashSenha(senha) },
        { onConflict: 'usuario' }
      );
    if (error) throw error;

    return NextResponse.json({ ok: true, usuario, perfil });
  } catch (error) {
    console.error('Erro ao salvar usuário do admin:', error);
    return NextResponse.json({ error: 'Não foi possível salvar o usuário.' }, { status: 500 });
  }
}
