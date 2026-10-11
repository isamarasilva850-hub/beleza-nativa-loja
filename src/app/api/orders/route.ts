import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const pedidos = (data || []).map((o: any) => ({
      ...o,
      partnerId: o.partnerid,
      partnerName: o.partnername,
      partnerPhone: o.partnerphone,
    }));
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    return NextResponse.json({ error: 'Erro ao carregar pedidos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );
    const body = await request.json();
    const { partnerId, partnerName, partnerPhone, items, total, date, status } = body;

    if (!partnerId || !items) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Número do pedido vem do servidor: o ID é o próprio número (ex.: "12").
    // Se duas pessoas gravarem ao mesmo tempo, tenta o número seguinte.
    const { data: existentes, error: erroIds } = await supabase.from('orders').select('id');
    if (erroIds) throw erroIds;
    const numeros = (existentes || []).map((r: any) => String(r.id)).filter((id) => /^\d+$/.test(id)).map(Number);
    let numero = (numeros.length ? Math.max(...numeros) : 0) + 1;

    let data: any = null;
    let error: any = null;
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      const resultado = await supabase
        .from('orders')
        .insert({
          id: String(numero),
          partnerid: partnerId,
          partnername: partnerName,
          partnerphone: partnerPhone,
          items: items,
          total: typeof total === 'string' ? parseFloat(total) : total,
          date: date || new Date().toISOString().split('T')[0],
          status: status || 'pendente',
        })
        .select()
        .single();
      data = resultado.data;
      error = resultado.error;
      if (!error) break;
      numero += 1;
    }

    if (error) throw error;
    return NextResponse.json(
      { ...data, partnerId: data.partnerid, partnerName: data.partnername, partnerPhone: data.partnerphone },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 });
  }
}
