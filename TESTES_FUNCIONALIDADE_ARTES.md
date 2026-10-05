# 🧪 Plano de Testes - Funcionalidade de Artes

**Data**: 2026-10-05  
**Objetivo**: Testar fluxo completo de artes (pedido → WhatsApp → download)  
**Status**: ❓ AGUARDANDO TESTES  

---

## 🎯 O QUE TESTAR

Fluxo completo:
1. Revendedora faz pedido e paga
2. Admin envia artes via WhatsApp
3. Revendedora recebe link
4. Clica no link e vê as artes
5. Baixa as imagens
6. Copia o catálogo dela

---

## 📋 CHECKLIST DE TESTES

### ✅ ETAPA 1: PREPARAÇÃO
- [ ] Acessar `/admin/artes` (página do admin)
- [ ] Página carrega sem erros?
- [ ] Mensagem de "artes para enviar" aparece?
- [ ] Se nenhuma arte: mensagem "✨ Sem artes para enviar" aparece?

### ✅ ETAPA 2: CRIAR PEDIDO TESTE
**Cenário**: Fazer um pedido TEST para testar

Opções:
- [ ] Usar `montar-pedido` para criar pedido teste
- [ ] Usar um pedido real anterior
- [ ] Usar `/simular-pedido-revendedora` para simular

**Checklist**:
- [ ] Pedido criado com sucesso?
- [ ] Status mudou para "pago"?
- [ ] Aparece em `/admin/artes`?
- [ ] Produto do pedido aparece correto?

### ✅ ETAPA 3: ENVIAR ARTES VIA WHATSAPP
**Ação**: Clicar em "🎨 Enviar Artes via WhatsApp"

**Checklist**:
- [ ] Botão está visível?
- [ ] Botão clicável?
- [ ] Abre WhatsApp Web/Mobile?
- [ ] Mensagem aparece com:
  - [ ] Link das artes (contém `/artes-pedido/`)?
  - [ ] Link do catálogo (contém `/catalogo-revendedora/`)?
  - [ ] Instrções de uso?
  - [ ] Emoji bonito? 🎨

**Mensagem esperada deve conter**:
```
🎨 SUAS ARTES ESTÃO PRONTAS!

📸 Clique aqui para ver todas as fotos com as legendas:
[LINK DA ARTE]

💡 COMO USAR:
1️⃣ Baixe as imagens
2️⃣ Poste no Instagram, Facebook, WhatsApp e Stories
3️⃣ Venda com as fotos prontas!

📱 Seu Catálogo Completo:
[LINK CATÁLOGO]

Todas as peças estão prontas para você usar e ganhar! 💰✨
```

### ✅ ETAPA 4: ACESSAR LINK DE ARTES
**Ação**: Clicar no link `/artes-pedido/[orderId]`

**Checklist**:
- [ ] Link abre sem erro 404?
- [ ] Página carrega (não fica branca/em branco)?
- [ ] Mostra título "🎨 Suas Artes Estão Prontas!"?
- [ ] Mostra instruções de como usar?

### ✅ ETAPA 5: VER AS ARTES
**Ação**: Página de artes carrega

**Checklist para cada arte**:
- [ ] Foto do produto aparece?
- [ ] Foto não é placeholder/quebrada?
- [ ] Referência (REF) aparece correta?
- [ ] Nome do produto aparece?
- [ ] Legenda de destaque aparece (se tiver)?
- [ ] Legenda completa aparece (se tiver)?

**Problemas possíveis**:
- ❌ Foto é placeholder (cor cinza)
- ❌ Foto é "quebrada" (X vermelho)
- ❌ REF errada
- ❌ Nome errado

### ✅ ETAPA 6: BAIXAR/SALVAR IMAGENS
**Ação**: Clicar botão "💾 Salvar Imagem"

**Checklist**:
- [ ] Botão clicável?
- [ ] Começa o download?
- [ ] Arquivo baixado tem nome correto? (ex: BN-537-CONJUNTO.jpg)
- [ ] Arquivo é uma imagem real (não vazio)?
- [ ] Qualidade da imagem está boa?

**Em Mobile**:
- [ ] Botão funciona?
- [ ] Salva na galeria?
- [ ] Abre a imagem corretamente?

### ✅ ETAPA 7: LINK DO CATÁLOGO
**Ação**: Clicar em "🔗 Acessar Meu Catálogo"

**Checklist**:
- [ ] Link existe na página?
- [ ] Link é clicável?
- [ ] Abre catálogo da revendedora (`/catalogo-revendedora/[id]`)?
- [ ] Catálogo mostra TODOS os produtos?
- [ ] Catálogo mostra preço de revenda?
- [ ] Revendedora pode fazer novo pedido?

### ✅ ETAPA 8: COPIAR LINK DO CATÁLOGO
**Ação**: Clicar "📋 Copiar" para copiar link

**Checklist**:
- [ ] Botão está na página?
- [ ] Clica para copiar?
- [ ] Mostra "✅ Copiado!" depois?
- [ ] Link é copiado para clipboard?
- [ ] Link está correto (contém `/catalogo-revendedora/`)?

---

## 🔧 TESTES ESPECÍFICOS POR DISPOSITIVO

### 📱 MOBILE
- [ ] Página carrega rápido?
- [ ] Layout se adapta (sem scroll horizontal)?
- [ ] Botões são clicáveis (tamanho adequado)?
- [ ] Imagens têm tamanho correto?
- [ ] Links abrem corretamente?
- [ ] Download de imagem funciona?

### 🖥️ DESKTOP
- [ ] Página abre corretamente?
- [ ] Grid de 3 colunas aparece?
- [ ] Hover effects funcionam?
- [ ] Download funciona?
- [ ] Cópia de link funciona?

