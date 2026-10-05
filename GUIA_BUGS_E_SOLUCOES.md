# 🐛 Guia Completo de Bugs e Soluções

**Data**: 2026-10-05  
**Status**: Todos os bugs foram CORRIGIDOS nesta sessão

---

## 🔴 BUGS ENCONTRADOS E SOLUÇÕES

### BUG #1: "Corrigir Preços - Nada Aparecia"
**Sintoma**: Ao acessar `/admin/palmira/corrigir-precos` e digitar uma REF, nenhum produto aparecia.

**Causa**: API `/api/products` não existia. A página tentava buscar produtos mas a API retornava erro.

**Solução Implementada**:
1. Criei arquivo `src/app/api/products/route.ts`
2. API retorna produtos do `src/data/products.json`
3. API também retorna produtos uploadados do Supabase
4. Página de "Corrigir Preços" agora busca de ambas as fontes ✅

**Teste**: 
- Acesse `/admin/palmira/corrigir-precos`
- Digite qualquer REF
- Produto deve aparecer

---

### BUG #2: "Editar Preço Não Salvava"
**Sintoma**: Quando editava o preço e clicava em salvar, não persistia.

**Causa**: API de atualizar preço existia mas:
- Tentava salvar em arquivo JSON que não existia
- Estrutura de dados estava errada
- Não tratava produtos estáticos corretamente

**Solução Implementada**:
1. Criei arquivo `src/data/products.json` com TODOS os produtos estáticos
2. Atualizei `/api/admin/update-product-price/route.ts` para:
   - Ler do arquivo JSON
   - Encontrar o produto correto
   - Atualizar o preço
   - Salvar de volta no JSON ✅

**Arquivo Criado**: `src/data/products.json`

**Teste**:
- Acesse `/admin/palmira/corrigir-precos`
- Busque um produto
- Edite o preço
- Clique em ✓
- Preço deve atualizar e PERSISTIR ✅

---

### BUG #3: "Não Podia Editar Produtos Estáticos"
**Sintoma**: Página de "Editar Produto" não funcionava para produtos estáticos.

**Causa**: Não havia APIs específicas para editar campos dos produtos estáticos.

**Solução Implementada**:
Criei 4 novas APIs:

#### 1. `/api/admin/edit-product`
- Edita QUALQUER campo do produto
- Preço, nome, descrição, cores, imagens, tudo!

**Request**:
```json
{
  "productId": "1",
  "updates": {
    "price": 99.90,
    "name": "Novo Nome",
    "description": "Nova descrição"
  }
}
```

#### 2. `/api/admin/reorder-products`
- Reordena produtos no site
- Recebe array de IDs ordenados

**Request**:
```json
{
  "orderedIds": ["3", "1", "4", "2"]
}
```

#### 3. `/api/admin/update-cover-image`
- Muda apenas a primeira imagem (capa)

**Request**:
```json
{
  "productId": "1",
  "coverImageUrl": "https://nova-imagem.jpg"
}
```

#### 4. `/api/admin/delete-static-product`
- Deleta um produto completamente

**Request**:
```json
{
  "productId": "1"
}
```

**Teste**:
- Acesse `/admin/palmira/editar-produto`
- Busque um produto
- Edite preço, nome, imagens
- Tudo deve salvar ✅

---

### BUG #4: "Arquivo de Produto Errado"
**Sintoma**: API criada tentava usar `products.ts` que era arquivo TypeScript.

**Causa**: Não estava usando estrutura correta para arquivo que precisa ser editado em runtime.

**Solução Implementada**:
1. Convertei `src/data/products.ts` em `src/data/products.json`
2. Atualizei `products.ts` para apenas conter tipos TypeScript
3. APIs agora leem/escrevem em `products.json` ✅

**Arquivo Mudado**: 
- `src/data/products.ts` → tipos apenas
- `src/data/products.json` → dados (novo)

---

### BUG #5: "Login Não Funcionava"
**Sintoma**: Ao acessar `/login`, página retornava 404.

**Causa**: Arquivo `src/app/login/page.tsx` não existia.

**Solução Implementada**:
1. Criei `src/app/login/page.tsx` com formulário Supabase
2. Criou autenticação com email/senha
3. Redireciona para `/admin` após login bem-sucedido ✅

**Teste**:
- Acesse `/login`
- Página deve mostrar formulário
- Digite credenciais Supabase
- Deve redirecionar para admin ✅

---

### BUG #6: "Produtos API Retornava Incompleto"
**Sintoma**: A API `/api/products` retornava apenas estáticos, não incluía uploadados.

**Causa**: API só lia de `src/data/products.ts`, não buscava do Supabase.

**Solução Implementada**:
Atualizei `/api/products/route.ts` para:
1. Ler produtos do `products.json` (estáticos)
2. Buscar `uploaded_products` do Supabase
3. Combinar ambos em um array único ✅

**Resultado**: Qualquer busca agora retorna TODOS os produtos ✅

---

## 🟡 ISSUES POTENCIAIS FUTUROS

### Issue: "localStorage vs Supabase"
**Onde**: CRM, Pedidos, Estoque usam localStorage

**Por quê**: Mais rápido de implementar, funciona offline

**Quando Migrar**: Se quiser dados sincronizados em múltiplos dispositivos

**Como Migrar**:
1. Criar tabelas no Supabase para cada entidade
2. Substituir localStorage por Supabase queries
3. Ativar real-time subscriptions

---

### Issue: "Permissões de Edição"
**Onde**: Qualquer pessoa autenticada pode editar TUDO

