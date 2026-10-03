# 🚀 CRM UPGRADE - MÉTODO BELEZA NATIVA
## Integração completa do método consultivo no CRM existente

**Status:** 🔴 PRE-IMPLEMENTAÇÃO  
**Data de início recomendado:** Imediato  
**Complexidade:** Média (expansão de schema + APIs)  

---

## 📊 MUDANÇAS NO SCHEMA DO SUPABASE

### Tabela: `leads` (EXPANDIDA)

**Campos NOVOS a adicionar:**

```sql
-- Método Beleza Nativa - ETAPA ATUAL
ALTER TABLE leads ADD COLUMN metodo_etapa VARCHAR(50) 
DEFAULT 'abrir'
COMMENT '7 etapas: abrir, conectar, diagnosticar, divulgacao, personalizar, apresentar, fidelizar';

-- PASSO 2 - CONECTAR
ALTER TABLE leads ADD COLUMN negocio_canal VARCHAR(100) 
COMMENT 'Ex: instagram, whatsapp, loja fisica';

ALTER TABLE leads ADD COLUMN negocio_loja_fisica BOOLEAN DEFAULT false;

ALTER TABLE leads ADD COLUMN negocio_tempo_atuacao VARCHAR(50) 
COMMENT 'Ex: iniciante (<6m), crescimento (6-12m), consolidada (>12m)';

ALTER TABLE leads ADD COLUMN negocio_outros_produtos VARCHAR(255);

ALTER TABLE leads ADD COLUMN negocio_fornecedores_atuais VARCHAR(255);

-- PASSO 3 - DIAGNOSTICAR
ALTER TABLE leads ADD COLUMN clientes_perfil VARCHAR(255);

ALTER TABLE leads ADD COLUMN clientes_preferencia VARCHAR(100) 
COMMENT 'basicos, conjuntos, diferenciados, mix';

ALTER TABLE leads ADD COLUMN clientes_faixa_preco VARCHAR(100);

ALTER TABLE leads ADD COLUMN clientes_maior_dificuldade VARCHAR(255);

-- PASSO 4 - DIVULGAÇÃO
ALTER TABLE leads ADD COLUMN divulgacao_cria_artes BOOLEAN;

ALTER TABLE leads ADD COLUMN divulgacao_facilidade VARCHAR(50) 
COMMENT 'facilidade, dificuldade, nao_posta';

ALTER TABLE leads ADD COLUMN divulgacao_frequencia VARCHAR(50) 
COMMENT 'diario, alguns_dias, poucas_vezes, raro';

ALTER TABLE leads ADD COLUMN divulgacao_dificuldades VARCHAR(255);

-- PASSO 5 - NECESSIDADES
ALTER TABLE leads ADD COLUMN necessidade_principal VARCHAR(255) 
COMMENT 'Resposta: "Se melhorasse uma coisa..."';

ALTER TABLE leads ADD COLUMN necessidade_tipos VARCHAR(255) 
COMMENT 'Múltiplos: mais_clientes, facilidade_divulgar, preco, qualidade, variedade';

ALTER TABLE leads ADD COLUMN necessidade_valoriza VARCHAR(255) 
COMMENT 'qualidade, preco, variedade, facilidade_vender, atendimento';

-- PASSO 6 - APRESENTAÇÃO
ALTER TABLE leads ADD COLUMN produto_modelos_mostrados VARCHAR(255);

ALTER TABLE leads ADD COLUMN produto_modelos_interesse VARCHAR(255);

ALTER TABLE leads ADD COLUMN produto_quantidade_estimada VARCHAR(50) 
COMMENT 'pequeno, medio, grande';

-- OBJEÇÃO
ALTER TABLE leads ADD COLUMN objecao_tipo VARCHAR(100) 
COMMENT 'esta_caro, ja_tem_fornecedor, vou_pensar, so_olhando, me_chama_mes_que_vem';

ALTER TABLE leads ADD COLUMN objecao_motivo_real VARCHAR(255);

-- FOLLOW-UP CADÊNCIA
ALTER TABLE leads ADD COLUMN followup_d0_data DATE;
ALTER TABLE leads ADD COLUMN followup_d1_data DATE;
ALTER TABLE leads ADD COLUMN followup_d3_data DATE;
ALTER TABLE leads ADD COLUMN followup_d7_data DATE;
ALTER TABLE leads ADD COLUMN followup_proxima_acao VARCHAR(255);
ALTER TABLE leads ADD COLUMN followup_proxima_data DATE;

-- PÓS-VENDA
ALTER TABLE leads ADD COLUMN posvenda_feedback VARCHAR(255);

ALTER TABLE leads ADD COLUMN recompra_interesse BOOLEAN;

ALTER TABLE leads ADD COLUMN indicacao_sim BOOLEAN;

ALTER TABLE leads ADD COLUMN indicacao_nome VARCHAR(255);
```

---

## 🔧 STATUS DO LEAD - NOVO ESQUEMA

