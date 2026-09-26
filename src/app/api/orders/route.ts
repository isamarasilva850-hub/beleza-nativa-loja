import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    return NextResponse.json({ error: 'Erro ao carregar pedidos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerId, partnerName, partnerPhone, items, total, date, status } = body;

    if (!partnerId || !items) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const orderId = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        partnerId,
        partnerName,
        partnerPhone,
        items: items,
        total: typeof total === 'string' ? parseFloat(total) : total,
        date: date || new Date().toISOString().split('T')[0],
        status: status || 'pendente',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 });
  }
}
