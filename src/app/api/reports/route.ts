import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    // Buscar todos os pedidos
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');

    if (ordersError) throw ordersError;

    // Buscar todos os parceiros
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('*');

    if (partnersError) throw partnersError;

    // Calcular métricas
    const totalSales = (orders || []).reduce((sum, order) => {
      const total = typeof order.total === 'string' ? parseFloat(order.total) : order.total;
      return sum + (total || 0);
    }, 0);

    const totalOrders = (orders || []).length;
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Top 5 revendedoras por faturamento
    const partnerSales: Record<string, { name: string; total: number; count: number }> = {};
    (orders || []).forEach(order => {
      if (!partnerSales[order.partnerId]) {
        const partner = (partners || []).find(p => p.id === order.partnerId);
        partnerSales[order.partnerId] = {
          name: partner?.name || 'Desconhecido',
          total: 0,
          count: 0
        };
      }
      const total = typeof order.total === 'string' ? parseFloat(order.total) : order.total;
      partnerSales[order.partnerId].total += total || 0;
      partnerSales[order.partnerId].count += 1;
    });

    const topPartners = Object.entries(partnerSales)
      .map(([id, data]) => ({
        id,
        name: data.name,
        totalSales: data.total,
        orderCount: data.count
      }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);

    // Top 10 produtos mais vendidos
    const productSales: Record<string, { name: string; quantity: number; sales: number }> = {};
    (orders || []).forEach(order => {
      if (order.items && typeof order.items === 'object') {
        const items = Array.isArray(order.items) ? order.items : Object.values(order.items);
        items.forEach((item: any) => {
          const name = item.name || 'Sem nome';
          if (!productSales[name]) {
            productSales[name] = { name, quantity: 0, sales: 0 };
          }
          productSales[name].quantity += item.quantity || 1;
          productSales[name].sales += (item.price || 0) * (item.quantity || 1);
        });
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Top cores
    const colorSales: Record<string, number> = {};
    (orders || []).forEach(order => {
      if (order.items && typeof order.items === 'object') {
        const items = Array.isArray(order.items) ? order.items : Object.values(order.items);
        items.forEach((item: any) => {
          const color = item.color || 'Sem cor';
          colorSales[color] = (colorSales[color] || 0) + (item.quantity || 1);
        });
      }
    });

    const topColors = Object.entries(colorSales)
      .map(([color, quantity]) => ({ color, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Status dos pedidos
    const orderStatus = {
      pendente: (orders || []).filter(o => o.status === 'pendente').length,
      pago: (orders || []).filter(o => o.status === 'pago').length,
      entregue: (orders || []).filter(o => o.status === 'entregue').length
    };

    // Vendas por mês
    const monthlySalesMap: Record<string, number> = {};
    (orders || []).forEach(order => {
      const date = new Date(order.date || order.created_at);
      const month = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      const total = typeof order.total === 'string' ? parseFloat(order.total) : order.total;
      monthlySalesMap[month] = (monthlySalesMap[month] || 0) + (total || 0);
    });

    const monthlySales = Object.entries(monthlySalesMap)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    return NextResponse.json({
      totalSales: Math.round(totalSales * 100) / 100,
      totalOrders,
      topPartners,
      topProducts,
      topColors,
      orderStatus,
      monthlySales,
      averageTicket: Math.round(averageTicket * 100) / 100
    });
  } catch (error) {
    console.error('Erro ao gerar relatórios:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatórios' },
      { status: 500 }
    );
  }
}
