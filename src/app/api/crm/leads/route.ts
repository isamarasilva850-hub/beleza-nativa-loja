import { negarSeNaoAdmin } from '@/lib/sessao';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  { const negado = negarSeNaoAdmin(request, ['admin']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );

    const { data, error } = await supabase
      .from('crm_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao carregar leads:', error);
    return NextResponse.json({
      error: 'Erro ao carregar leads',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );

    const body = await request.json();
    if (!body.nome || !body.telefone) return NextResponse.json({ error: 'Informe nome e WhatsApp.' }, { status: 400 });

    // Um lead por WhatsApp: se o número já existe, não cria outro e responde como sucesso
    const digitos = String(body.telefone).replace(/\D/g, '');
    const { data: existente } = await supabase
      .from('crm_leads')
      .select('id, telefone')
      .like('telefone', `%${digitos}%`)
      .limit(5);
    if ((existente || []).some((l: any) => String(l.telefone || '').replace(/\D/g, '') === digitos)) {
      return NextResponse.json({ ok: true, duplicado: true }, { status: 200 });
    }

    const { data, error } = await supabase
      .from('crm_leads')
      .insert({
        id: body.id || Date.now().toString(),
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        origem: body.origem || 'whatsapp',
        status: body.status || 'novo',
        valor: body.valor || 0,
        notas: body.notas || '',
        vendedor: body.vendedor || 'Isamara',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 });
  }
}
