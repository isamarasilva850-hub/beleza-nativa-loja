# 🚀 QUICK START - CRM MÉTODO BELEZA NATIVA

## ⚡ 5 MINUTOS PARA COMEÇAR

### 1️⃣ SUBSTITUA O CRM NO ADMIN

**Arquivo:** `src/app/admin/crm/page.tsx`

**Encontre:**
```tsx
export default function CRM() {
  // ... código antigo ...
}
```

**Substitua por:**
```tsx
import CRMMetodoBN from "@/components/CRMMetodoBN";

export default function CRM() {
  return <CRMMetodoBN />;
}
```

### 2️⃣ ACESSE EM PRODUÇÃO

```
belezanativaloja.com.br/admin/crm
```

### 3️⃣ COMECE A USAR!

---

## 📱 COMO FUNCIONA

### **COLUNA 1: SEUS LEADS**
- Clique em ➕ NOVO LEAD
- Adicione nome e WhatsApp
- Pronto! Lead criado no D0 (hoje)

### **COLUNA 2: VISUAL DO FUNIL**
- Vê as 8 etapas do método
- A etapa atual fica DESTACADA
- Clique em qualquer etapa para avançar
- Etapas concluídas ficam VERDES

### **COLUNA 3: AÇÕES**
- 💡 Pergunta automática para FAZER (baseado no Método)
- 📝 Anote o que ela respondeu
- 📅 Defina próximo contato
- ✅ Clique "Avançar" quando pronto

---

## 🎯 FLUXO COMPLETO (EXEMPLO)

```
1. Clique em "Novo Lead"
   └─ Digite: "Maria Silva" + "11999999999"

2. Aparece pergunta sugerida:
   └─ "Oi, Maria! 😊 Aqui é a Isa, consultora da Beleza Nativa..."

3. Maria responde no WhatsApp (você nota aqui)
   └─ Escreva a resposta no campo "Anotações"

4. Clique "Avançar" para etapa: 🤝 CONECTAR
   └─ Nova pergunta aparece automaticamente

5. Anote resposta, defina próximo contato
   └─ Clique "Avançar" novamente

... (repete até vender ou encerrar)

8. Chegou em 🎉 CONVERTIDO?
   └─ Parabéns! Venda realizada!
```

---

## 💡 DICAS PRO

### ✅ Use a PERGUNTA SUGERIDA
Não precisa pensar! Cada etapa tem a pergunta exata do Método BN pronta.

### ✅ ANOTE TUDO
Se ela respondeu algo importante, escreve no campo "Anotações" para não esquecer.

### ✅ PRÓXIMO CONTATO
- D1: Próximo dia (follow-up 1)
- D3: 2 dias depois (follow-up 2)
- D7: 4 dias depois (follow-up 3)

### ✅ ESTEJA PRONTO PARA D7
Se não responder até D7 → Status muda para "SEM RESPOSTA"

### 🚀 VOCÊ PODE VOLTAR?
Clique "⬅️ Voltar" se precisa refazer alguma coisa.

---

## 🎨 CORES E SIGNIFICADOS

| Cor | Significado | Ação |
|-----|-------------|------|
| 🔵 Azul | Etapa: ABRIR | Aguardando resposta (D1) |
| 🩵 Ciano | Etapa: CONECTAR | Conhecendo o negócio |
| 💜 Roxo | Etapa: DIAGNOSTICAR | Entendendo necessidades |
| 💗 Rosa | Etapa: DIVULGAÇÃO | Como ela posta? |
| 🧡 Laranja | Etapa: PERSONALIZAR | Mostrando solução BN |
| 💚 Verde | Etapa: APRESENTAR | Mostrando produtos |
| ❤️ Vermelho | Etapa: NEGOCIAR | Fechando venda |
| 💚 Esmeralda | Etapa: CONVERTIDO | VENDIDA! 🎉 |

---

## ❓ FAQ

### **P: Perdi um lead de vista. Como acho?**
R: Role na coluna esquerda. Todos os leads aparecem lá listados.

### **P: Posso deletar um lead?**
R: Não tem botão de deletar. Use a anotação "CANCELADO" se precisar encerrar.

### **P: E se ela disse "não"?**
R: Volte para ABRIR → Mude status → Anote motivo nas anotações.

