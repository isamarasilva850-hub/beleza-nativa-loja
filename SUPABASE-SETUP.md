# 🚀 Setup Supabase - Beleza Nativa

## **ETAPA 1: Criar conta Supabase**

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub (mais fácil)
4. Crie um novo projeto:
   - Nome: `beleza-nativa-loja`
   - Database password: **guarde bem!**
   - Região: America/São Paulo (ou sua região)
5. Aguarde ~2 min até criar

---

## **ETAPA 2: Pegar as chaves**

Após criar o projeto:

1. Clique em **Settings** (engrenagem)
2. Vá em **API**
3. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## **ETAPA 3: Adicionar variáveis ao .env.local**

Na raiz do projeto, crie/edite `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
```

---

## **ETAPA 4: Criar tabelas (SQL)**

1. No Supabase, clique em **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo de `scripts/setup-supabase.sql`
4. Clique em **Run**
5. ✅ Tabelas criadas!

---

## **ETAPA 5: Instalar dependência**

```bash
npm install @supabase/supabase-js
```

---

## **ETAPA 6: Testar conexão**

```bash
npm run dev
```

Se aparecer erro de "SUPABASE_URL não encontrada", reinicie:
```bash
npm run dev
```

---

## **PRÓXIMO PASSO: Migração de dados**

Depois de confirmar que tudo funciona:

1. Abrir `/scripts/migrate-data.ts`
2. Rodar a migração de localStorage → Supabase
3. Atualizar componentes pra usar hooks do Supabase

---

## **TROUBLESHOOTING**

### Erro: "NEXT_PUBLIC_SUPABASE_URL is not defined"
- [ ] Reinicie o servidor (`npm run dev`)
- [ ] Verifique se `.env.local` está na raiz (não em `/src`)
- [ ] Salve o arquivo e aguarde ~5s

### Erro: "Não consegue acessar a tabela"
- [ ] Verifique se as tabelas foram criadas (SQL Editor → Show actual schema)
- [ ] Rode o SQL novamente

### Erro: "Row Level Security"
- [ ] Se usar RLS, precisa de autenticação
- [ ] Deixe desativado por enquanto (descomente no SQL depois)

---

## **PRÓXIMOS PASSOS**

✅ Supabase criado
⬜ Componentes migrados
⬜ Dashboard de relatórios
⬜ Autenticação real
