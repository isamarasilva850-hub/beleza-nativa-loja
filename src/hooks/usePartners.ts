import { useState, useCallback } from 'react';

export interface Partner {
  id: string;
  name: string;
  company?: string;
  cnpj?: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  status: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  created_at: string;
  updated_at: string;
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPartners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/partners');
      if (!response.ok) throw new Error('Erro ao carregar parceiros');
      const data = await response.json();
      setPartners(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar parceiros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPartner = useCallback(
    async (partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const response = await fetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partnerData)
        });

        if (!response.ok) throw new Error('Erro ao adicionar parceiro');
        const newPartner = await response.json();
        setPartners(prev => [newPartner, ...prev]);
        return newPartner;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  const getStats = useCallback(() => {
    return {
      total: partners.length,
      ativo: partners.filter(p => p.status === 'ativo').length,
      inativo: partners.filter(p => p.status === 'inativo').length,
      totalSpent: partners.reduce((sum, p) => sum + p.totalSpent, 0),
    };
  }, [partners]);

  return {
    partners,
    loading,
    error,
    loadPartners,
    addPartner,
    getStats
  };
}
