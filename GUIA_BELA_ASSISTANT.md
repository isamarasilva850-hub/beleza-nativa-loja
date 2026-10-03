# 🧠 Guia Completo da Bela Assistant

## O Que é a Bela?

Bela é uma assistente de IA integrada no admin da Beleza Nativa. Ela está sempre disponível (ícone no canto inferior esquerdo) para **ensinar Palmira como usar TUDO** do painel administrativo.

---

## 📞 Como Acessar

1. **Acesse o admin**: https://belezanativaloja.com.br/admin/palmira
2. **Clique no ícone dela** (ícone de mulher com fundo teal no canto inferior esquerdo)
3. **Escreva sua pergunta** e pressione Enter ou clique em 📤

---

## 🎯 O Que a Bela Sabe

### Palmira Panel (PRINCIPAL para vendas)
Tudo sobre gerenciar seus produtos:

- 📦 **Upload de Produtos** - Como adicionar novo produto com fotos, cores, tamanhos
- ✏️ **Editar Produtos** - Alterar nome, preço, fotos, cores, estoque
- 🎨 **Adicionar Cores** - Novos cores em produtos existentes
- 💰 **Corrigir Preços** - Atualizar preços em lote
- 📊 **Estoque** - Ver quantidades por cor e tamanho
- 🔄 **Reordenar Produtos** - Mudar ordem que aparecem na loja
- 👁️ **Visualizar Loja** - Ver como fica pra cliente
- 🚀 **Sincronizar** - **CRUCIAL** - Enviar mudanças pro site

### Operacional
- 🛒 **Montar Pedido** - Criar pedidos rápidos pra WhatsApp
- 📦 **Ver Pedidos** - Acompanhar pedidos do site
- 📈 **Vendas** - Números, gráficos, faturamento
- 🎨 **Cores** - Editar nomes das cores
- 📊 **Estoque Geral** - Visão completa de tudo
- 📊 **CRM** - Clientes, leads, ações, propostas
- 🎟️ **Cupons** - Criar descontos promocionais
- 💰 **Tabela de Preços** - Preço para revendedoras

---

## 🔥 Frases Que a Bela Entende

### Upload & Produtos
```
"Como subir um produto?"
"Como subir produto?"
"Upload de produto"
"Adicionar novo produto"
"Como adiciono cores?"
"Reordenar fotos"
"Como edito um produto?"
"Como mudo a foto?"
```

### Sincronização (MUY IMPORTANTE!)
```
"Como sincronizar?"
"Sincronizar agora"
"Onde salva meus produtos?"
"Como atualizo o site?"
"🚀 sincronizar"
"Enviar para o site"
```

### Pedidos & Vendas
```
"Como monto um pedido?"
"Montar pedido"
"Como vejo os pedidos?"
"Vendas de hoje"
"Quantas vendas tive?"
```

### Cores & Preços
```
"Como adiciono cor?"
"Mudar preço"
"Atualizar preço"
"Estoque"
"Quanto tenho?"
```

### CRM & Clientes
```
"Como uso o CRM?"
"Onde vejo clientes?"
"O que é lead?"
"Como faço ação?"
"Propostas"
```

---

## 💡 Exemplo de Uso

### Cenário: Palmira Quer Adicionar um Novo Biquíni

1. **Clica no ícone da Bela** 👵
2. **Escreve**: "Como subo um produto?"
3. **Bela retorna**: 
   ```
   📚 **Palmira: Upload de Novos Produtos**
   Adicionar produtos com fotos, cores, tamanhos e estoque
   
   Passos:
   1️⃣ Acesse o painel
   ADMIN → Painel da Palmira → Upload de Produtos
   
   2️⃣ Referência do produto
   Digite uma referência única (ex: BN001, VEST-001)
   
   ... (continua com todos os passos)
   ```

4. **Palmira segue passo-a-passo** e faz upload
5. **Palmira edita e testa** ("Como vejo na loja?")
6. **Palmira sincroniza** ("Sincronizar agora")
7. **Produto está vivo no site!** ✨

