import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const ref = request.nextUrl.searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'ref parameter required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Buscar produto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('ref', ref)
      .single();

    if (productError || !product) {
      return NextResponse.json({
        error: `Produto ${ref} não encontrado`,
        productError: productError?.message,
      }, { status: 404 });
    }

    // 2. Buscar cores
    const { data: colors, error: colorsError } = await supabase
      .from('cores_do_produto')
      .select('*')
      .eq('id_do_produto', product.id);

    return NextResponse.json({
      product: {
        id: product.id,
        ref: product.ref,
        name: product.name,
      },
      colors: {
        count: colors?.length || 0,
        data: colors || [],
        error: colorsError?.message,
      },
    });
  } catch (error) {
    console.error('DEBUG ERROR:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
