import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const body = await request.json();
    const { name, phone, company, cnpj, email, city, state } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    const partnerId = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('parceiros')
      .insert({
        id: partnerId,
        nome: name,
        telefone: phone,
        empresa: company || null,
        cnpj: cnpj || null,
        'e-mail': email || null,
        cidade: city || null,
        estado: state || null,
        status: 'ativo',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar parceiro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar parceiro' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from('parceiros')
      .select('*')
      .order('criado em', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao carregar parceiros:', error);
    return NextResponse.json(
      {
        error: 'Erro ao carregar parceiros',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
