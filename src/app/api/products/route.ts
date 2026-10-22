import { negarSeNaoAdmin } from '@/lib/sessao';
import { invalidarCatalogo } from '@/lib/cache-catalogo';
import { lerOcultos, salvarOcultos } from '@/lib/produtos-ocultos';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  { const negado = negarSeNaoAdmin(request, ['admin', 'palmira']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );

    const body = await request.json();
    const { ref, name, price, gender, colors, images, substituirFotos, imagensCor } = body;

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

    // Cadastrar a REF de novo tira ela da lista de excluídos
    try {
      const ocultosAtuais = await lerOcultos(supabase);
      if (ocultosAtuais.includes(String(ref))) {
        await salvarOcultos(supabase, ocultosAtuais.filter((r) => r !== String(ref)));
      }
    } catch (e) {
      console.warn('Não foi possível atualizar a lista de excluídos:', e);
    }

    // Produto novo ganha um id novo; produto que já existe mantém o id atual (as fotos apontam para ele)
    let productId = `${ref}-${Date.now().toString(36)}`;

    // 0.5. Se houver produto com essa ref, limpar cores e imagens ANTES de UPSERT
    try {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('ref', ref)
        .maybeSingle();

      if (existing) {
        productId = existing.id;
        console.log(`🧹 Limpando dados antigos do produto ${ref}...`);
        // As cores vêm do formulário e substituem as antigas.
        // As fotos antigas NÃO são apagadas aqui: as novas são acrescentadas e as apagadas pelo ✕ saem no painel.
        console.log(`✅ Produto existente identificado (cores e fotos serão tratadas após gravar o produto)`);
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

    if (productError || !productData) {
      console.error('❌ Erro ao salvar produto:', {
        message: productError?.message,
        code: productError?.code,
        details: productError?.details,
        productData,
      });
      throw new Error(`Erro ao criar produto: ${productError?.message || 'Sem dados retornados'}`);
    }

    console.log('✅ Produto criado/atualizado com sucesso:', { id: productData.id, ref: productData.ref });

    // Só depois que o produto foi gravado é que as cores antigas saem (assim, se o produto falhar, nada se perde)
    await supabase.from('cores_do_produto').delete().eq('id_do_produto', productData.id);
    // Substituir fotos: apaga as salvas e usa só as que estão no formulário
    if (substituirFotos) {
      await supabase.from('product_images').delete().eq('product_id', productData.id);
    }

    // 2. Insert cores em cores_do_produto se houver
    let colorErrors: string[] = [];
    if (colors && colors.length > 0) {
      try {
        const colorInserts = colors.map((color: any, idx: number) => ({
          id: `${productData.id}-cor-${idx}-${Date.now()}`,
          id_do_produto: productData.id,
          nome_da_cor: (color.name || 'Sem cor').toString().substring(0, 50),
          texto_hex_color: (color.hex || '#000000').toString().substring(0, 7),
          // Tamanhos livres (PP, P, M, G, GG, 46...). As colunas antigas ficam iguais aos tamanhos P, M, G, GG
          tamanhos: Object.fromEntries(
            Object.entries(color.tamanhos || {})
              .map(([k, q]) => [String(k).toUpperCase().substring(0, 10), Math.max(0, parseInt(q as string) || 0)])
              .filter(([, q]) => (q as number) > 0)
          ),
          qtd_p: Math.max(0, parseInt(color.tamanhos?.P ?? color.qty_p) || 0),
          qtd_m: Math.max(0, parseInt(color.tamanhos?.M ?? color.qty_m) || 0),
          qtd_g: Math.max(0, parseInt(color.tamanhos?.G ?? color.qty_g) || 0),
          qtd_gg: Math.max(0, parseInt(color.tamanhos?.GG ?? color.qty_gg) || 0),
        }));

        console.log('🎨 Cores a inserir:', JSON.stringify(colorInserts, null, 2));

        const { data: insertedColors, error: colorError } = await supabase
          .from('cores_do_produto')
          .insert(colorInserts)
          .select();

        console.log('🎨 Resposta do INSERT:', { data: insertedColors, error: colorError });

        if (colorError) {
          const errMsg = `[${colorError.code}] ${colorError.message} | ${colorError.details}`;
          console.error('❌ ERRO AO SALVAR CORES:', errMsg);
          colorErrors.push(errMsg);
        } else {
          console.log(`✅ Cores salvas! ${insertedColors?.length || 0} cores inseridas`);
        }
      } catch (e) {
        const errMsg = `Exceção: ${e instanceof Error ? e.message : String(e)}`;
        console.error('❌ EXCEÇÃO AO SALVAR CORES:', errMsg);
        colorErrors.push(errMsg);
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
            id: `${productData.id}-img-${Date.now()}-${i}`,
            product_id: productData.id,
            image_base64: images[i],
            cor: (imagensCor && imagensCor[i]) || null,
          };

          const msg2 = `📸 Tentando salvar imagem ${i + 1}: ${imageData.image_base64.length} bytes`;
          console.log(msg2);
          debugLogs.push(msg2);

          // Se o campo de cor ainda não existir no banco, grava a foto sem cor (o salvar nunca falha por isso)
          let { data: insertResult, error: dbError } = await supabase
            .from('product_images')
            .insert([imageData])
            .select();
          if (dbError && /column|cor/i.test(dbError.message || '')) {
            const { cor: _cor, ...semCor } = imageData as any;
            ({ data: insertResult, error: dbError } = await supabase.from('product_images').insert([semCor]).select());
          }

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

    // Produto novo ou alterado aparece na loja logo depois de salvar
    invalidarCatalogo();

    return NextResponse.json({
      ...productData,
      debug_image_logs: debugLogs,
      debug_color_errors: colorErrors.length > 0 ? colorErrors : undefined
    }, { status: 201 });
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

// Não usar dynamic/revalidate nesta rota: afetam também o salvar (POST), que precisa ler o cookie de login.
// O cache da lista pública é feito pelo cabeçalho Cache-Control, no GET.

export async function GET(request: NextRequest) {
  try {
    // Produtos estáticos do arquivo JSON
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    // Correções de nome de cor feitas pela Palmira (guardadas no banco, chave "ajustes_cor")
    let ajustes: Record<string, Record<string, string>> = {};
    try {
      const { data: ajustesDb } = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
      ).from('crm_dados').select('valor').eq('chave', 'ajustes_cor').maybeSingle();
      if (ajustesDb?.valor && typeof ajustesDb.valor === 'object') ajustes = ajustesDb.valor as any;
    } catch {
      // Sem ajustes, a loja mostra os nomes originais
    }

    const staticProducts = JSON.parse(productsData).map((p: any, index: number) => {
      const mapaCor = ajustes[p.ref] || {};
      return {
        id: p.id,
        ref: p.ref,
        slug: p.ref.toLowerCase().replace(/\s+/g, '-'),
        name: p.name,
        price: p.price,
        images: p.images || [],
        gender: p.gender,
        category: p.category,
        collection: p.collection,
        variants: (p.variants || []).map((v: any) => ({
          ...v,
          colorOriginal: v.color,
          color: mapaCor[v.color] || v.color,
        })),
        display_order: index, // Produtos antigos recebem ordem padrão
      };
    });

    // Produtos uploadados do Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
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
          .from('cores_do_produto')
          .select('nome_da_cor, texto_hex_color, qtd_p, qtd_m, qtd_g, qtd_gg, tamanhos')
          .eq('id_do_produto', product.id);

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

        // Foto de cada cor (campo "cor" das fotos). Se o campo ainda não existir, fica vazio e nada quebra.
        const imagesPorCor: Record<string, string> = {};
        try {
          const { data: fotosDaCor } = await supabase
            .from('product_images')
            .select('image_base64, cor')
            .eq('product_id', product.id)
            .not('cor', 'is', null);
          (fotosDaCor || []).forEach((f: any) => {
            if (f.cor && f.image_base64) imagesPorCor[f.cor] = f.image_base64;
          });
        } catch {
          // sem o campo de cor: segue só com as fotos gerais
        }
        return {
          ...product,
          images: imageList,
          // Fotos por cor: { "Vinho": "data:..." } (cores sem foto própria não aparecem aqui)
          imagesPorCor,
          // Ids das fotos guardadas no banco, na mesma ordem (usados para apagar uma foto específica)
          imageIds: (images || []).map((img: any) => img.id),
          colors: colors?.map((c: any) => ({
            color_name: c.nome_da_cor,
            color_hex: c.texto_hex_color,
            qty_p: c.qtd_p,
            qty_m: c.qtd_m,
            qty_g: c.qtd_g,
            qty_gg: c.qtd_gg,
            // Tamanhos livres (PP, P, M, G, GG, 46...). Se ainda não migrado, usa as colunas antigas
            tamanhos: c.tamanhos && Object.keys(c.tamanhos).length > 0
              ? c.tamanhos
              : { P: c.qtd_p || 0, M: c.qtd_m || 0, G: c.qtd_g || 0, GG: c.qtd_gg || 0 },
          })) || [],
        };
      })
    );

    const { data: ordemRows } = await supabase
      .from('ordem_produtos')
      .select('ref, display_order');
    const ordemMap = new Map((ordemRows || []).map((o: any) => [o.ref, o.display_order]));

    // Combina ambos e ordena por display_order.
    // Se a REF já foi cadastrada no banco (ex.: Palmira), a versão do catálogo original é deixada de fora,
    // para não aparecer duas vezes.
    const refsDoBanco = new Set(productsWithDetails.map((p: any) => String(p.ref)));
    // Produtos excluídos pela equipe não aparecem na loja nem no painel
    const ocultosLista = new Set(await lerOcultos(supabase));
    const allProducts = [
      ...staticProducts.filter((p: any) => !refsDoBanco.has(String(p.ref)) && !ocultosLista.has(String(p.ref))),
      ...productsWithDetails.filter((p: any) => !ocultosLista.has(String(p.ref)))
    ]
      .map((p: any) => (ordemMap.has(p.ref) ? { ...p, display_order: ordemMap.get(p.ref) } : p))
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

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

    // Lista da loja: só a primeira foto de cada produto (o card usa só ela).
    // Página do produto e painel da Palmira pedem ?completo=1 para receber todas as fotos.
    const completo = request.nextUrl.searchParams.get('completo') === '1';
    const lista = completo
      ? allProducts
      : allProducts.map((p: any) => ({ ...p, images: (p.images || []).slice(0, 1) }));

    // Cache na Vercel por 60 segundos (e até 5 minutos enquanto atualiza em segundo plano)
    return NextResponse.json(lista, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
