-- Guarda a vendedora responsável por cada revendedora (usado no Desempenho dos Vendedores).
-- Rodar uma vez no Supabase (SQL Editor). Não apaga nada.
ALTER TABLE partners ADD COLUMN IF NOT EXISTS vendedor text;
