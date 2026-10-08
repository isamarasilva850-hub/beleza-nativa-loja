import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { refs } = await request.json();

    if (!Array.isArray(refs) || refs.length === 0) {
      return NextResponse.json({ error: 'refs array is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl || '', supabaseKey || '');

    const deleted: string[] = [];
    const errors: { ref: string; error: string }[] = [];

    for (const ref of refs) {
      try {
        // Buscar produto
        const { data: product, error: findError } = await supabase
          .from('products')
          .select('id')
          .eq('ref', ref)
          .single();

        if (findError || !product) {
          errors.push({ ref, error: 'Produto não encontrado' });
          continue;
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
          errors.push({ ref, error: deleteError.message });
        } else {
          deleted.push(ref);
          console.log(`✅ Deletado: ${ref}`);
        }
      } catch (err: any) {
        errors.push({ ref, error: err.message });
      }
    }

    return NextResponse.json({
      message: `✅ ${deleted.length} produto(s) deletado(s)`,
      deleted,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Erro ao deletar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
