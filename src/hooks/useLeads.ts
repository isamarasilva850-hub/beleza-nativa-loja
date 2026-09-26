import { useState, useCallback } from 'react';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  type: 'Lojista' | 'Revendedora';
  status: 'Já revende' | 'Quer começar';
  created_at: string;
  updated_at: string;
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/leads');
      if (!response.ok) throw new Error('Erro ao carregar leads');
      const data = await response.json();
      setLeads(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar leads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLead = useCallback(
    async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        });

        if (!response.ok) throw new Error('Erro ao adicionar lead');
        const newLead = await response.json();
        setLeads(prev => [newLead, ...prev]);
        return newLead;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  const getLeadsByType = useCallback((type: 'Lojista' | 'Revendedora') => {
    return leads.filter(lead => lead.type === type);
  }, [leads]);

  const getLeadsByStatus = useCallback((status: 'Já revende' | 'Quer começar') => {
    return leads.filter(lead => lead.status === status);
  }, [leads]);

  const getStats = useCallback(() => {
    return {
      total: leads.length,
      lojistas: leads.filter(l => l.type === 'Lojista').length,
      revendedoras: leads.filter(l => l.type === 'Revendedora').length,
      jaRevendem: leads.filter(l => l.status === 'Já revende').length,
      queremComecar: leads.filter(l => l.status === 'Quer começar').length
    };
  }, [leads]);

  return {
    leads,
    loading,
    error,
    loadLeads,
    addLead,
    getLeadsByType,
    getLeadsByStatus,
    getStats
  };
}
