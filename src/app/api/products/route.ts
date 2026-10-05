import { NextResponse } from 'next/server';
import { products } from '@/data/products';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Produtos estáticos do arquivo
    const staticProducts = products.map(p => ({
      id: p.id,
      ref: p.ref,
      name: p.name,
      price: p.price,
    }));

    // Produtos uploadados do Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: uploadedProducts } = await supabase
      .from('uploaded_products')
      .select('id, ref, name, price');

    // Combina ambos
    const allProducts = [
      ...staticProducts,
      ...(uploadedProducts || [])
    ];

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
