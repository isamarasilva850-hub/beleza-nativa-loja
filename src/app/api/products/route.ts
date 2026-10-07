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
    const productPayload = {
      id: productId,
      ref,
      name,
      price: typeof price === 'string' ? parseFloat(price) : price,
      images: images || [],
    };

    console.log('Saving product with payload:', productPayload);
    console.log('Payload size:', JSON.stringify(productPayload).length, 'bytes');

    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert(productPayload)
      .select()
      .single();

    if (productError) {
      console.error('Supabase INSERT Error:', {
        message: productError.message,
        code: productError.code,
        details: productError.details,
        hint: productError.hint,
      });
      throw new Error(`Supabase error: ${productError.message} - ${productError.details}`);
    }

    // Se conseguiu salvar o produto, agora tenta salvar as cores
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

      // Se falhar ao salvar cores, ainda assim retorna sucesso do produto
      if (colorsError) {
        console.error('Aviso: Cores não salvaram, mas produto foi criado:', colorsError);
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
