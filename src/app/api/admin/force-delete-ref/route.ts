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

    console.log(`💪 Force-deletando produto: ${ref}`);

    // Buscar produto
    const { data: product, error: findError } = await supabase
      .from('products')
      .select('id')
      .eq('ref', ref)
      .single();

    if (findError || !product) {
      return NextResponse.json({ error: `Produto ${ref} não encontrado` }, { status: 404 });
    }

    const productId = product.id;
    const log: string[] = [];

    // Deletar imagens (ignorar erros)
    try {
      const { error: imgError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      if (imgError) {
        log.push(`⚠️ Erro ao deletar imagens: ${imgError.message}`);
        console.warn(`Erro ao deletar imagens de ${ref}:`, imgError);
      } else {
        log.push(`✅ Imagens deletadas`);
      }
    } catch (e: any) {
      log.push(`⚠️ Exception deletando imagens: ${e.message}`);
      console.error(`Exception ao deletar imagens de ${ref}:`, e);
    }

    // Deletar cores (ignorar erros)
    try {
      const { error: colError } = await supabase
        .from('cores_do_produto')
        .delete()
        .eq('id_do_produto', productId);

      if (colError) {
        log.push(`⚠️ Erro ao deletar cores: ${colError.message}`);
        console.warn(`Erro ao deletar cores de ${ref}:`, colError);
      } else {
        log.push(`✅ Cores deletadas`);
      }
    } catch (e: any) {
      log.push(`⚠️ Exception deletando cores: ${e.message}`);
      console.error(`Exception ao deletar cores de ${ref}:`, e);
    }

    // Deletar produto (forçar)
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (deleteError) {
        log.push(`❌ Erro ao deletar produto: ${deleteError.message}`);
        return NextResponse.json({
          message: `Falha ao deletar ${ref}`,
          ref,
          log,
          error: deleteError.message,
        }, { status: 500 });
      } else {
        log.push(`✅ Produto deletado com sucesso!`);
      }
    } catch (e: any) {
      log.push(`❌ Exception deletando produto: ${e.message}`);
      return NextResponse.json({
        message: `Falha ao deletar ${ref}`,
        ref,
        log,
        error: e.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      message: `💪 Produto ${ref} deletado com sucesso (force)!`,
      ref,
      log,
    });
  } catch (error) {
    console.error('Erro ao force-deletar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
