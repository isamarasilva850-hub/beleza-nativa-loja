# ✅ Checklist de Implementação - Supabase

## **FASE 1: SETUP (HOJE)**

- [ ] **1.1** Criar conta Supabase em https://supabase.com
- [ ] **1.2** Copiar URL e API Key do projeto
- [ ] **1.3** Colar em `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  ```
- [ ] **1.4** Executar SQL em `scripts/setup-supabase.sql` no Supabase SQL Editor
- [ ] **1.5** Verificar se as 4 tabelas foram criadas
- [ ] **1.6** Instalar dependência: `npm install @supabase/supabase-js` ✅ (FEITO)

---

## **FASE 2: MIGRAÇÃO DE DADOS (AMANHÃ)**

### Pré-requisitos:
- [ ] Supabase configurado (Fase 1)
- [ ] Site rodando: `npm run dev`

### Executar migração:

1. [ ] Abrir site em navegador
2. [ ] Apertar **F12** (Developer Tools)
3. [ ] Ir aba **Console**
4. [ ] Copiar conteúdo de `scripts/migrate-to-supabase.js`
5. [ ] Colar no Console e pressionar **Enter**
6. [ ] Aguardar até ver `✅ MIGRAÇÃO CONCLUÍDA!`
7. [ ] Verificar no Supabase se dados aparecem em cada tabela

---

## **FASE 3: ATUALIZAR COMPONENTES (PRÓXIMA SEMANA)**

**Arquivos a atualizar:**

- [ ] **3.1** `/admin/parceiros/page.tsx`
  - Usar `usePartners()` hook em vez de localStorage
  - Teste: Adicionar novo parceiro deve salvar no Supabase

- [ ] **3.2** `/admin/pedidos-revendedoras/page.tsx`
  - Usar `useOrders()` hook
  - Teste: Enviar artes deve funcionar igual

- [ ] **3.3** `/catalogo-revendedora/[id]/page.tsx`
  - Usar `useShoppingCart()` hook
  - Teste: Carrinho deve persistir

- [ ] **3.4** `/admin/simular-pedido-revendedora/page.tsx`
  - Usar `useResellerPurchases()` hook
  - Teste: Simular pedido deve salvar no Supabase

- [ ] **3.5** `/cadastro/page.tsx`
  - Usar `usePartners()` para registro
  - Teste: Novo cadastro de revendedora

---

## **FASE 4: TESTES**

- [ ] **4.1** Testar CRUD Partners
  - [ ] Criar novo
  - [ ] Editar existente
  - [ ] Ver dados em Supabase

- [ ] **4.2** Testar CRUD Orders
  - [ ] Simular pedido
  - [ ] Marcar como pago
  - [ ] Enviar artes
  - [ ] Ver status atualizado em Supabase

- [ ] **4.3** Testar carrinho revendedora
  - [ ] Adicionar produtos
  - [ ] Atualizar quantidade
  - [ ] Limpar carrinho
  - [ ] Dados persistem após reload

- [ ] **4.4** Testar revendedora compras
  - [ ] Compras aparecem no catálogo
  - [ ] Dados corretos em Supabase

---

## **FASE 5: LIMPEZA (DEPOIS)**

Quando TUDO estiver funcionando:

- [ ] **5.1** Deletar dados antigos de localStorage:
  ```javascript
  // No console do navegador:
  localStorage.clear();
  ```

- [ ] **5.2** Atualizar `SUPABASE-SETUP.md` com informações de produção

---

## **TEMPO ESTIMADO**

- Fase 1 (Setup): **15 min**
- Fase 2 (Migração): **5 min**
- Fase 3 (Atualizar código): **2-3 dias**
- Fase 4 (Testes): **1 dia**
- Fase 5 (Limpeza): **30 min**

**Total: ~4 dias**

---

## **SUPORTE**

Se algo der errado:

1. Verifique se `.env.local` está correto
2. Reinicie servidor: `npm run dev`
3. Limpe cache: **Ctrl+Shift+Delete**
4. Se persistir, me chamar! 🆘