**Antigo (6 status):**
```
novo → contato → proposta → negociacao → convertido → perdido
```

**Novo (15 status - compatível com método):**
```
novo
├─ abrir (contato iniciado, aguardando resposta D1)
├─ conectar (conhecendo negócio)
├─ diagnosticar (entendendo necessidades)
├─ divulgacao (descobrindo como posta)
├─ personalizar (conectando à solução BN)
├─ apresentar (mostrando produtos)
├─ negociacao (escolhendo/finalizando)
├─ pedido_confirmado (comprou!)
├─ posvenda (entregue, acompanhando)
├─ recompra (momento de nova compra)
├─ indicacao (indicou alguém)
├─ nutrição (não agora, mas potencial)
├─ sem_resposta (D7 vencido)
├─ sem_interesse (disse não)
└─ nao_recontatar (pediu para parar)
```

**Mapeamento para compatibilidade com STATUS antigo:**
```
abrir → "contato"
conectar → "contato"
diagnosticar → "proposta"
divulgacao → "proposta"
personalizar → "proposta"
apresentar → "negociacao"
negociacao → "negociacao"
pedido_confirmado → "convertido"
posvenda → "convertido"
recompra → "convertido"
indicacao → "convertido"
nutrição → "proposta"
sem_resposta → "perdido"
sem_interesse → "perdido"
nao_recontatar → "perdido"
```

---

## 📝 CAMPOS CONDICIONAIS

**Se `metodo_etapa == 'abrir'`:**
- Mostrar apenas: `origem`, `notas`, `followup_d1_data`

**Se `metodo_etapa == 'conectar'`:**
- Mostrar: `negocio_canal`, `negocio_loja_fisica`, `negocio_tempo_atuacao`, etc

**Se `metodo_etapa == 'diagnosticar'`:**
- Mostrar: `clientes_perfil`, `clientes_preferencia`, `necessidade_principal`

**E assim por diante...**

---

## 🔌 MUDANÇAS NAS APIs

### GET `/api/crm/leads`
```typescript
// Adicionar campos aos retornos
interface LeadCompleto extends Lead {
  // Método BN
  metodo_etapa: string;
  negocio_canal?: string;
  negocio_loja_fisica?: boolean;
  clientes_perfil?: string;
  necessidade_principal?: string;
  objecao_tipo?: string;
  followup_proxima_data?: string;
  // ... todos os novos campos
}
```

### POST `/api/crm/leads`
```typescript
// Aceitar novo payload
{
  nome: string;
  email: string;
  telefone: string;
  origem: string;
  metodo_etapa: 'abrir'; // Padrão
  notas?: string;
  vendedor?: string;
  // ... e todos os campos opcionais
}
```

### PATCH `/api/crm/leads/[id]`
```typescript
// Permitir atualizações parciais de qualquer campo
{
  metodo_etapa?: string;
  necessidade_principal?: string;
  objecao_tipo?: string;
  followup_proxima_data?: string;
  // ... qualquer campo
}
```

---

## 🎯 FORMULÁRIO APRIMORADO DE LEAD

**Fluxo dinâmico baseado em `metodo_etapa`:**

### Tela 1: NOVO LEAD (etapa: abrir)
```
[Nome]        [WhatsApp]
[Email]       [Origem: dropdown]
[Notas iniciais]
[Próximo contato: D1 = hoje + 1 dia]
```

### Tela 2: APÓS RESPOSTA (etapa: conectar)
```
[Canal de venda: instagram/whatsapp/loja física]
[Tempo de atuação: iniciante/crescimento/consolidada]
[Outros produtos que vende?]
[Fornecedores atuais?]
```

### Tela 3: DIAGNÓSTICO (etapa: diagnosticar)
```
[Perfil das clientes dela]
[O que costumam procurar: básicos/conjuntos/diferenciados]
[Maior dificuldade?]
[⭐ Se melhorasse UMA coisa nas vendas, qual seria?]
```

### Tela 4: DIVULGAÇÃO (etapa: divulgacao)
```
[Cria artes: sim/não]
[Facilidade: sim/dificuldade/não posta]
[Frequência: diário/alguns dias/poucas vezes/raro]
[Dificuldades específicas?]
```

### Tela 5: PERSONALIZAÇÃO (etapa: personalizar)
```
[Diferenciais apresentados: arte+legenda, qualidade, variedade, preço]
[Resposta: interessada/neutra/negativa]
```

### Tela 6: APRESENTAÇÃO (etapa: apresentar)
```
[Modelos mostrados]
[Modelos de interesse dela]
[Quantidade estimada: pequeno/médio/grande]
```

### Tela 7: NEGOCIAÇÃO (etapa: negociacao)
```
[Tem objeção? tipo: está_caro/já_tem_fornecedor/vou_pensar/...]
[Se sim, qual é o motivo REAL?]
[Próxima ação definida]
[Próxima data: quando?]
```

### Tela 8+: PÓS-VENDA, RECOMPRA, INDICAÇÃO
```
Mostrar conforme o status...
```

