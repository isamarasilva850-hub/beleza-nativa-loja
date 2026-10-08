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

    // Debug: descobrir colunas da tabela
    const { data: schemaInfo } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'product_images')
      .limit(10);

    console.log('🔍 [DEBUG] Colunas de product_images:', schemaInfo?.map(c => (c as any).column_name).join(', ') || 'não conseguiu');

    const body = await request.json();
    const { ref, name, price, gender, colors, images } = body;

    console.log('🔍 [POST /api/products] Recebido:');
    console.log(`  ref: ${ref}`);
    console.log(`  name: ${name}`);
    console.log(`  images: ${images?.length || 0} imagens`);
    if (images?.length > 0) {
      console.log(`    Primeira imagem: ${images[0].substring(0, 50)}...`);
    }

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
        gender: gender || 'Feminino',
        display_order: Date.now(), // Novos produtos vão pro final
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

    // 3. Salvar imagens base64 diretamente na tabela
    const debugLogs: string[] = [];
    if (images && images.length > 0) {
      const msg1 = `📸 Salvando ${images.length} imagem(ns) base64`;
      console.log(msg1);
      debugLogs.push(msg1);

      for (let i = 0; i < images.length; i++) {
        try {
          const imageData = {
            id: `${productId}-img-${i}`,
            product_id: productId,
            image_base64: images[i],
          };

          const msg2 = `📸 Tentando salvar imagem ${i + 1}: ${imageData.image_base64.length} bytes`;
          console.log(msg2);
          debugLogs.push(msg2);

          const { data: insertResult, error: dbError } = await supabase
            .from('product_images')
            .insert([imageData])
            .select();

          if (dbError) {
            const errMsg = `❌ ERRO ao salvar imagem ${i + 1}: [${dbError.code}] ${dbError.message} ${dbError.details || ''}`.trim();
            console.error(errMsg);
            debugLogs.push(errMsg);
          } else {
            const sizeKB = Math.round(images[i].length / 1024);
            const successMsg = `✅ Imagem ${i + 1} salva: ${sizeKB}KB`;
            console.log(successMsg);
            debugLogs.push(successMsg);
          }
        } catch (err) {
          const errMsg = `❌ ERRO: ${err instanceof Error ? err.message : String(err)}`;
          console.error(errMsg);
          debugLogs.push(errMsg);
        }
      }
    } else {
      const warnMsg = `⚠️ Nenhuma imagem recebida`;
      console.log(warnMsg);
      debugLogs.push(warnMsg);
    }

    return NextResponse.json({ ...productData, debug_image_logs: debugLogs }, { status: 201 });
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
    const staticProducts = JSON.parse(productsData).map((p: any, index: number) => ({
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
      display_order: index, // Produtos antigos recebem ordem padrão
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

    // Buscar cores e imagens
    const productsWithDetails = await Promise.all(
      allUploadedProducts.map(async (product: any) => {
        // Buscar cores
        const { data: colors } = await supabase
          .from('product_colors')
          .select('color_name, color_hex, qty_p, qty_m, qty_g, qty_gg')
          .eq('product_id', product.id);

        // Buscar imagens 🖼️
        const { data: images, error: imgError } = await supabase
          .from('product_images')
          .select('id, image_base64')
          .eq('product_id', product.id);

        if (product.ref === 'TESTE-FINAL-03') {
          console.log(`🔍 [DEBUG] Imagens para ${product.ref}:`, {
            count: images?.length || 0,
            error: imgError?.message,
            sample: images?.[0],
          });
        }

        // Usar image_base64
        let imageList = images?.map((img: any) => img.image_base64).filter(Boolean) || product.images || [];
        return {
          ...product,
          images: imageList,
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

    // Combina ambos e ordena por display_order
    const allProducts = [
      ...staticProducts,
      ...productsWithDetails
    ].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
