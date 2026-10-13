import { negarSeNaoAdmin } from '@/lib/sessao';
import { invalidarCatalogo } from '@/lib/cache-catalogo';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function PUT(request: NextRequest) {
  { const negado = negarSeNaoAdmin(request, ['admin', 'palmira']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl || '', supabaseKey || '');

    const { colorId, color_name, qty_p, qty_m, qty_g, qty_gg, tamanhos } = await request.json();

    if (!colorId) {
      return NextResponse.json({ error: 'Color ID is required' }, { status: 400 });
    }

    const updates: any = {};
    if (color_name) updates.nome_da_cor = color_name;
    if (qty_p !== undefined) updates.qtd_p = parseInt(qty_p);
    if (qty_m !== undefined) updates.qtd_m = parseInt(qty_m);
    if (qty_g !== undefined) updates.qtd_g = parseInt(qty_g);
    if (qty_gg !== undefined) updates.qtd_gg = parseInt(qty_gg);
    if (tamanhos && typeof tamanhos === 'object') {
      // Tamanhos livres; as colunas antigas acompanham P, M, G, GG
      const limpo: Record<string, number> = {};
      Object.entries(tamanhos).forEach(([k, q]) => {
        const n = Math.max(0, parseInt(q as string) || 0);
        if (n > 0) limpo[String(k).toUpperCase().substring(0, 10)] = n;
      });
      updates.tamanhos = limpo;
      updates.qtd_p = limpo.P || 0;
      updates.qtd_m = limpo.M || 0;
      updates.qtd_g = limpo.G || 0;
      updates.qtd_gg = limpo.GG || 0;
    }

    const { error } = await supabase
      .from('cores_do_produto')
      .update(updates)
      .eq('id', colorId);

    if (error) throw error;
    invalidarCatalogo();

    return NextResponse.json({ success: true, updated: colorId });
  } catch (error) {
    console.error('Erro ao atualizar cor:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cor' },
      { status: 500 }
    );
  }
}
