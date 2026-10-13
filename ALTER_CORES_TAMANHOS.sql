-- Tamanhos livres por cor (PP, P, M, G, GG, 46, 48, 50...).
-- Não apaga nada: cria a coluna nova e copia as quantidades atuais (qtd_p, qtd_m, qtd_g, qtd_gg).
-- As colunas antigas continuam existindo até o sistema novo ser testado.

ALTER TABLE cores_do_produto ADD COLUMN IF NOT EXISTS tamanhos jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE cores_do_produto
SET tamanhos = jsonb_build_object(
  'P', COALESCE(qtd_p, 0),
  'M', COALESCE(qtd_m, 0),
  'G', COALESCE(qtd_g, 0),
  'GG', COALESCE(qtd_gg, 0)
)
WHERE tamanhos = '{}'::jsonb;

-- Conferência (só leitura): deve mostrar as cores com os tamanhos copiados
SELECT id_do_produto, nome_da_cor, tamanhos FROM cores_do_produto ORDER BY id_do_produto LIMIT 10;
