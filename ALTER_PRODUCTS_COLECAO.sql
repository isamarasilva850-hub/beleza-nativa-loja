-- Coleção do produto (Lingerie, Moda Praia, Linha Noite), em campo separado da categoria.
-- Não apaga nada. Preenche a coleção dos produtos já cadastrados a partir da categoria.
ALTER TABLE products ADD COLUMN IF NOT EXISTS colecao text;

UPDATE products
SET colecao = CASE
  WHEN category IN ('Moda Praia', 'Biquínis e Maiô', 'Saída de Praia') THEN 'Moda Praia'
  WHEN category IN ('Linha Noite', 'Pijamas', 'Camisolas e Robes', 'Baby Doll e Pijamas') THEN 'Linha Noite'
  ELSE 'Lingerie'
END
WHERE colecao IS NULL;

-- Conferência (só leitura)
SELECT ref, category, colecao FROM products ORDER BY ref LIMIT 10;
