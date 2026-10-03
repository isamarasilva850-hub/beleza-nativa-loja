# 📚 Documentação - Beleza Nativa Loja Admin (Palmira Panel)

## 🎯 Resumo Executivo
Este projeto implementa um painel administrativo para sincronizar produtos entre Supabase (banco de dados) e GitHub (controle de versão), com deploy automático no Vercel.

**Status**: ✅ **PRODUÇÃO ATIVA** (belezanativaloja.com.br)

---

## 🚀 Stack Técnico

- **Frontend**: Next.js 16.3.2 (React) + TypeScript
- **Backend API**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Versionamento**: GitHub (isamarasilva850-hub/beleza-nativa-loja)
- **Deploy**: Vercel (auto-deploy on push)
- **Autenticação**: Session Storage + Password Gate

---

## 📋 Arquitetura: Fluxo Sincronização

```
LocalStorage (Browser)
        ↓
  UI Upload/Edit
        ↓
    [🚀 Botão Sync]
        ↓
    ├─ POST /api/sync-products → Supabase
    └─ POST /api/sync-github   → GitHub (commit automático)
        ↓
  Website atualizado
  (lê de GitHub + Supabase)
```

---

## 🔧 Problemas Resolvidos & Soluções

### Problema 1: Conflito de Imports (TypeScript TS2351)
**Erro**: `This expression is not constructable. Not all constituents of type 'ForwardRefExoticComponent<...> | (new (...) => HTMLImageElement)' are constructable.`

**Causa**: Importação `Image from 'next/image'` conflitava com uso de `new Image()` (DOM constructor)

**Solução**: 
```typescript
// ❌ ERRADO
const img = new Image();

// ✅ CORRETO
const imgElement = document.createElement('img') as HTMLImageElement;
```

**Arquivo**: `src/app/admin/palmira/produtos/page.tsx` (linha 66)

---

### Problema 2: Supabase Query Chaining (TypeScript TS7006)
**Erro**: `Property 'catch' does not exist on type 'PostgrestTransformBuilder'`

**Causa**: Supabase queries não suportam `.catch()` chaining como Promises normais

**Solução**:
```typescript
// ❌ ERRADO
const { data: existing } = await supabase
  .from("products")
  .select("id")
  .single()
  .catch(() => ({ data: null }));

// ✅ CORRETO
try {
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .single();
  // ... rest of logic
} catch (e) {
  console.error("Error syncing product:", e);
}
```

**Arquivo**: `src/app/api/sync-products/route.ts` (linhas 28-120)

---

### Problema 3: Indentação Quebrada (Nested Blocks)
**Erro**: `Expected '}', got '<eof>'` durante build

**Causa**: Indentação inconsistente dentro de blocos `if/try/catch` aninhados

**Solução**: Reindentação correta de toda a seção de sincronização de imagens

**Arquivo**: `src/app/api/sync-products/route.ts` (linhas 57-117)

---

## 🔐 Credenciais & Configuração

### Variáveis de Ambiente (.env.local)
```env
# Supabase (obter em: https://app.supabase.com/projects)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# GitHub (gerar em: https://github.com/settings/tokens/new)
# Scopes: repo (full control of private repositories)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# ERP
NEXT_ERP_URL=http://localhost:3000
```

⚠️ **IMPORTANTE**: NUNCA commitar credenciais reais. Usar `.env.local` (já ignorado em `.gitignore`)

### Admin Authentication
- **Senha**: `bn2026`
- **Armazenamento**: sessionStorage (chave: `belezanativa_admin_auth`)
- **Localização**: `src/app/admin/layout.tsx` (linha 68)

---

## 📱 Funcionalidades Implementadas

### 1. Upload de Produtos
- ✅ Múltiplas fotos por produto
- ✅ Drag-and-drop de imagens
- ✅ Reordenação de fotos
- ✅ Remoção de fotos individuais
- ✅ Adição de novas fotos sem deletar existentes
- ✅ Compressão WebP (800x800, 85% quality)

### 2. Sincronização Supabase
- ✅ POST → `/api/sync-products`
- ✅ Merge strategy (upsert por `reference`)
- ✅ Sincronização de imagens com posição
- ✅ Tratamento de erro por produto (continua mesmo se um falhar)

### 3. Sincronização GitHub
- ✅ POST → `/api/sync-github`
- ✅ Atualização automática de `src/data/products.ts`
- ✅ Commit automático com mensagem
- ✅ Botão "🚀 Sincronizar Agora" no painel

### 4. Editing Existing Products
- ✅ Modal de edição com todas as funcionalidades
- ✅ Reordenação de fotos (drag-and-drop)
- ✅ Edição de nome, preço, cores, tamanhos
- ✅ Salvar mudanças em localStorage

