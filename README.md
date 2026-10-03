# 🏪 Beleza Nativa Loja - Admin Panel (Palmira)

Sistema administrativo para sincronizar produtos entre Supabase e GitHub com deploy automático no Vercel.

**Status**: ✅ **PRODUÇÃO** - belezanativaloja.com.br/admin/palmira

---

## 🚀 Começar Rápido

### Dev Local
```bash
npm install
npm run dev
# Abrir: http://localhost:3000/admin/palmira
# Senha: bn2026
```

### Build para Produção
```bash
npm run build
npm start
```

---

## 🎯 Stack Técnico

- **Frontend**: Next.js 16.3.2 + TypeScript + React
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Version Control**: GitHub (isamarasilva850-hub/beleza-nativa-loja)
- **Deployment**: Vercel (auto-deploy on push)
- **Auth**: Session Storage + Password Gate (bn2026)

---

## 🔧 Problemas Conhecidos & Soluções

### 1️⃣ TypeScript: "Image constructor conflict"
**Causa**: Import `Image from 'next/image'` vs `new Image()` (DOM)  
**Fix**: Use `document.createElement('img')` em vez de construtor  
**Arquivo**: `src/app/admin/palmira/produtos/page.tsx:66`

### 2️⃣ Supabase: "Property 'catch' does not exist"
**Causa**: Supabase queries NÃO suportam `.catch()`  
**Fix**: Usar `try/catch` ao invés de `.catch()`  
**Arquivo**: `src/app/api/sync-products/route.ts:28-120`

### 3️⃣ Build: "Expected '}', got '<eof>'"
**Causa**: Indentação quebrada em blocos aninhados  
**Fix**: Reindentação correcta (IDE auto-format ajuda!)

### 4️⃣ Build preso: "Another next build already running"
**Fix**: `Get-Process node | Stop-Process -Force`

---

## 📋 Funcionalidades

✅ Upload de produtos com múltiplas fotos  
✅ Drag-and-drop para reordenar imagens  
✅ Edição de fotos (remover, adicionar, reordenar)  
✅ Sincronização automática → Supabase + GitHub  
✅ Botão "🚀 Sincronizar Agora" no painel  
✅ Compressão WebP automática (800x800)  
✅ Merge strategy (upsert por reference)  
✅ Commit automático no GitHub  

---

## 🔐 Variáveis de Ambiente

```env
# .env.local (criar este arquivo com suas credenciais)
# ⚠️ NÃO COMMITAR - já está no .gitignore
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
GITHUB_TOKEN=ghp_xxxx
NEXT_ERP_URL=http://localhost:3000
```

**Admin Password**: `bn2026` (arquivo: `src/app/admin/layout.tsx:68`)

---

## 📱 Como Usar (Para Palmira)

1. Abrir: **belezanativaloja.com.br/admin/palmira**
2. Entrar com senha: **bn2026**
3. Ir para "Upload de Produtos"
4. Adicionar referência, nome, preço, cor, tamanho
5. **Arrastar fotos** (drag-drop) ou clicar para upload
6. Clicar "✅ SALVAR PRODUTO"
7. Voltar ao painel
8. Clicar **"🚀 Sincronizar Agora"**
9. Aguardar 2-3s (sincroniza com Supabase + GitHub)
10. Website atualizado automaticamente! 🎉

---

## 🧪 Testar Fluxo Completo

```bash
# 1. Dev local
npm run dev

# 2. Abrir painel
http://localhost:3000/admin/palmira

# 3. Fazer upload de produto

# 4. Clicar "🚀 Sincronizar Agora"

# 5. Verificar Supabase Dashboard
# 6. Verificar GitHub commit em src/data/products.ts
```

---

## 🚀 Deploy Automático

1. Fazer mudança local
2. `git commit && git push`
3. GitHub recebe push
4. Vercel detecta mudança automaticamente
5. Vercel executa `npm run build`
6. Se sucesso → Deploy automático ✅
7. Site atualizado em ~2-5 minutos

**Dashboard**: https://vercel.com/projects/beleza-nativa-loja

---

## 📊 Estrutura Relevante

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              ← Auth Gate + Password
│   │   └── palmira/
│   │       ├── page.tsx            ← 🚀 Painel Principal
│   │       ├── produtos/page.tsx   ← 📦 Editar Produtos
│   │       └── upload/page.tsx     ← 📤 Upload Novo
│   └── api/
│       ├── sync-products/route.ts  ← Supabase Sync
│       └── sync-github/route.ts    ← GitHub Sync
└── data/
    └── products.ts                 ← Produtos (atualizado via GitHub)
```

---

## ⚠️ Gotchas Importantes

- ❌ NUNCA usar `.catch()` em Supabase queries → usar `try/catch`
- ❌ NUNCA commitar `.env.local` com credenciais reais
- ❌ Base64 de fotos é GRANDE → comprimir com WebP
- ❌ Build precisa passar antes de push
- ✅ Sempre testar em `localhost:3000` antes de prod

---

## 📚 Referências

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [GitHub API](https://docs.github.com/en/rest)
- [Vercel Deployment](https://vercel.com/docs)

---

**Feito com 💚 para Beleza Nativa**  
Última atualização: 03/10/2026
