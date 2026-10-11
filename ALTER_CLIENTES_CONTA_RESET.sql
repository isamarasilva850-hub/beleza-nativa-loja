-- Código de redefinição de senha pelo WhatsApp. Rodar uma vez no SQL Editor do Supabase.
-- Só adiciona colunas novas; não apaga nem altera os dados existentes.

alter table clientes_conta add column if not exists reset_codigo_hash text;
alter table clientes_conta add column if not exists reset_expira timestamptz;
alter table clientes_conta add column if not exists reset_tentativas integer default 0;
