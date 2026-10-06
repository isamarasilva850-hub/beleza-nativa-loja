import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl || '', supabaseKey || '');

    const infantilRefs = ['020', '084', '331', '187', '181', '255'];
    const masculinoRefs = ['025', '029', '188', '256', '244'];

    // Atualizar Infantil
    for (const ref of infantilRefs) {
      await supabase
        .from('products')
        .update({ gender: 'Infantil' })
        .eq('ref', ref);
    }

    // Atualizar Masculino
    for (const ref of masculinoRefs) {
      await supabase
        .from('products')
        .update({ gender: 'Masculino' })
        .eq('ref', ref);
    }

    // Atualizar Feminino (todos os outros)
    const { data: allProducts } = await supabase
      .from('products')
      .select('ref');

    const allRefs = allProducts?.map(p => p.ref) || [];
    const feminino = allRefs.filter(ref =>
      !infantilRefs.includes(ref) && !masculinoRefs.includes(ref)
    );

    for (const ref of feminino) {
      await supabase
        .from('products')
        .update({ gender: 'Feminino' })
        .eq('ref', ref);
    }

    return NextResponse.json({
      success: true,
      updated: {
        infantil: infantilRefs.length,
        masculino: masculinoRefs.length,
        feminino: feminino.length,
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar gêneros:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar gêneros' },
      { status: 500 }
    );
  }
}