### **P: A Bela pode me ajudar aqui?**
R: SIM! Na Bela, digite "Em qual etapa estou?" ou "Que pergunta faço?" e ela indica!

### **P: Funciona no celular?**
R: Sim! Interface é responsiva. Mas é melhor em desktop.

---

## 🔄 INTEGRAÇÃO COM BELA

Quando você tiver dúvida, abra a BELA (ícone no canto inferior esquerdo):

**Digite:**
```
"Estou na etapa DIAGNOSTICAR, ela não respondeu. O que faço?"
```

**Bela responde:**
```
Você está na etapa 3 do Método BN. 
Próximos passos: 
1️⃣ Envie follow-up após 1 dia
2️⃣ Se não responder, follow-up D3
3️⃣ Se continuar silencioso, D7 = encerre como "sem resposta"

Quer saber qual pergunta fazer no D1?
```

---

## 🌸 O MÉTODO EM 8 ETAPAS

```
🔍 ABRIR
├─ Objetivo: Conseguir atenção
├─ Pergunta: "Posso te fazer uma pergunta?"
└─ Próximo: D1 = conectar

🤝 CONECTAR
├─ Objetivo: Conhecer o negócio
├─ Pergunta: "Você vende pelo Instagram ou WhatsApp?"
└─ Próximo: D0 = diagnosticar

📊 DIAGNOSTICAR
├─ Objetivo: Entender as clientes dela
├─ Pergunta: "O que procuram: básicos, conjuntos ou diferenciados?"
└─ Próximo: D0 = divulgação

📱 DIVULGAÇÃO
├─ Objetivo: Como ela faz postagens
├─ Pergunta: "Você cria as artes ou tem dificuldade?"
└─ Próximo: D0 = personalizar

✨ PERSONALIZAR
├─ Objetivo: Conectar à solução BN
├─ Pergunta: "Faz diferença receber arte + legenda prontas?"
└─ Próximo: D0 = apresentar

🎁 APRESENTAR
├─ Objetivo: Mostrar produtos certos
├─ Pergunta: "Quais desses você vê vendendo melhor?"
└─ Próximo: D0 = negociar

💰 NEGOCIAR
├─ Objetivo: Transformar interesse em pedido
├─ Pergunta: "Começa com poucos modelos ou um mix completo?"
└─ Próximo: D0 = convertido

🎉 CONVERTIDO
├─ Objetivo: Venda realizada!
├─ Pergunta: "Quando chegar, quero saber o que achou!"
└─ Próximo: Pós-venda + recompra
```

---

## 📊 MÉTRICAS PARA ACOMPANHAR

Abra o CRM e veja:

| Métrica | O que significa |
|---------|-----------------|
| Leads em ABRIR | Ainda tentando respostas (D0-D7) |
| Leads em CONECTAR | Conhecendo bem o negócio |
| Leads em DIAGNOSTICAR | Entendendo as necessidades |
| Leads em DIVULGAÇÃO | Identificou pain point (conteúdo) |
| Leads em PERSONALIZAR | Apresentou solução BN |
| Leads em APRESENTAR | Mostrando produtos |
| Leads em NEGOCIAR | Muito perto de vender! |
| Leads em CONVERTIDO | Vendas realizadas 🎉 |

**Seu objetivo:** Mover leads de ABRIR → CONVERTIDO

---

## 🎯 PRÓXIMAS SEMANAS

- **Semana 1:** Familiarize com as 8 etapas
- **Semana 2:** Comece a anotar tudo que ela responde
- **Semana 3:** Defina datas de follow-up precisas
- **Semana 4:** Comece a fechar primeiras vendas!

---

## 🆘 PRECISA DE AJUDA?

**Abra a BELA e digite:**
```
"Como usar o CRM?"
```

Ou pergunte específico:
```
"Como mudo uma lead de etapa?"
"O que fazer no follow-up D3?"
"Qual pergunta faço agora?"
```

---

**🌸 Pronto para começar? 🚀**

1. Acesse: belezanativaloja.com.br/admin/crm
2. Clique: ➕ NOVO LEAD
3. Adicione: Nome + WhatsApp
4. Comece: Primeira pergunta já aparece! 😊

**Boa sorte! 💚**
