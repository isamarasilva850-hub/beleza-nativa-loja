import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await request.json();
    const { infantilRefs, masculinoRefs } = body;

    console.log('🔄 Atualizando gêneros...');
    console.log('👶 Infantil:', infantilRefs);
    console.log('👨 Masculino:', masculinoRefs);

    // Atualizar Infantil
    if (infantilRefs && infantilRefs.length > 0) {
      const { error: infantilError } = await supabase
        .from('products')
        .update({ gender: 'Infantil' })
        .in('ref', infantilRefs);

      if (infantilError) throw infantilError;
      console.log(`✅ ${infantilRefs.length} produtos atualizados para Infantil`);
    }

    // Atualizar Masculino
    if (masculinoRefs && masculinoRefs.length > 0) {
      const { error: masculinoError } = await supabase
        .from('products')
        .update({ gender: 'Masculino' })
        .in('ref', masculinoRefs);

      if (masculinoError) throw masculinoError;
      console.log(`✅ ${masculinoRefs.length} produtos atualizados para Masculino`);
    }

    return NextResponse.json({
      success: true,
      message: `✅ Atualização concluída! ${(infantilRefs?.length || 0) + (masculinoRefs?.length || 0)} produtos atualizados`,
      infantilCount: infantilRefs?.length || 0,
      masculinoCount: masculinoRefs?.length || 0,
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar gêneros:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar gêneros', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
