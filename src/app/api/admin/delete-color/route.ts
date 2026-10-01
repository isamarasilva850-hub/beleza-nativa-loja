import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function DELETE(request: NextRequest) {
  try {
    const { colorId } = await request.json();

    if (!colorId) {
      return NextResponse.json({ error: 'Color ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('product_colors')
      .delete()
      .eq('id', colorId);

    if (error) throw error;

    return NextResponse.json({ success: true, deleted: colorId });
  } catch (error) {
    console.error('Erro ao deletar cor:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar cor' },
      { status: 500 }
    );
  }
}
