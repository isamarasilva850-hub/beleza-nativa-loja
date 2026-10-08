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

    // 0.5. Se houver produto com essa ref, limpar cores e imagens ANTES de UPSERT
    try {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('ref', ref)
        .maybeSingle();

      if (existing) {
        console.log(`🧹 Limpando dados antigos do produto ${ref}...`);
        await supabase.from('product_colors').delete().eq('product_id', existing.id);
        await supabase.from('product_images').delete().eq('product_id', existing.id);
        console.log(`✅ Dados antigos removidos`);
      }
    } catch (e) {
      console.warn('⚠️ Erro ao limpar antigos (continuando):', e);
    }

    // 1. Insert ou UPDATE produto em products (UPSERT pelo ref)
    const { data: productData, error: productError } = await supabase
      .from('products')
      .upsert({
        id: productId,
        ref,
        name,
        price: typeof price === 'string' ? parseFloat(price) : price,
        gender: gender || 'Feminino',
      }, { onConflict: 'ref' })
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
      try {
        const colorInserts = colors.map((color: any) => ({
          product_id: productId,
          color_name: (color.name || 'Sem cor').toString().substring(0, 50),
          color_hex: (color.hex || '#000000').toString().substring(0, 7),
          qty_p: Math.max(0, parseInt(color.qty_p) || 0),
          qty_m: Math.max(0, parseInt(color.qty_m) || 0),
          qty_g: Math.max(0, parseInt(color.qty_g) || 0),
          qty_gg: Math.max(0, parseInt(color.qty_gg) || 0),
        }));

        console.log('🎨 Cores a inserir:', colorInserts);

        const { error: colorError } = await supabase
          .from('product_colors')
          .insert(colorInserts);

        if (colorError) {
          console.warn('⚠️ Erro ao salvar cores (ignorando):', colorError.message);
        } else {
          console.log('✅ Cores salvas!');
        }
      } catch (e) {
        console.warn('⚠️ Exceção ao salvar cores (ignorando):', e);
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
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('❌ POST /api/products ERROR:');
    console.error('Message:', errorMessage);
    console.error('Stack:', errorStack);
    return NextResponse.json(
      { error: 'Erro ao salvar produto', details: errorMessage, stack: errorStack },
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

    // Debug: verificar se produto 444 está lá
    const produto444 = allProducts.find(p => p.ref === '444');
    if (produto444) {
      console.log('✅ Produto 444 encontrado:', {
        ref: produto444.ref,
        slug: produto444.slug,
        id: produto444.id,
        colors: produto444.colors?.length || 0,
        images: produto444.images?.length || 0,
        display_order: produto444.display_order
      });
    } else {
      console.log('❌ Produto 444 NÃO encontrado no array final!');
      console.log('📊 Total de produtos:', allProducts.length);
      console.log('📊 Produtos do Supabase:', productsWithDetails.length);
      console.log('📊 Produtos estáticos:', staticProducts.length);
    }

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
