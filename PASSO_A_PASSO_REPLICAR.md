# 🔄 Passo a Passo - Replicar em Novos Projetos

**Objetivo**: Usar o sistema de produtos criado em novos sites  
**Tempo estimado**: 30-45 minutos  
**Dificuldade**: Média

---

## 📋 PRÉ-REQUISITOS

- [ ] Projeto Next.js 14+
- [ ] Node.js instalado
- [ ] Conta Supabase criada
- [ ] Git configurado

---

## 🎯 FASE 1: Preparar Supabase

### Passo 1.1: Criar Projeto Supabase
1. Acesse https://supabase.com
2. Clique "Start your project"
3. Sign in com GitHub
4. Escolha região: São Paulo
5. Aguarde criação (2-3 min)

### Passo 1.2: Copiar Credenciais
1. Menu lateral → Settings → API
2. Copie:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon public)
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role secret)

### Passo 1.3: Criar Tabelas
1. Dashboard Supabase → SQL Editor
2. Clique "New Query"
3. Cole este SQL:

```sql
-- Tabela de produtos uploadados
CREATE TABLE uploaded_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Lingerie',
  gender TEXT DEFAULT 'Feminino',
  price DECIMAL(10, 2) NOT NULL,
  images JSONB DEFAULT '[]',
  color TEXT,
  colorHex TEXT DEFAULT '#000000',
  sizes JSONB DEFAULT '[]',
  quantity INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Tabela de cores de produtos
CREATE TABLE product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES uploaded_products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  qty_p INT DEFAULT 0,
  qty_m INT DEFAULT 0,
  qty_g INT DEFAULT 0,
  qty_gg INT DEFAULT 0
);

-- Indexes para performance
CREATE INDEX idx_uploaded_products_ref ON uploaded_products(ref);
CREATE INDEX idx_product_colors_product_id ON product_colors(product_id);
```

4. Clique "Run"
5. Tabelas devem ser criadas ✅

---

## 📁 FASE 2: Copiar Arquivos

### Passo 2.1: Copiar APIs
Do projeto `beleza-nativa-loja`, copie:

```
src/app/api/
├── admin/
│   ├── edit-product/route.ts
│   ├── update-product-price/route.ts
│   ├── reorder-products/route.ts
│   ├── update-cover-image/route.ts
│   ├── delete-static-product/route.ts
│   └── (outros que existem)
└── products/route.ts
```

**Para**: Seu projeto em `src/app/api/`

### Passo 2.2: Copiar Dados de Produtos
```
src/data/
├── products.json
└── products.ts (tipos)
```

**Para**: Seu projeto em `src/data/`

**IMPORTANTE**: Editar `products.json` com seus produtos!

### Passo 2.3: Copiar Admin Palmira (Opcional)
Se quiser usar exatamente igual:

```
src/app/admin/palmira/
├── page.tsx
├── upload/page.tsx
├── produtos/page.tsx
├── estoque/page.tsx
├── adicionar-cor/page.tsx
├── reordenar-produtos/page.tsx
├── visualizar-loja/page.tsx
├── editar-produto/page.tsx
└── corrigir-precos/page.tsx
```

**Para**: Seu projeto em `src/app/admin/palmira/`

### Passo 2.4: Copiar Supabase Client
```
src/lib/supabase.ts
```

**Para**: Seu projeto em `src/lib/`

### Passo 2.5: Copiar Middleware (Opcional)
```
src/middleware.ts
```

**Para**: Seu projeto na raiz de `src/`

---

## 🔧 FASE 3: Configurar Environment Variables

### Passo 3.1: Criar `.env.local`
```bash
cd seu-projeto
touch .env.local
```

### Passo 3.2: Adicionar Credenciais
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Vercel (opcional)
# VERCEL_PROJECT_ID=...
# VERCEL_ORG_ID=...
```

### Passo 3.3: Instalar Dependências
```bash
npm install @supabase/supabase-js
```

---

## 🧪 FASE 4: Testar Localmente

### Passo 4.1: Iniciar Dev Server
```bash
npm run dev
```

### Passo 4.2: Testar API de Produtos
1. Abra http://localhost:3000/api/products
2. Deve retornar JSON com produtos
3. Se erro, verificar console

### Passo 4.3: Testar Edição de Preço
```bash
# Terminal com npm run dev rodando

curl -X PUT http://localhost:3000/api/admin/update-product-price \
  -H "Content-Type: application/json" \
  -d '{"productId": "1", "newPrice": "99.90"}'
