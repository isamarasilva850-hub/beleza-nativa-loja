-- Contas das clientes (login da loja). Rodar uma vez no SQL Editor do Supabase.
-- RLS ligado e sem políticas: o site acessa pelo servidor (service_role), e o navegador não lê a tabela.

create table if not exists clientes_conta (
  id uuid primary key default gen_random_uuid(),
  login text unique not null,
  nome text,
  telefone text,
  tipo text,
  empresa text,
  cnpj text,
  cidade text,
  estado text,
  endereco text,
  cep text,
  senha_hash text not null,
  criado_em timestamptz default now()
);

alter table clientes_conta enable row level security;
