import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await request.json();
    const { leadId, nome, telefone, email } = body;

    // Convert lead to partner - moves from crm_leads to parceiros table

    if (!leadId || !nome || !telefone) {
      return NextResponse.json(
        { error: 'leadId, nome e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    const partnerId = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

    // 1. Criar registro em parceiros
    const { data: partnerData, error: partnerError } = await supabase
      .from('parceiros')
      .insert({
        id: partnerId,
        nome,
        telefone,
        'e-mail': email || null,
        status: 'ativo',
      })
      .select()
      .single();

    if (partnerError) throw partnerError;

    // 2. Atualizar lead status para "convertido"
    const { error: updateError } = await supabase
      .from('crm_leads')
      .update({
        status: 'convertido',
        notas: `Convertido para parceira em ${new Date().toLocaleDateString('pt-BR')} | ID Parceira: ${partnerId}`
      })
      .eq('id', leadId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      parceira: partnerData,
      message: 'Lead convertido para parceira com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao converter lead:', error);
    return NextResponse.json(
      { error: 'Erro ao converter lead para parceira' },
      { status: 500 }
    );
  }
}
