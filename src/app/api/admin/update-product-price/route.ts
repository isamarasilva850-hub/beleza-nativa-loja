import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, newPrice } = body;

    if (!productId || newPrice === undefined) {
      return NextResponse.json({ error: 'Product ID and price are required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .update({ price: parseFloat(newPrice) })
      .eq('id', productId);

    if (error) throw error;

    return NextResponse.json({ success: true, productId, newPrice });
  } catch (error) {
    console.error('Erro ao atualizar preço:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar preço do produto' },
      { status: 500 }
    );
  }
}