---

## 🧪 Como Testar Localmente

### 1. Clonar & Instalar
```bash
cd "C:\Users\Usuario\Documents\beleza-nativa-loja"
npm install
```

### 2. Configurar .env.local
```bash
# Copiar valores de Supabase Dashboard
# GitHub token deve ter permissão: repo (full control)
```

### 3. Iniciar Dev Server
```bash
npm run dev
# Abrir: http://localhost:3000/admin/palmira
# Senha: bn2026
```

### 4. Testar Fluxo Completo
1. Ir para `/admin/palmira/upload`
2. Adicionar produto com foto
3. Clicar "SALVAR PRODUTO"
4. Voltar ao painel
5. Clicar "🚀 Sincronizar Agora"
6. Verificar Supabase Dashboard
7. Verificar commit em GitHub

---

## 🚀 Deploy Vercel

### Processo Automático
1. `git push` → GitHub
2. Vercel detecta mudança
3. Vercel executa `npm run build`
4. Se sucesso → deploy automático
5. Site atualizado em ~2-5 minutos

### Status Build
- Verificar em: https://vercel.com/projects/beleza-nativa-loja
- Logs completos disponíveis no dashboard

### Build Command
```bash
npm run build
# Next.js Turbopack compila tudo
# Testa TypeScript durante build
```

---

## 🐛 Gotchas & Troubleshooting

### ❌ Build falha com "Expected '}', got '<eof>'"
**Solução**: Verificar indentação em blocos try/catch aninhados. Usar IDE com auto-format.

### ❌ "Property 'catch' does not exist on Supabase"
**Solução**: NUNCA usar `.catch()` em Supabase queries. Sempre usar try/catch wrapper.

### ❌ Fotos não sincronizam para GitHub
**Solução**: GitHub tem limite de 100MB por arquivo. Base64 é grande! Use compression (WebP 85%).

### ❌ "npm run build" fica preso em outro build
**Solução**: Kill all Node.js processes: `Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force`

### ❌ Localhost 3000 já está em uso
**Solução**: Mudar porta em `.env.local` ou matar processo: `netstat -ano | findstr :3000`

---

## 📊 Estrutura de Pastas Relevantes

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              ← Admin Gate + Auth
│   │   ├── palmira/
│   │   │   ├── page.tsx            ← 🚀 Painel Principal + Botão Sync
│   │   │   ├── produtos/page.tsx   ← 📦 Editor de Produtos
│   │   │   └── upload/page.tsx     ← 📤 Upload de Novos Produtos
│   ├── api/
│   │   ├── sync-products/route.ts  ← 🔄 Supabase Sync
│   │   └── sync-github/route.ts    ← 🔄 GitHub Sync
│   └── ...
├── data/
│   └── products.ts                 ← 📝 Products array (atualizado via GitHub)
└── lib/
    └── storageEvents.ts            ← LocalStorage management
```

---

## 🎓 Lições Aprendidas

1. **TypeScript é rigoroso**: Resolver todos os erros durante build, não ignorar warnings
2. **Supabase não é Promise**: Diferentes padrões de erro handling
3. **LocalStorage é ephemeral**: Dados desaparecem ao fechar browser, usar Backend para persistência
4. **Git + Vercel = Power**: Deploy automático elimina passo manual
5. **WebP compression**: Economiza 70% do tamanho comparado com PNG/JPEG

---

## 📞 Contato & Suporte

**Desenvolvedor**: Claude Haiku 4.5  
**Data de Conclusão**: 03/10/2026  
**Última Atualização**: 03/10/2026  

Para issues ou melhorias, criar issue no GitHub: `isamarasilva850-hub/beleza-nativa-loja`

---

## ✅ Checklist para Próximos Projetos (Para Vender Sites)

- [ ] TypeScript: Resolver TODOS os erros antes de commit
- [ ] .env.local: Template com placeholders, não commit credenciais reais
- [ ] Supabase: Usar try/catch, NUNCA .catch() em queries
- [ ] GitHub: Gerar token com permissão `repo`, guardar seguro
- [ ] Vercel: Conectar GitHub repo, configurar auto-deploy
- [ ] LocalStorage: Testar em DevTools, limpar antes de deploy
- [ ] Fotos: Comprimir com WebP, não Base64 > 1MB
- [ ] Build: Rodar `npm run build` antes de qualquer push
- [ ] Testing: Testar em localhost 3000 + produção
- [ ] Documentação: Este arquivo! 📚

---

**Made with 💚 for Beleza Nativa**
