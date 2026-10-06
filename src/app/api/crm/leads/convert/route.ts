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
      console.error('Campos obrigatórios faltando:', { leadId, nome, telefone });
      return NextResponse.json(
        { error: 'leadId, nome e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('Convertendo lead para parceira:', { leadId, nome, telefone, email });

    const partnerId = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

    // 1. Criar registro em parceiros
    const { data: partnerDataArray, error: partnerError } = await supabase
      .from('parceiros')
      .insert({
        id: partnerId,
        nome,
        telefone,
        'e-mail': email || null,
        status: 'ativo',
      })
      .select();

    const partnerData = partnerDataArray && partnerDataArray[0];

    if (partnerError) {
      console.error('Erro ao criar parceira:', partnerError);
      throw partnerError;
    }

    console.log('Parceira criada com sucesso:', partnerData.id);

    // 2. Atualizar lead status para "convertido"
    const { error: updateError } = await supabase
      .from('crm_leads')
      .update({
        status: 'convertido',
        notas: `Convertido para parceira em ${new Date().toLocaleDateString('pt-BR')} | ID Parceira: ${partnerId}`
      })
      .eq('id', leadId);

    if (updateError) {
      console.error('Erro ao atualizar lead:', updateError);
      throw updateError;
    }

    console.log('Lead atualizado para convertido');

    return NextResponse.json({
      success: true,
      parceira: partnerData,
      message: 'Lead convertido para parceira com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao converter lead:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Erro ao converter lead para parceira', details: errorMessage },
      { status: 500 }
    );
  }
}
