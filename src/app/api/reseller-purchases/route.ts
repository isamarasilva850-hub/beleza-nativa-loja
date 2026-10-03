import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');

    if (!partnerId) {
      return NextResponse.json(
        { error: 'partnerId é obrigatório' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('reseller_purchases')
      .select('*')
      .eq('partnerId', partnerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao carregar compras:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar compras' },
      { status: 500 }
    );
  }
}
