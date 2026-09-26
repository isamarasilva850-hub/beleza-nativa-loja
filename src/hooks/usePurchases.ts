import { useState, useCallback } from 'react';

export interface Purchase {
  id: string;
  partnerId: string;
  productId: number;
  ref: string;
  quantity: number;
  color: string;
  size: string;
  purchaseDate: string;
  price: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPurchasesByPartner = useCallback(async (partnerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reseller-purchases?partnerId=${partnerId}`);
      if (!response.ok) throw new Error('Erro ao carregar compras');
      const data = await response.json();
      setPurchases(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar compras:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { purchases, loading, error, loadPurchasesByPartner };
}