---

## 📊 ATIVIDADES AUTOMÁTICAS

Quando `metodo_etapa` muda, criar automaticamente uma atividade:

```typescript
// Exemplo
if (novoStatus === 'conectar' && statusAnterior === 'abrir') {
  // Criar atividade
  const atividade: Atividade = {
    tipo: 'mensagem',
    clienteId: lead.id,
    clienteNome: lead.nome,
    descricao: 'Lead respondeu - Iniciado diagnóstico',
    data: new Date().toISOString(),
    usuario: lead.vendedor,
    resultado: 'Avançou para CONECTAR'
  };
  await criarAtividade(atividade);
}
```

---

## ⏰ AUTOMAÇÕES - FOLLOW-UP

**D1 (próximo dia):**
- Se ainda em 'abrir' e `followup_d1_data` venceu → Criar atividade "FOLLOW-UP D1 VENCIDO"

**D3:**
- Se ainda em 'abrir' e `followup_d3_data` venceu → Criar atividade "FOLLOW-UP D3 VENCIDO"

**D7:**
- Se ainda em 'abrir' e `followup_d7_data` venceu → Mudar status para 'sem_resposta' + criar atividade

---

## 📱 INTEGRAÇÃO BELA ASSISTANT

A Bela já tem o conhecimento do método. Agora:

1. Quando Palmira digitar "Como mudo de etapa no CRM?":
   ```
   Bela → Explica que cada etapa tem seus próprios campos
   Bela → Sugere próxima etapa baseado no status atual
   ```

2. Quando Palmira fizer follow-up e digitar "Que pergunta faço agora?":
   ```
   Bela → Verifica em qual etapa está
   Bela → Retorna exatamente qual pergunta fazer baseado no Método
   ```

---

## 🔄 ROTEIRO DE IMPLEMENTAÇÃO

### Fase 1: Schema (1-2 horas)
- [ ] Criar migration do Supabase com novos campos
- [ ] Testar criação das colunas

### Fase 2: APIs (2-3 horas)
- [ ] Atualizar `/api/crm/leads` para aceitar novos campos
- [ ] Atualizar `/api/crm/leads/[id]` para PATCH com novos campos
- [ ] Criar validações

### Fase 3: UI Frontend (3-4 horas)
- [ ] Criar formulário dinâmico baseado em `metodo_etapa`
- [ ] Adicionar seletor visual de etapa
- [ ] Implementar campos condicionais

### Fase 4: Automações (1-2 horas)
- [ ] Criar triggers para mudança de etapa
- [ ] Implementar criação automática de atividades
- [ ] Configurar alertas de follow-up vencido

### Fase 5: Testes (1 hora)
- [ ] Testar fluxo completo D0 → D7
- [ ] Testar mudanças de status
- [ ] Testar compatibilidade com Bela

---

## 💾 SCRIPT SQL COMPLETO

```sql
-- Método Beleza Nativa - Expansão da tabela LEADS
-- Execute no Supabase SQL Editor

ALTER TABLE leads ADD COLUMN IF NOT EXISTS metodo_etapa VARCHAR(50) DEFAULT 'abrir';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS negocio_canal VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS negocio_loja_fisica BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS negocio_tempo_atuacao VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS negocio_outros_produtos VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS negocio_fornecedores_atuais VARCHAR(255);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS clientes_perfil VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS clientes_preferencia VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS clientes_faixa_preco VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS clientes_maior_dificuldade VARCHAR(255);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS divulgacao_cria_artes BOOLEAN;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS divulgacao_facilidade VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS divulgacao_frequencia VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS divulgacao_dificuldades VARCHAR(255);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS necessidade_principal VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS necessidade_tipos VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS necessidade_valoriza VARCHAR(255);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS produto_modelos_mostrados VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS produto_modelos_interesse VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS produto_quantidade_estimada VARCHAR(50);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS objecao_tipo VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS objecao_motivo_real VARCHAR(255);

ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_d0_data DATE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_d1_data DATE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_d3_data DATE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_d7_data DATE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_proxima_acao VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_proxima_data DATE;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS posvenda_feedback VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS recompra_interesse BOOLEAN;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS indicacao_sim BOOLEAN;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS indicacao_nome VARCHAR(255);

-- Index para melhorar performance
CREATE INDEX idx_leads_metodo_etapa ON leads(metodo_etapa);
CREATE INDEX idx_leads_followup_proxima_data ON leads(followup_proxima_data);
```

---

## ✅ CHECKLIST PRÉ-IMPLEMENTAÇÃO

- [ ] Backup do banco de dados (Supabase)
- [ ] Aprovar mudanças no schema
- [ ] Preparar migrations
- [ ] Comunicar com Palmira sobre as mudanças
- [ ] Definir data de rollout
- [ ] Treinar Palmira no novo fluxo

---

**🌸 CRM Upgrade - Método Beleza Nativa**  
**Versão:** 1.0  
**Pronto para implementação imediata**
