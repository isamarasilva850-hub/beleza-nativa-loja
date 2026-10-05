# 📚 Documentação Completa - Sistema Beleza Nativa

**Criado**: 2026-10-05  
**Versão**: 1.0  
**Propósito**: Referência para replicar em novos projetos/sites

---

## 🎯 O QUE FOI CRIADO

Sistema completo de gerenciamento de produtos com:
- Upload de produtos com múltiplas imagens
- Edição completa de produtos (preço, cores, imagens, etc)
- Reordenação no site
- Persistência em JSON (estáticos) e Supabase (uploads)
- Autenticação Supabase
- Admin panel para gerenciar tudo

---

## 📁 ESTRUTURA DE DADOS

### 1. **products.json** - Produtos Estáticos
```json
[
  {
    "id": 1,
    "ref": "537",
    "name": "CONJUNTO SEM BOJO COM ARO",
    "price": 46.90,
    "description": "...",
    "composition": "...",
    "care": "...",
    "collection": "Coleção",
    "gender": "Feminino",
    "category": "Conjuntos",
    "variants": [
      {
        "color": "Preto",
        "colorHex": "#000000",
        "sizes": ["P", "M", "G", "GG"]
      }
    ],
    "images": ["url1", "url2", "url3"]
  }
]
```

### 2. **Supabase Tables**

#### `uploaded_products`
```sql
- id: UUID (primary)
- ref: TEXT
- name: TEXT
- category: TEXT
- gender: TEXT
- price: DECIMAL
- images: JSONB (array)
- color: TEXT
- colorHex: TEXT
- sizes: JSONB (array)
- quantity: INT
- createdAt: TIMESTAMP
```

#### `product_colors`
```sql
- id: UUID (primary)
- product_id: UUID (FK)
- color_name: TEXT
- color_hex: TEXT
- qty_p: INT (Pequeno)
- qty_m: INT (Médio)
- qty_g: INT (Grande)
- qty_gg: INT (Extra Grande)
```

---

## 🔌 APIs CRIADAS

### 1. **GET /api/products**
Retorna TODOS os produtos (estáticos + uploadados)

**Response:**
```json
[
  { "id": 1, "ref": "537", "name": "Produto", "price": 46.90 },
  { "id": "uuid", "ref": "999", "name": "Upload", "price": 50.00 }
]
```

### 2. **PUT /api/admin/edit-product**
Edita qualquer campo do produto

**Request:**
```json
{
  "productId": "1",
  "updates": {
    "name": "Novo Nome",
    "price": 99.90,
    "description": "Nova descrição"
  }
}
```

### 3. **PUT /api/admin/update-product-price**
Atualiza apenas o preço

**Request:**
```json
{
  "productId": "1",
  "newPrice": "99.90"
}
```

### 4. **PUT /api/admin/reorder-products**
Reordena produtos no site

**Request:**
```json
{
  "orderedIds": ["1", "3", "2", "4"]
}
```

### 5. **PUT /api/admin/update-cover-image**
Muda a primeira imagem (capa)

**Request:**
```json
{
  "productId": "1",
  "coverImageUrl": "https://nova-imagem.jpg"
}
```

### 6. **DELETE /api/admin/delete-static-product**
Deleta um produto estático

**Request:**
```json
{
  "productId": "1"
}
```

### 7. **POST /api/products-upload**
Upload de novo produto

**Request:**
```json
{
  "ref": "999",
  "name": "Novo Produto",
  "category": "Lingerie",
  "gender": "Feminino",
  "price": 50.00,
  "images": ["base64..."],
  "color": "Preto",
  "colorHex": "#000000",
  "sizes": ["P", "M", "G", "GG"],
  "quantity": 100
}
```

---

## 📱 PÁGINAS DO ADMIN

### `/admin/palmira` - Dashboard Principal
- Botão Sincronizar com Supabase
- Botão Atualizar Classificação (gênero)
- 8 cards com funcionalidades:
  1. Upload
  2. Produtos
  3. Estoque
  4. Adicionar Cor
  5. Reordenar
  6. Prévia Loja
  7. Editar Produto
  8. Corrigir Preços

### `/admin/palmira/upload`
- Upload de múltiplas imagens
- Define preço, tamanhos, cores
- Salva automaticamente no Supabase

### `/admin/palmira/produtos`
- Lista todos com galeria de miniaturas
- Edição de imagens (reordenar, deletar)
- Busca por REF

### `/admin/palmira/estoque`
- Total de peças
- Alerta de baixo estoque
- Ordenar por quantidade

### `/admin/palmira/adicionar-cor`
- Busca produto existente
- Adiciona nova cor sem reupload

### `/admin/palmira/reordenar-produtos`
- Drag & drop dos produtos
- Salva ordem automaticamente

### `/admin/palmira/visualizar-loja`
- Preview do site
- Filtro por categoria
- Mostra ordem exata

### `/admin/palmira/editar-produto`
- Busca por REF
- Edita cores, imagens, quantidade
- Deleta fotos

### `/admin/palmira/corrigir-precos`
- Busca por REF
- Edita preço
- Salva permanentemente

---