---

## 🐛 BUGS POSSÍVEIS

### Problema 1: "Artes não encontradas"
**Sintoma**: Ao acessar link, vê "Artes não encontradas"  
**Causas possíveis**:
- Pedido não existe no banco
- OrderId está errado no link
- API `/api/orders?id=...` não retorna dados

**Como testar**:
1. Verificar se OrderId no URL existe
2. Verificar console do browser (F12)
3. Ver se há erro de rede

---

### Problema 2: Fotos são "Placeholder"
**Sintoma**: Todas as artes mostram imagem cinza/padrão  
**Causas possíveis**:
- Produtos não têm imagens em `products.json`
- Arquivo de imagem não existe
- Caminho da imagem está errado

**Como testar**:
1. Abrir DevTools (F12)
2. Aba Network
3. Ver se imagens retornam 404

---

### Problema 3: Legendas Não Aparecem
**Sintoma**: Campo de legenda está vazio  
**Causas possíveis**:
- `artesLegendasMap` não tem dados para REF
- Referência está errada
- Arquivo `artes-legendas.ts` vazio

**Como testar**:
1. Console: `console.log(artesLegendasMap)`
2. Ver se tem chave com a REF do produto

---

### Problema 4: Download Não Funciona
**Sintoma**: Clicar "💾 Salvar" não faz nada  
**Causas possíveis**:
- Função `downloadImage()` está quebrada
- Imagem não tem permissão CORS
- Arquivo é muito grande

**Como testar**:
1. Abrir DevTools Console (F12)
2. Ver se há error ao clicar
3. Verificar Network se requisição vai

---

### Problema 5: Link do Catálogo Quebrado
**Sintoma**: Link abre mas catálogo não funciona  
**Causas possíveis**:
- PartnerID está errado
- `/catalogo-revendedora/[id]` não existe
- Dados da revendedora estão errados

**Como testar**:
1. Clicar no link
2. Ver se página `/catalogo-revendedora/` carrega
3. Se não carregar, verificar PartnerID

---

## ✅ TESTES EXTRAS

### Performance
- [ ] Página carrega em menos de 2 segundos?
- [ ] Imagens carregam rápido?
- [ ] Scroll é suave?
- [ ] Sem lag ao clicar botões?

### UX/Design
- [ ] Cores estão bonitas?
- [ ] Textos são legíveis?
- [ ] Botões têm hover effect?
- [ ] Mensagens são claras?

### Funcionalidade Completa
- [ ] Fluxo inteiro funciona (pedido → artes → download)?
- [ ] Revendedora consegue usar tudo?
- [ ] Sem erros no console?
- [ ] Sem warnings?

---

## 📝 COMO TESTAR

### Passo 1: Ir para `/admin/artes`
```
https://belezanativaloja.com.br/admin/artes
```

### Passo 2: Ver se tem pedidos para enviar artes
- Se sim: Continue
- Se não: Crie um pedido teste primeiro

### Passo 3: Clicar em "🎨 Enviar Artes via WhatsApp"
- DevTools aberto (F12)
- Ver console para erros

### Passo 4: Clicar no link de artes recebido
- Testar cada checklist acima

### Passo 5: Tentar baixar uma imagem
- Ver se baixa corretamente
- Ver se arquivo está OK

### Passo 6: Copiar e compartilhar link catálogo
- Testar se funciona

---

## 🎯 RESULTADO ESPERADO

✅ **TUDO OK quando**:
- Página `/artes-pedido/[orderId]` carrega
- Mostra fotos dos produtos
- Botão de download funciona
- Link do catálogo funciona
- Tudo é responsivo (mobile/desktop)
- Sem erros no console

❌ **PROBLEMA quando**:
- Página dá erro 404
- Fotos são placeholder
- Download não funciona
- Links quebrados
- Erros no console

---

## 📊 CHECKLIST DE VALIDAÇÃO

Marque conforme testar:

```
TESTES GERAIS
[ ] Página carrega
[ ] Sem erro 404
[ ] Sem erros console

FOTOS
[ ] Aparecem
[ ] Não são placeholder
[ ] Download funciona

LINKS
[ ] Link artes funciona
[ ] Link catálogo funciona
[ ] Copiar link funciona

MOBILE
[ ] Funciona em celular
[ ] Layout adapta
[ ] Botões clicáveis

LEGENDAS
[ ] Aparecem se existem
[ ] Texto está correto

WHATSAPP
[ ] Mensagem envia
[ ] Links na mensagem
[ ] Formatação OK
```

---

## 🚨 PRÓXIMOS PASSOS

Depois dos testes:

1. **Se TUDO OK** ✅
   - Funcionalidade está COMPLETA
   - Sem correções necessárias
   - Documentar sucesso

2. **Se tiver BUGS** ❌
   - Documentar cada bug
   - Qual checklist falhou?
   - Qual erro aparece?
   - Fazer PR com correções

3. **Se tiver MELHORIAS** 💡
   - Sugerir otimizações
   - Adicionar mais legendas
   - Melhorar UI

---

**Quando começar os testes?** 👇

Faça os testes acima e reporte o resultado!

---

**Status de Testes**: 
- [ ] Não iniciado
- [ ] Em progresso
- [ ] Concluído

**Encontrados bugs?**: 
- [ ] Não
- [ ] Sim (listar abaixo)

```
Bugs encontrados:
1. ...
2. ...
```

---

**Criado em**: 2026-10-05  
**Por**: Claude Code AI  
**Para**: Testar funcionalidade completa de artes
