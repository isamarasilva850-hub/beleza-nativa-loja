import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await request.json();
    const { ref, name, price, gender, colors, images } = body;

    if (!ref || !name || !price) {
      return NextResponse.json(
        { error: 'Ref, nome e preço são obrigatórios' },
        { status: 400 }
      );
    }

    const productId = `${ref}-${Date.now().toString(36)}`;

    // Salvar produto na tabela products
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        id: productId,
        ref,
        name,
        price: typeof price === 'string' ? parseFloat(price) : price,
        images: images || [],
      })
      .select()
      .single();

    if (productError) throw productError;

    // Salvar cores na tabela product_colors
    if (colors && colors.length > 0) {
      const colorRecords = colors.map((color: any) => ({
        product_id: productId,
        color_name: color.name,
        color_hex: color.hex,
        qty_p: parseInt(color.qty_p) || 0,
        qty_m: parseInt(color.qty_m) || 0,
        qty_g: parseInt(color.qty_g) || 0,
        qty_gg: parseInt(color.qty_gg) || 0,
      }));

      const { error: colorsError } = await supabase
        .from('product_colors')
        .insert(colorRecords);

      if (colorsError) {
        console.error('Erro ao salvar cores:', colorsError);
        throw new Error(`Erro ao salvar cores: ${colorsError.message}`);
      }
    }

    return NextResponse.json(productData, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Erro ao salvar produto', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Produtos estáticos do arquivo JSON
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    const staticProducts = JSON.parse(productsData).map((p: any) => ({
      id: p.id,
      ref: p.ref,
      slug: p.ref.toLowerCase().replace(/\s+/g, '-'),
      name: p.name,
      price: p.price,
      images: p.images || [],
      gender: p.gender,
      category: p.category,
      collection: p.collection,
      variants: p.variants || [],
    }));

    // Produtos uploadados do Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Buscar de AMBAS as tabelas (produtos novos e antigos)
    const { data: newProducts, error: newError } = await supabase
      .from('products')
      .select('id, ref, name, price, images');

    const { data: oldProducts, error: oldError } = await supabase
      .from('uploaded_products')
      .select('id, ref, name, price, images');

    if (newError) {
      console.error('Supabase error (products):', newError);
    }
    if (oldError) {
      console.error('Supabase error (uploaded_products):', oldError);
    }

    // Combinar ambas as listas
    const uploadedProducts = [...(newProducts || []), ...(oldProducts || [])];
    console.log('Total products from Supabase:', uploadedProducts.length);

    // Buscar cores para cada produto uploadado
    const productsWithColors = await Promise.all(
      (uploadedProducts || []).map(async (product: any) => {
        const { data: colors } = await supabase
          .from('product_colors')
          .select('color_name, color_hex, qty_p, qty_m, qty_g, qty_gg')
          .eq('product_id', product.id);

        return {
          ...product,
          slug: product.ref.toLowerCase().replace(/\s+/g, '-'),
          colors: colors || [],
        };
      })
    );

    // Combina ambos
    const allProducts = [
      ...staticProducts,
      ...productsWithColors
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
