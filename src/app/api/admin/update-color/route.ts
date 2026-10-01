import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function PUT(request: NextRequest) {
  try {
    const { colorId, color_name, qty_p, qty_m, qty_g, qty_gg } = await request.json();

    if (!colorId) {
      return NextResponse.json({ error: 'Color ID is required' }, { status: 400 });
    }

    const updates: any = {};
    if (color_name) updates.color_name = color_name;
    if (qty_p !== undefined) updates.qty_p = parseInt(qty_p);
    if (qty_m !== undefined) updates.qty_m = parseInt(qty_m);
    if (qty_g !== undefined) updates.qty_g = parseInt(qty_g);
    if (qty_gg !== undefined) updates.qty_gg = parseInt(qty_gg);

    const { error } = await supabase
      .from('product_colors')
      .update(updates)
      .eq('id', colorId);

    if (error) throw error;

    return NextResponse.json({ success: true, updated: colorId });
  } catch (error) {
    console.error('Erro ao atualizar cor:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cor' },
      { status: 500 }
    );
  }
}
