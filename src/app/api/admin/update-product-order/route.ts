import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl || '', supabaseKey || '');

    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'Updates array is required' }, { status: 400 });
    }

    const rows = updates
      .filter((u: any) => u.ref)
      .map((u: any) => ({ ref: u.ref, display_order: u.display_order }));

    const { error } = await supabase
      .from('ordem_produtos')
      .upsert(rows, { onConflict: 'ref' });

    if (error) {
      console.error('Erro ao salvar ordem dos produtos:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
