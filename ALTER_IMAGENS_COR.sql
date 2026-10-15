-- Foto por cor (opcional). Não apaga nada.
-- Fotos antigas ficam com cor vazia (null): a loja continua mostrando a foto geral delas.
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS cor text;
