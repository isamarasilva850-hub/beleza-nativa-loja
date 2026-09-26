import { useState, useCallback } from 'react';

export interface ReportData {
  totalSales: number;
  totalOrders: number;
  topPartners: Array<{
    id: string;
    name: string;
    totalSales: number;
    orderCount: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
    sales: number;
  }>;
  topColors: Array<{
    color: string;
    quantity: number;
  }>;
  orderStatus: {
    pendente: number;
    pago: number;
    entregue: number;
  };
  monthlySales: Array<{
    month: string;
    total: number;
  }>;
  averageTicket: number;
}

export function useReports() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reports');
      if (!response.ok) throw new Error('Erro ao carregar relatórios');
      const reportData = await response.json();
      setData(reportData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar relatórios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, loadReports };
}