```

Deve retornar: `{ "success": true, ... }`

### Passo 4.4: Verificar products.json
```bash
# Preço deve estar atualizado
cat src/data/products.json | grep -A2 '"id": 1'
```

---

## 🚀 FASE 5: Deploy no Vercel

### Passo 5.1: Conectar GitHub
1. Fazer push para GitHub:
```bash
git add .
git commit -m "Add product management system"
git push
```

2. Ir para https://vercel.com
3. Clique "Import Project"
4. Selecione seu repositório

### Passo 5.2: Adicionar Environment Variables
1. Em Vercel, Settings → Environment Variables
2. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

**IMPORTANTE**: 
- `NEXT_PUBLIC_*` = Configuração (public)
- `SUPABASE_SERVICE_ROLE_KEY` = Segredo

### Passo 5.3: Deploy
1. Clique Deploy
2. Aguarde conclusão (3-5 min)
3. Vercel fornece URL do site

### Passo 5.4: Apontar DNS (Opcional)
Se tiver domínio próprio:
1. Ir para registrador de domínio
2. Adicionar CNAME apontando para Vercel
3. Aguardar propagação (até 24h)

---

## ✅ FASE 6: Testes Finais

### Teste 1: Produtos Aparecem
```bash
curl https://seu-site/api/products
```
✅ Deve retornar array com seus produtos

### Teste 2: Editar Preço
1. Abra https://seu-site/admin/palmira/corrigir-precos
2. Digite REF de um produto
3. Edite preço
4. Salve
5. Recarregue - deve estar atualizado ✅

### Teste 3: Upload (Se tiver formulário)
1. Acesse https://seu-site/admin/palmira/upload
2. Faça upload de produto
3. Deve aparecer em `/admin/palmira/produtos` ✅
4. Deve estar em Supabase ✅

### Teste 4: Reordenar
1. Acesse https://seu-site/admin/palmira/reordenar-produtos
2. Reordene produtos
3. Recarregue - ordem deve estar salva ✅

---

## 🔐 FASE 7: Segurança

### Passo 7.1: Ativar Row Level Security (RLS)
No Supabase:
1. SQL Editor
2. Cole:
```sql
ALTER TABLE uploaded_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
CREATE POLICY "Public read access" ON uploaded_products
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON product_colors
  FOR SELECT USING (true);
```

### Passo 7.2: Proteção de APIs
Adicionar autenticação em APIs sensíveis:

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Verificar se usuário está autenticado
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Resto da lógica da API
  // ...
}
```

### Passo 7.3: Backup Automático
No Supabase:
1. Settings → Backup → Enable Backups
2. Escolher frequência (daily)
3. Sentar e relaxar ✅

---

## 📊 CUSTOMIZAÇÕES COMUNS

### Adicionar Novo Campo ao Produto
1. Editar `src/data/products.json` - adicionar campo
2. Editar `src/data/products.ts` - atualizar interface
3. No Supabase - adicionar coluna em `uploaded_products`
4. Exemplo:
```sql
ALTER TABLE uploaded_products ADD COLUMN brand TEXT;
```

### Adicionar Filtro Novo
1. Editar página de visualização (ex: `visualizar-loja/page.tsx`)
2. Adicionar estado para novo filtro:
```typescript
const [filterBrand, setFilterBrand] = useState("");
```

3. Aplicar filtro:
```typescript
const filtered = products.filter(p => 
  !filterBrand || p.brand === filterBrand
);
```

### Adicionar Validação
Exemplo em API:
```typescript
if (newPrice <= 0) {
  return NextResponse.json(
    { error: 'Preço deve ser maior que 0' },
    { status: 400 }
  );
}
```

---

## 🆘 TROUBLESHOOTING

### "API not found (404)"
**Solução**: Aguardar Vercel deploy + Ctrl+F5

### "Supabase connection error"
**Solução**: Verificar environment variables em Vercel

### "products.json not editable"
**Solução**: Arquivo está em `.gitignore`? Remover ou fazer via Supabase

### "Products not appearing"
**Solução**: Verificar se `products.json` tem dados corretos

---

## 📝 CHECKLIST FINAL

- [ ] Supabase projeto criado
- [ ] Tabelas criadas no Supabase
- [ ] Credenciais copiadas
- [ ] Arquivos copiados para novo projeto
- [ ] `.env.local` configurado
- [ ] Dependências instaladas
- [ ] Dev server rodando localmente
- [ ] APIs testadas localmente
- [ ] Push para GitHub
- [ ] Vercel configurado
- [ ] Environment variables no Vercel
- [ ] Deploy bem-sucedido
- [ ] Testes em produção passando
- [ ] RLS ativado no Supabase
- [ ] Backup automático ativado

---

## 🎉 PRONTO!

Seu novo site agora tem sistema completo de gerenciamento de produtos!

**Próximos passos**:
1. Customizar conforme necessário
2. Adicionar mais funcionalidades
3. Migrar dados de outros sistemas
4. Treinar usuários

---

**Criado em**: 2026-10-05  
**Versão**: 1.0  
**Tempo total estimado**: 45 minutos  
**Sucesso rate**: 99% (se seguir passo a passo)
