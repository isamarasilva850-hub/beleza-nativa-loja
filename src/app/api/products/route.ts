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

    // Salvar em uploaded_products
    const { data, error } = await supabase
      .from('uploaded_products')
      .insert({
        id: productId,
        ref,
        name,
        price: typeof price === 'string' ? parseFloat(price) : price,
        color: colors?.[0]?.name || '',
        colorHex: colors?.[0]?.hex || '#000000',
        sizes: [],
        quantity: 0,
      });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(
      { message: '✅ Produto salvo!', id: productId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar', details: String(error) },
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
      .select('id, ref, name, price, images, colors');

    const { data: oldProducts, error: oldError } = await supabase
      .from('uploaded_products')
      .select('id, ref, name, price, images');

    if (newError) {
      console.error('Supabase error (products):', newError);
    }
    if (oldError) {
      console.error('Supabase error (uploaded_products):', oldError);
    }

    // Combinar ambas as listas e formatar
    const allUploadedProducts = [
      ...(newProducts || []).map((p: any) => ({
        ...p,
        slug: p.ref.toLowerCase().replace(/\s+/g, '-'),
        colors: p.colors || [],
      })),
      ...(oldProducts || []).map((p: any) => ({
        ...p,
        slug: p.ref.toLowerCase().replace(/\s+/g, '-'),
        colors: [],
      }))
    ];

    console.log('Total products from Supabase:', allUploadedProducts.length);

    // Buscar cores de product_colors para produtos que não têm no JSON
    const productsWithColors = await Promise.all(
      allUploadedProducts.map(async (product: any) => {
        // Se já tem cores no JSON, usar essas
        if (product.colors && product.colors.length > 0) {
          return product;
        }

        // Senão, tentar buscar de product_colors (fallback)
        const { data: colors } = await supabase
          .from('product_colors')
          .select('color_name, color_hex, qty_p, qty_m, qty_g, qty_gg')
          .eq('product_id', product.id);

        return {
          ...product,
          colors: colors?.map((c: any) => ({
            color_name: c.color_name,
            color_hex: c.color_hex,
            qty_p: c.qty_p,
            qty_m: c.qty_m,
            qty_g: c.qty_g,
            qty_gg: c.qty_gg,
          })) || [],
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
