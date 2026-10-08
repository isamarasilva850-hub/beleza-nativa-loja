import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const ref = request.nextUrl.searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'ref parameter is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl || '', supabaseKey || '');

    console.log(`🗑️ Deletando produto: ${ref}`);

    // Buscar produto
    const { data: product, error: findError } = await supabase
      .from('products')
      .select('id')
      .eq('ref', ref)
      .single();

    if (findError || !product) {
      return NextResponse.json({ error: `Produto ${ref} não encontrado` }, { status: 404 });
    }

    // Deletar imagens
    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', product.id);

    // Deletar cores
    await supabase
      .from('cores_do_produto')
      .delete()
      .eq('id_do_produto', product.id);

    // Deletar produto
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `✅ Produto ${ref} deletado com sucesso!`,
      deleted: ref,
    });
  } catch (error) {
    console.error('Erro ao deletar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
