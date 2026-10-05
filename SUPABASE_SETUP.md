# Setup Supabase para Beleza Nativa

## Passo 1: Criar Conta Supabase
1. Ir para https://supabase.com
2. Clique em "Start your project"
3. Sign up com GitHub ou email
4. Crie um novo projeto (escolha região: São Paulo ou us-east)
5. Aguarde 2-3 minutos para provisionar

## Passo 2: Pegar Credenciais
Na dashboard do projeto:
- Menu lateral → Settings → API
- Copiar:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Passo 3: Criar arquivo .env.local
Crie na raiz do projeto (`beleza-nativa-loja/.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-key-aqui
```

## Passo 4: Copiar SQL para criar tabelas
1. Na dashboard → SQL Editor
2. Clique em "New Query"
3. Cole todo o SQL do arquivo: `supabase_schema.sql`
4. Clique "Run"

## Pronto! ✅
Próximo: instalar `@supabase/supabase-js`

---

**Tem dúvida?** As credenciais estão em:
Settings → API → Project URL e anon key
