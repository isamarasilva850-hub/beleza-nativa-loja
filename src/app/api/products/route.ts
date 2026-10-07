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

    // 1. Insert produto em products
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        id: productId,
        ref,
        name,
        price: typeof price === 'string' ? parseFloat(price) : price,
      })
      .select()
      .single();

    if (productError) {
      console.error('Supabase insert error (products):', {
        message: productError.message,
        code: productError.code,
        details: productError.details,
      });
      throw new Error(`[${productError.code}] ${productError.message}${productError.details ? ': ' + productError.details : ''}`);
    }

    // 2. Insert cores em product_colors se houver
    if (colors && colors.length > 0) {
      const colorInserts = colors.map((color: any) => ({
        product_id: productId,
        color_name: color.name || '',
        color_hex: color.hex || '#000000',
        qty_p: parseInt(color.qty_p) || 0,
        qty_m: parseInt(color.qty_m) || 0,
        qty_g: parseInt(color.qty_g) || 0,
        qty_gg: parseInt(color.qty_gg) || 0,
      }));

      const { error: colorError } = await supabase
        .from('product_colors')
        .insert(colorInserts);

      if (colorError) {
        console.error('Supabase insert error (product_colors):', {
          message: colorError.message,
          code: colorError.code,
          details: colorError.details,
        });
        // Não falha se cores falharem, apenas loga
      }
    }

    return NextResponse.json(productData, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('POST /api/products error:', errorMessage);
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

    // Buscar produtos da tabela products
    console.log('🔍 [DEBUG] About to fetch from products table...');
    const { data: newProducts, error: newError } = await supabase
      .from('products')
      .select('*');

    console.log('🔍 [DEBUG] Supabase response:', {
      hasError: !!newError,
      errorMessage: newError?.message,
      errorCode: newError?.code,
      dataLength: newProducts?.length || 0,
      dataPreview: newProducts?.slice(0, 2)
    });

    if (newError) {
      console.error('❌ Error fetching products:', newError.message);
    } else {
      console.log('✅ Fetched', newProducts?.length || 0, 'products from Supabase');
    }

    // Formatar produtos com cores
    const allUploadedProducts = (newProducts || []).map((p: any) => ({
      ...p,
      slug: p.ref.toLowerCase().replace(/\s+/g, '-'),
      colors: [],
    }));

    console.log('📦 Total products from Supabase:', allUploadedProducts.length);
    if (allUploadedProducts.length > 0) {
      console.log('🆕 First new products:', allUploadedProducts.slice(0, 3).map(p => p.ref));
    }

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
