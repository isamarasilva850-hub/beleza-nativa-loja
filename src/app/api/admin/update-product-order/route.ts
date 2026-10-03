import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'Updates array is required' }, { status: 400 });
    }

    for (const update of updates) {
      const { ref, display_order } = update;
      if (!ref) continue;

      const { error } = await supabase
        .from('products')
        .update({ display_order })
        .eq('ref', ref);

      if (error) {
        console.error(`Erro ao atualizar ordem do produto ${ref}:`, error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro na atualização de ordem:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar ordem dos produtos' },
      { status: 500 }
    );
  }
}