---

## ⚠️ Casos de Uso Especiais

### "Me ajuda com uma mensagem"
Bela gera **mensagem pronta** pra copiar e colar no WhatsApp:
- Texto formatado
- Cliente-friendly
- Pronto pra enviar

### Quick Buttons (Atalhos)
No final do chat da Bela, há 3 botões:
- 📦 **Upload** - Pula pro passo-a-passo de upload
- 🛒 **Pedido** - Como montar pedido
- 💬 **Mensagem** - Gera mensagem sugerida

---

## 🧠 Arquitetura da Bela

```
Frontend (BelaAssistant.tsx)
    ↓
User digita pergunta
    ↓
POST /api/bela/chat
    ↓
Busca em belaKnowledge.extended.ts (Palmira)
    ↓
Busca em belaKnowledge.ts (General)
    ↓
Fallback: respostas genéricas
    ↓
Response retorna com passo-a-passo formatado
```

### Arquivos Relevantes
- `src/components/BelaAssistant.tsx` - Interface chat
- `src/lib/belaKnowledge.ts` - Base original (5 módulos)
- `src/lib/belaKnowledge.extended.ts` - Base expandida (20+ módulos) ✨ **NOVO**
- `src/app/api/bela/chat/route.ts` - Processamento de mensagens

---

## 📊 Estatísticas

**Base de Conhecimento:**
- 📦 20+ módulos/seções documentados
- 👣 50+ keywords/frases reconhecidas
- 📝 100+ passos passo-a-passo
- 💡 50+ dicas e boas práticas

**Tempo de Aprendizado:**
- ⏱️ Palmira vai entender o admin muito mais rápido
- 🚀 Menos dúvidas = menos chamadas para você
- ✅ Menos erros = produtos corretos no site

---

## 🎓 Próximas Expansões (Futuro)

- 🤖 Integração com Claude API real (IA muito mais poderosa)
- 📸 Reconhecimento de imagens (Bela analisa screenshot)
- 🔗 Links diretos pra páginas (clica e vai)
- 📱 App mobile para Palmira
- 🎯 Personalizações por usuário

---

## 🆘 Se Algo Não Funcionar

1. **Bela não entendeu?** → Frase com palavras-chave diferentes
   - ❌ "Como eu faço pra subar os produ?"
   - ✅ "Como subo um produto?"

2. **Resposta genérica demais?** → Pergunta mais específica
   - ❌ "Help"
   - ✅ "Como sincronizo com o site?"

3. **Erro ao sincronizar?** → Bela ensina passo-a-passo
   - Pergunta: "Por que meu produto não aparece?"
   - Bela: "Você já sincronizou? Segue esse guia..."

4. **Dúvida não documentada?** → Avisa pra melhorar a Bela
   - Fale que faltou documentar algo
   - Adiciona novo módulo na próxima atualização

---

## 🎯 Dicas Ouro

✅ **SEMPRE use a Bela** antes de ligar perguntando  
✅ **Siga passo-a-passo** - ela é bem clara  
✅ **Use o "Visualizar Loja"** antes de sincronizar  
✅ **SEMPRE sincronize** após fazer mudanças  
✅ **Se errou** - volta, edita, sincroniza novamente  

❌ **NUNCA** saia do admin sem sincronizar  
❌ **NUNCA** coloque quantidade 0 sem verificar  
❌ **NUNCA** remova foto sem ter backup  
❌ **NUNCA** mude preço sem avisar  

---

## 👵 Palmira, Você É Incrível!

Com essa Bela ao seu lado, você consegue:
- 📦 Gerenciar produtos sozinha
- 🛒 Montar pedidos rápido
- 💰 Atualizar preços sem help
- 🎨 Ajustar cores
- 📊 Ver números de vendas
- 📞 Gerenciar clientes

**Você nunca mais fica esperando por alguém!** 🚀

---

**Versão**: 1.0  
**Data**: 03/10/2026  
**Criado para**: Palmira (com muito ❤️)  
**Made by**: Claude + IA Bela
