import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl || '', supabaseKey || '');

    // Buscar produtos sem display_order
    const { data: productsWithoutOrder, error: fetchError } = await supabase
      .from('products')
      .select('id, ref')
      .is('display_order', null);

    if (fetchError) {
      throw new Error(`Erro ao buscar produtos: ${fetchError.message}`);
    }

    if (!productsWithoutOrder || productsWithoutOrder.length === 0) {
      return NextResponse.json({ message: 'Nenhum produto sem display_order encontrado', count: 0 });
    }

    console.log(`🔧 Encontrados ${productsWithoutOrder.length} produtos sem display_order`);

    // Atualizar cada um com um valor timestamp único
    for (let i = 0; i < productsWithoutOrder.length; i++) {
      const product = productsWithoutOrder[i];
      const displayOrder = Date.now() + i; // Incrementar para evitar valores iguais

      const { error: updateError } = await supabase
        .from('products')
        .update({ display_order: displayOrder })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Erro ao atualizar ${product.ref}:`, updateError);
      } else {
        console.log(`✅ ${product.ref} atualizado com display_order: ${displayOrder}`);
      }
    }

    return NextResponse.json({
      message: `✅ ${productsWithoutOrder.length} produtos recuperados!`,
      count: productsWithoutOrder.length,
      products: productsWithoutOrder.map(p => p.ref),
    });
  } catch (error) {
    console.error('Erro no fix:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