## 🔄 FLUXO DE TRABALHO

### Para Produtos Estáticos:
1. Estão em `src/data/products.json`
2. Palmira acessa "Corrigir Preços"
3. Digita REF do produto
4. Edita preço, nome, descrição, imagens
5. Clica em salvar
6. Salva em `products.json` automaticamente ✅

### Para Produtos Uploadados:
1. Palmira vai em "Upload"
2. Faz upload com múltiplas fotos
3. Define preço, cores, tamanhos
4. Clica "Salvar"
5. Salva no Supabase automaticamente ✅
6. Aparece na loja instantaneamente

### Para Reordenar:
1. Acessa "Reordenar"
2. Arrasta produtos na ordem desejada
3. Salva (automático ao soltar)
4. Ordem atualizada no site ✅

---

## 🛠️ COMO ADICIONAR A OUTROS PROJETOS

### Passo 1: Copiar Arquivos
```
src/app/api/admin/
src/app/api/products/
src/data/products.json
```

### Passo 2: Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=seu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave
SUPABASE_SERVICE_ROLE_KEY=sua-role-key
```

### Passo 3: Criar Tabelas no Supabase
```sql
CREATE TABLE uploaded_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref TEXT,
  name TEXT,
  category TEXT,
  gender TEXT,
  price DECIMAL,
  images JSONB,
  color TEXT,
  colorHex TEXT,
  sizes JSONB,
  quantity INT,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES uploaded_products(id),
  color_name TEXT,
  color_hex TEXT,
  qty_p INT,
  qty_m INT,
  qty_g INT,
  qty_gg INT
);
```

### Passo 4: Criar produto.json com seus produtos
```json
[
  {
    "id": 1,
    "ref": "001",
    "name": "Seu Produto",
    "price": 0.00,
    ...
  }
]
```

---

## ✨ RECURSOS AVANÇADOS

### 1. Sincronização com GitHub
API `/api/sync-github` sincroniza produtos com repositório

### 2. Sincronização com Supabase
API `/api/sync-products` sincroniza com banco de dados

### 3. Atualizar Classificação
Button no dashboard atualiza gênero dos produtos automaticamente

### 4. Real-time
Produtos atualizam no site em tempo real

---

## 🔐 AUTENTICAÇÃO

### Login
- Acesse `/login`
- Use credenciais Supabase Auth
- Middleware protege `/admin`

### Supabase Auth
```typescript
import { supabase } from '@/lib/supabase';

// Sign in
await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Sign out
await supabase.auth.signOut();
```

---

## 📊 BANCO DE DADOS

### Supabase Setup
1. Criar projeto em supabase.com
2. Copiar URL e Anon Key
3. Colocar em `.env.local`
4. Criar tabelas (SQL acima)
5. Ativar Row Level Security (RLS)

---

## 🚀 DEPLOY

### Vercel
1. Conectar GitHub
2. Adicionar environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático em cada push

### DNS
- Apontar domínio para Vercel
- Exemplo: `belezanativaloja.com.br` → Vercel

---

## 📝 CHECKLIST PARA NOVOS SITES

- [ ] Copiar `src/app/api/admin/` 
- [ ] Copiar `src/app/api/products/`
- [ ] Copiar `src/data/products.json` (ou criar novo)
- [ ] Copiar `src/app/admin/palmira/` (ou adaptar)
- [ ] Copiar `src/middleware.ts`
- [ ] Copiar `src/lib/supabase.ts`
- [ ] Criar projeto Supabase
- [ ] Criar tabelas SQL
- [ ] Adicionar `.env.local` com credenciais
- [ ] Testar login
- [ ] Testar upload de produto
- [ ] Testar edição de preço
- [ ] Testar reordenação
- [ ] Deploy no Vercel
- [ ] Apontar DNS

---

## 🐛 TROUBLESHOOTING

### "Produto não encontrado"
- Verificar se REF está correta
- Conferir se produto existe em `products.json` ou Supabase

### "Erro ao salvar preço"
- Verificar credenciais Supabase
- Confirmar se `products.json` é editável
- Ver logs de erro

### "Upload não funciona"
- Verificar se Supabase está conectado
- Conferir `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Checar tabela `uploaded_products`

### "API retorna 404"
- Aguardar Vercel completar deploy (3-5 min)
- Recarregar browser (Ctrl+F5)
- Verificar se arquivo existe

---

## 📚 REFERÊNCIAS

- **Supabase Docs**: https://supabase.com/docs
- **Next.js API Routes**: https://nextjs.org/docs/pages/building-your-application/routing/api-routes
- **React Hooks**: https://react.dev/reference/react

---

## 💡 DICAS IMPORTANTES

1. **Sempre backup** do `products.json` antes de fazer mudanças grandes
2. **Testar localmente** antes de deploy no Vercel
3. **Usar modo incógnito** para testar login múltiplo
4. **Monitorar Vercel logs** para bugs em produção
5. **Sincronizar regularmente** com Supabase

---

**Última atualização**: 2026-10-05  
**Versão do Next.js**: 14+  
**Versão do React**: 18+  
**Supabase**: Última versão
