import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    const { data: colors, error: colorsError } = await supabase
      .from('product_colors')
      .select('*');

    if (colorsError) throw colorsError;

    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (imagesError) throw imagesError;

    const enrichedProducts = products?.map((product) => ({
      ...product,
      colors: colors?.filter((c) => c.product_id === product.id) || [],
      images: images?.filter((i) => i.product_id === product.id) || [],
    })) || [];

    return NextResponse.json(enrichedProducts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro ao carregar produtos:', errorMessage);
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      {
        error: 'Erro ao carregar produtos',
        message: errorMessage,
        supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL
      },
      { status: 500 }
    );
  }
}

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
    const { ref, name, price, colors, images } = body;

    console.log('📦 Recebido:', { ref, name, price, colorsCount: colors?.length, imagesCount: images?.length });

    if (!ref || !name || !price) {
      return NextResponse.json(
        { error: 'REF, Nome e Preço são obrigatórios' },
        { status: 400 }
      );
    }

    const productId = `prod_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;

    const { error: productError } = await supabase
      .from('products')
      .insert({
        id: productId,
        ref,
        name,
        price: parseFloat(price as string),
        category: 'Lingerie',
        gender: 'Feminino',
      });

    if (productError) throw productError;

    if (colors && Array.isArray(colors)) {
      for (const color of colors) {
        const colorId = `color_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
        const { error: colorError } = await supabase
          .from('product_colors')
          .insert({
            id: colorId,
            product_id: productId,
            color_name: color.name,
            color_hex: color.hex || '#000000',
            qty_p: parseInt(color.qty_p) || 0,
            qty_m: parseInt(color.qty_m) || 0,
            qty_g: parseInt(color.qty_g) || 0,
            qty_gg: parseInt(color.qty_gg) || 0,
          });

        if (colorError) throw colorError;
      }
    }

    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const imageId = `img_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            id: imageId,
            product_id: productId,
            image_base64: images[i],
            display_order: i,
          });

        if (imageError) throw imageError;
      }
    }

    return NextResponse.json({ id: productId, ref, name, price }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
