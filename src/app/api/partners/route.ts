import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
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
      .from('partners')
      .insert({
        id: partnerId,
        name,
        phone,
        company: company || null,
        cnpj: cnpj || null,
        email: email || null,
        city: city || null,
        state: state || null,
        status: 'ativo',
        createdAt: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
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
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao carregar parceiros:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar parceiros' },
      { status: 500 }
    );
  }
}
