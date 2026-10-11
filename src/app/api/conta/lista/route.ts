import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lista as contas de cliente para o admin. Exige o mesmo segredo da redefinição de senha.
// Não devolve senhas nem códigos de redefinição.

const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

export async function GET(request: NextRequest) {
  const segredo = process.env.ADMIN_RESET_SECRET;
  if (!segredo) {
    return NextResponse.json({ error: 'Lista não configurada.' }, { status: 503 });
  }
  if (request.headers.get('x-admin-secret') !== segredo) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase()
      .from('clientes_conta')
      .select('login, nome, telefone, tipo, criado_em')
      .order('criado_em', { ascending: false });
    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao listar contas:', error);
    return NextResponse.json({ error: 'Não foi possível carregar a lista.' }, { status: 500 });
  }
}