**Quando Implementar**: Se houver múltiplos usuários com diferentes permissões

**Como Implementar**:
1. Adicionar campo `role` na tabela `users`
2. Checar role em cada API antes de permitir edição
3. Exemplo:
```typescript
if (user.role !== 'admin' && user.role !== 'editor') {
  return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
}
```

---

### Issue: "Backup Automático"
**Onde**: Sem backup automático dos dados

**Quando Implementar**: Antes de usar em produção

**Como Implementar**:
1. Usar Supabase Backups automáticos (ativar no dashboard)
2. Fazer backup de `products.json` para GitHub
3. Criar função que backupeia diariamente

---

## 🔧 COMO VERIFICAR CADA PROBLEMA

### Teste Completo de Funcionalidades

#### 1. Login
```bash
1. Abra https://seu-site/login
2. Digite email e senha Supabase
3. Deve redirecionar para /admin
4. Se erro: Verificar credenciais Supabase
```

#### 2. Corrigir Preços
```bash
1. Acesse /admin/palmira/corrigir-precos
2. Digite uma REF válida
3. Produto deve aparecer
4. Edite preço e salve
5. Recarregue - preço deve estar atualizado
```

#### 3. Upload de Produto
```bash
1. Acesse /admin/palmira/upload
2. Selecione múltiplas imagens
3. Preencha dados (nome, preço, cores)
4. Clique em Salvar
5. Verifique em /admin/palmira/produtos
```

#### 4. Reordenar
```bash
1. Acesse /admin/palmira/reordenar-produtos
2. Arraste produtos
3. Recarregue página
4. Ordem deve estar salva
```

#### 5. Editar Produto
```bash
1. Acesse /admin/palmira/editar-produto
2. Busque por REF
3. Edite cores, imagens, quantidade
4. Salve
5. Verifique se persistiu
```

---

## 🚨 TROUBLESHOOTING PASSO A PASSO

### Problema: "API retorna 404"
**Solução**:
1. Aguarde Vercel fazer deploy completo (3-5 min)
2. Recarregue com Ctrl+F5 (força reload)
3. Verifique se arquivo da API existe:
   - `src/app/api/products/route.ts`
   - `src/app/api/admin/update-product-price/route.ts`
4. Confirme que foi feito push para GitHub

**Se ainda não funcionar**:
```bash
# Ver logs do Vercel
vercel logs --follow

# Ou verificar arquivo localmente
ls -la src/app/api/products/route.ts
```

---

### Problema: "Produto não encontrado"
**Solução**:
1. Verificar se REF está digitada corretamente
2. Conferir se produto existe em `products.json`:
   ```bash
   grep -i "seu-ref" src/data/products.json
   ```
3. Se for upload, verificar Supabase:
   - Dashboard Supabase → SQL Editor
   - Query: `SELECT * FROM uploaded_products WHERE ref LIKE 'seu-ref'`

---

### Problema: "Preço não salva"
**Solução**:
1. Verificar se `products.json` é editável:
   ```bash
   ls -la src/data/products.json
   ```
2. Confirmar que arquivo não está no `.gitignore`
3. Verificar se API retorna erro:
   - Abrir DevTools (F12)
   - Aba Network
   - Clicar em Salvar
   - Ver resposta da API

---

### Problema: "Login não funciona"
**Solução**:
1. Verificar credenciais Supabase:
   - `.env.local` tem `NEXT_PUBLIC_SUPABASE_URL`?
   - `.env.local` tem `NEXT_PUBLIC_SUPABASE_ANON_KEY`?
2. Criar usuário no Supabase Auth:
   - Dashboard → Authentication → Users
   - Clique em "Add user"
   - Preencha email e senha
3. Testar login com credenciais novo
4. Se erro persiste:
   ```bash
   # Ver erro no console do browser (F12)
   # Procurar por "Supabase error"
   ```

---

### Problema: "Upload não funciona"
**Solução**:
1. Verificar conexão com Supabase
2. Conferir se tabela `uploaded_products` existe
3. Verificar se todas as credenciais estão corretas
4. Ver console do browser (F12) para erros específicos

---

## ✅ CHECKLIST DE TESTES ANTES DE IR À PRODUÇÃO

- [ ] Login funciona com credenciais reais
- [ ] Pode ver todos os produtos (estáticos + uploads)
- [ ] Pode editar preço de qualquer produto
- [ ] Pode editar nome/descrição
- [ ] Pode editar imagens (mudar capa)
- [ ] Pode reordenar produtos
- [ ] Upload de novo produto funciona
- [ ] Deletar produto funciona
- [ ] Tudo persiste após recarregar página
- [ ] Tudo funciona no Vercel (production)
- [ ] Backup automático está ativo

---

## 📞 COMO REPORTAR BUG NOVO

Se encontrar um novo bug:

1. **Anotar exatamente o que aconteceu**
   - Qual página?
   - Qual ação?
   - Qual o erro?

2. **Verificar console do browser** (F12)
   - Abra DevTools
   - Aba Console
   - Note qualquer erro vermelho

3. **Verificar Network** (F12)
   - Aba Network
   - Faça a ação
   - Veja resposta das APIs
   - Status code 404, 500, etc?

4. **Criar Issue**
   - Título: `[BUG] Descrição breve`
   - Descrição: Passos para reproduzir
   - Screenshots: Se possível
   - Console errors: Copie mensagens de erro

---

**Criado por**: Claude Code  
**Versão**: 1.0  
**Última atualização**: 2026-10-05  
**Status**: Todos os bugs reportados CORRIGIDOS ✅
