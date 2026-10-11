import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { gerarHashSenha } from '@/lib/senha';

const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const login = String(body.email || '').trim().toLowerCase();
    const senha = String(body.password || '');

    if (!login || senha.length < 4) {
      return NextResponse.json({ error: 'Informe o login e uma senha com pelo menos 4 caracteres.' }, { status: 400 });
    }

    const db = supabase();
    const { data: existente } = await db.from('clientes_conta').select('id').eq('login', login).maybeSingle();
    if (existente) {
      return NextResponse.json({ error: 'Já existe uma conta com este login.' }, { status: 409 });
    }

    const { error } = await db.from('clientes_conta').insert({
      login,
      nome: body.name || null,
      telefone: body.phone || null,
      tipo: body.type || null,
      empresa: body.company || null,
      cnpj: body.cnpj || null,
      cidade: body.city || null,
      estado: body.state || null,
      endereco: body.address || null,
      cep: body.cep || null,
      senha_hash: await gerarHashSenha(senha),
    });

    if (error) throw error;

    return NextResponse.json({
      email: login,
      name: body.name || '',
      phone: body.phone || '',
      type: body.type || undefined,
      company: body.company || undefined,
      cnpj: body.cnpj || undefined,
      city: body.city || undefined,
      state: body.state || undefined,
      address: body.address || undefined,
      cep: body.cep || undefined,
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar conta:', error);
    return NextResponse.json({ error: 'Não foi possível criar a conta agora.' }, { status: 500 });
  }
}
