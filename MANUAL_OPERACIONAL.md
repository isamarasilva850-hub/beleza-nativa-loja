# 📖 MANUAL OPERACIONAL - BELEZA NATIVA

---

## 👩‍💼 ISAMARA (Proprietária)

### Acessar o Admin
1. Abrir: `www.belezanativaloja.com.br/admin`
2. Digitar senha: `bn2026`
3. Clicar "Entrar"

### Dashboard (Acompanhar Vendas)
- **Total de Vendas**: R$ total do mês
- **Total de Pedidos**: Número de pedidos
- **Ticket Médio**: R$ por pedido
- **Top 5 Revendedoras**: Quem mais vendeu
- **Top 10 Produtos**: Mais procurados
- **Top Cores**: Cores mais vendidas

### Gerenciar Pedidos
1. Menu → "Painel de Pedidos"
2. Ver status: Pendente / Pago / Entregue
3. Clicar no pedido para ver detalhes

### Gerenciar Clientes
1. Menu → "Carteira de Clientes" (Partners)
2. Ver: Nome, Telefone, Cidade, Total de compras
3. Adicionar novo cliente se necessário

### Gerenciar Leads
1. Menu → "Gerenciar Leads"
2. Acompanhar interesse de novos clientes
3. Fazer follow-up via agenda

### Gerar Relatórios
1. Menu → "KPIs de Vendas"
2. Ver todas as métricas do mês
3. Exportar/compartilhar com time

---

## 📦 PALMIRA (Gerente de Estoque)

### Acessar Painel de Upload
1. Abrir: `www.belezanativaloja.com.br/admin/palmira/upload`
2. Digitar senha: `bn2026` (mesma do admin)
3. Clicar "Entrar"

### Salvar Novo Produto

**Passo 1 - Dados Básicos**
```
Referência: 537 (número do produto)
Nome: Conjunto Sem Bojo Com Aro
Preço: 93.80 (preço de custo)
Quantidade: 100 (estoque inicial)
```

**Passo 2 - Cor**
```
Nome da cor: Vinho (ou qualquer cor)
Código da cor: Clicar no seletor de cor e escolher
```

**Passo 3 - Tamanhos**
```
Selecionar: P, M, G, GG (quantos quiser)
```

**Passo 4 - Fotos**
```
Clicar na área ou arrastar arquivos
Selecionar 1+ fotos
Clicar "✅ SALVAR PRODUTO"
```

### Ver Status
- Mensagem verde: `✅ Produto salvo com sucesso! (Local + Servidor)`
- Produto aparece na homepage em segundos

### Atualizar Estoque
1. Menu admin → "Controle de Estoque"
2. Buscar produto
3. Atualizar quantidade

---

## 👗 ROSE (Revendedora)

### Acessar Seu Catálogo
1. Clicar no link único recebido de Isamara
2. Exemplo: `www.belezanativaloja.com.br/catalogo-revendedora/rose-123`

### Montar Pedido para Cliente

**Passo 1 - Browsear Produtos**
```
- Ver fotos dos produtos
- Descrição (tipo de lingerie)
- Preço de revenda (seu lucro)
```

**Passo 2 - Adicionar ao Carrinho**
```
1. Clicar no produto
2. Escolher cor
3. Escolher tamanho
4. Definir quantidade
5. Clicar "🛒 Adicionar"
```

**Passo 3 - Revisar Carrinho**
```
1. Clicar "🛒 Carrinho (X)" no topo
2. Ver total do pedido
3. Aumentar/diminuir quantidade se precisar
```

**Passo 4 - Enviar para Cliente**

**Opção A - Copiar Resumo**
```
1. Clicar "📋 Copiar Resumo"
2. Colar a mensagem no WhatsApp do cliente
3. Cliente vê lista de produtos + preço total
```

**Opção B - Enviar WhatsApp Direto**
```
1. Clicar "💬 Enviar WhatsApp"
2. Se estiver logada no WhatsApp, abre mensagem automática
3. Cliente recebe resumo do pedido
```

### Exemplo de Resumo Enviado
```
📦 PEDIDO

REF 537 - CONJUNTO SEM BOJO COM ARO (Vinho/M)
Qtd: 2 x R$ 150,00 = R$ 300,00

REF 541 - CONJUNTO RENDADO (Rosa/G)
Qtd: 1 x R$ 135,00 = R$ 135,00

─────────────────────────────────────
TOTAL: R$ 435,00
```

### Após Cliente Confirmar
1. Cliente manda Pix/transferência
2. Você atualiza estoque
3. Envia artes/instruções via WhatsApp
4. Registra venda no admin de Isamara

---

## 🔐 SENHAS E ACESSOS

| Acesso | Senha |
|---|---|
| Admin (Isamara) | `bn2026` |
| Palmira Upload | `bn2026` (mesma) |
| Rose (Catálogo) | Acesso via link único |

**Nunca compartilhar senha do admin com clientes!**

---

## ⚠️ O QUE FAZER SE...

### "Produto não aparece após salvar"
1. Recarregar a página (F5)
2. Supabase está sincronizando (segundos)
3. Se continuar, contatar técnico

### "Não consigo acessar o admin"
1. Verificar se digitou senha correta: `bn2026`
2. Limpar cache do navegador (Ctrl+Shift+Del)
3. Tentar em outro navegador (Chrome, Firefox, etc)

### "Cliente não recebe a mensagem do WhatsApp"
1. Copiar o resumo manualmente
2. Colar no chat do cliente
3. Verificar se número de WhatsApp está ativo

### "Foto do produto não aparece"
1. Voltar ao upload
2. Adicionar foto novamente
3. Recarregar página de detalhes

### "Erro 'Produto não encontrado'"
1. Verificar link do catálogo (correto?)
2. Verificar se produto existe no estoque
3. Recarregar página

---

## 📱 FLUXO COMPLETO DE VENDA

```
CLIENTE → REVENDEDORA → BELEZA NATIVA → CLIENTE
   ↓           ↓              ↓              ↓
Pede foto   Envia link    Carrega        Vê produtos
   ↓           ↓              ↓              ↓
Escolhe    Monta pedido   Calcula       Escolhe
produto    no carrinho    preço         tamanho/cor
   ↓           ↓              ↓              ↓
Combina    Clica em       Exibe         Confirma
tamanho    WhatsApp       total         compra
   ↓           ↓              ↓              ↓
Confirma   Envia resumo   Mostra        Manda
preço      de pedido      descrição     Pix
   ↓           ↓              ↓              ↓
Manda Pix  Recebe Pix     Sincroniza    Produto
           Atualiza       com           entregue
           estoque        Supabase
           Envia artes
```

---

## 📊 MÉTRICAS PARA ACOMPANHAR

**Isamara deve monitorar:**
- Total de vendas por mês
- Top 3 revendedoras
- Produtos mais vendidos
- Cores mais procuradas
- Ticket médio por pedido
- Taxa de conversão

---

**Última atualização:** 26/09/2026  
**Versão:** 1.0  
**Status:** ✅ PRONTO PARA OPERAÇÃO
