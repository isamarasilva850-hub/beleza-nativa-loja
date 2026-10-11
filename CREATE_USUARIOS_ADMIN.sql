-- Contas da equipe para entrar no admin (usuário e senha, sem e-mail).
-- Rodar uma vez no SQL Editor do Supabase.
-- RLS ligado e sem políticas: só o servidor acessa.

create table if not exists usuarios_admin (
  id uuid primary key default gen_random_uuid(),
  usuario text unique not null,
  nome text,
  perfil text not null check (perfil in ('admin', 'palmira')),
  senha_hash text not null,
  criado_em timestamptz default now()
);

alter table usuarios_admin enable row level security;
