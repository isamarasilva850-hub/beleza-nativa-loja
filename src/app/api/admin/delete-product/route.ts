import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Credenciais Supabase faltando!');
      return NextResponse.json(
        { error: 'Erro de configuração: Credenciais Supabase não encontradas' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const body = await request.json();
    const { ref } = body;

    if (!ref) {
      return NextResponse.json(
        { error: 'REF é obrigatória' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Deletando produto com REF: ${ref}`);

    // 1. Procura o produto pela REF
    const { data: products, error: findError } = await supabase
      .from('products')
      .select('id')
      .eq('ref', ref)
      .limit(1);

    if (findError) throw findError;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: `Produto com REF '${ref}' não encontrado` },
        { status: 404 }
      );
    }

    const productId = products[0].id;

    // 2. Deleta as cores do produto (se existirem)
    console.log(`🎨 Tentando deletar cores para id_do_produto: ${productId}`);
    try {
      const { error: deleteColorsError, count } = await supabase
        .from('cores_do_produto')
        .delete()
        .eq('id_do_produto', productId);

      if (deleteColorsError) {
        console.error(`❌ Erro ao deletar cores:`, deleteColorsError);
      } else {
        console.log(`✅ Cores deletadas! (${count || 0} registros removidos)`);
      }
    } catch (e: any) {
      console.error(`❌ Exceção ao deletar cores:`, e.message);
    }

    // 3. Deletar imagens
    console.log(`🖼️ Tentando deletar imagens para product_id: ${productId}`);
    try {
      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      if (deleteImagesError) {
        console.error(`❌ Erro ao deletar imagens:`, deleteImagesError);
      } else {
        console.log(`✅ Imagens deletadas!`);
      }
    } catch (e: any) {
      console.error(`❌ Exceção ao deletar imagens:`, e.message);
    }

    // 4. Deleta o produto
    console.log(`🗑️ Tentando deletar produto: ${productId}`);
    const { error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (deleteProductError) {
      console.error(`❌ Erro ao deletar produto:`, deleteProductError);
      throw deleteProductError;
    }
    console.log(`✅ Produto deletado (REF: ${ref}, ID: ${productId})`);

    return NextResponse.json({
      success: true,
      message: `Produto '${ref}' deletado com sucesso!`,
      ref,
      productId
    });

  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar produto', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
