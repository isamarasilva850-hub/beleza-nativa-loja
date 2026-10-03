import { useState, useCallback } from 'react';

export interface OrderItem {
  productId: number;
  ref: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'pendente' | 'pago' | 'artes_enviadas';
  created_at: string;
  updated_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Erro ao carregar pedidos');
      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(
    async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Erro ao criar pedido');
        const newOrder = await response.json();
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: Order['status']) => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Erro ao atualizar pedido');
        const updatedOrder = await response.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        return updatedOrder;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  return { orders, loading, error, loadOrders, createOrder, updateOrderStatus };
}
