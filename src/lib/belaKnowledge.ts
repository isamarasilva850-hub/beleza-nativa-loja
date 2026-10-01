export const belaKnowledge = {
  modules: {
    uploadProdutos: {
      title: "Upload de Produtos",
      icon: "📦",
      description: "Adicionar novos produtos com cores, tamanhos e fotos",
      steps: [
        {
          number: 1,
          title: "Acesse a página",
          description: "ADMIN → Gerência de Produtos → Upload de Produtos"
        },
        {
          number: 2,
          title: "Preencha dados básicos",
          description: "Referência (REF001), Nome do produto, Preço de atacado"
        },
        {
          number: 3,
          title: "Adicione cores",
          description: "Clique em '+ Adicionar Cor' para cada cor que você tem"
        },
        {
          number: 4,
          title: "Defina quantidades",
          description: "Para CADA cor, coloque quantidade de cada tamanho: P, M, G, GG"
        },
        {
          number: 5,
          title: "Adicione fotos",
          description: "Clique ou arraste as fotos do produto. Pode adicionar várias"
        },
        {
          number: 6,
          title: "Salve o produto",
          description: "Clique em '✅ SALVAR PRODUTO' e pronto! Aparece na loja em 5 segundos"
        }
      ],
      tips: [
        "As fotos aparecem automaticamente na loja",
        "Se a quantidade for 0, aquele tamanho não aparece como opção",
        "Você pode adicionar vários produtos de uma vez",
        "Os dados sincronizam com Supabase (banco de dados)"
      ]
    },

    montarPedido: {
      title: "Montar Pedido",
      icon: "🛒",
      description: "Criar pedidos rápidos para enviar para clientes",
      steps: [
        {
          number: 1,
          title: "Acesse a página",
          description: "ADMIN → Montar Pedido"
        },
        {
          number: 2,
          title: "Busque o produto",
          description: "Digite o nome do produto ou a REF (ex: REF001)"
        },
        {
          number: 3,
          title: "Escolha a cor",
          description: "Clique na cor desejada (só aparecem cores em estoque)"
        },
        {
          number: 4,
          title: "Escolha o tamanho",
          description: "Selecione P, M, G ou GG (depende da cor)"
        },
        {
          number: 5,
          title: "Defina quantidade",
          description: "Use os botões + e - ou digite direto"
        },
        {
          number: 6,
          title: "Adicione ao pedido",
          description: "Clique em '✅ Adicionar ao Pedido'"
        },
        {
          number: 7,
          title: "Gere o resumo",
          description: "Clique em '📋 Copiar Resumo' e envie pro cliente via WhatsApp"
        }
      ],
      tips: [
        "O resumo já vem formatado e pronto pra copiar",
        "Você pode adicionar vários itens antes de enviar",
        "O total é calculado automaticamente",
        "Use o botão '🗑️ Limpar Pedido' para começar novamente"
      ]
    },

    gerenciarCores: {
      title: "Gerenciar Cores",
      icon: "🎨",
      description: "Editar nomes das cores dos produtos",
      steps: [
        {
          number: 1,
          title: "Acesse a página",
          description: "ADMIN → Gerência de Produtos → Gerenciar Cores"
        },
        {
          number: 2,
          title: "Selecione o produto",
          description: "Escolha qual produto deseja editar as cores"
        },
        {
          number: 3,
          title: "Clique em editar",
          description: "Clique no botão ✏️ ao lado da cor"
        },
        {
          number: 4,
          title: "Altere o nome",
          description: "Mude o nome da cor (ex: Rosa → Rosa Claro)"
        },
        {
          number: 5,
          title: "Salve",
          description: "Clique em '💾 Salvar' e pronto!"
        }
      ],
      tips: [
        "Os nomes das cores aparecem na loja",
        "Seja descritivo: 'Rosa', 'Rosa Claro', 'Rosa Escuro'",
        "A alteração aparece na loja em segundos"
      ]
    },

    crmCompleto: {
      title: "CRM Completo",
      icon: "📊",
      description: "Gerenciar clientes, leads, ações e propostas",
      sections: {
        clientes: {
          title: "Carteira de Clientes",
          description: "Veja todos os clientes que já compraram",
          actions: [
            "Ver histórico de compras",
            "Editar informações",
            "Acompanhar total gasto",
            "Ver data do último contato"
          ]
        },
        leads: {
          title: "Leads",
          description: "Novos contatos que ainda não compraram",
          actions: [
            "Cadastrar novo lead",
            "Definir status (Novo, Contato, Proposta, etc)",
            "Adicionar notas",
            "Agendar próximo contato"
          ]
        },
        acoes: {
          title: "Ações e Lembretes",
          description: "Tarefas diárias que você precisa fazer",
          actions: [
            "Ver ações de hoje (em vermelho)",
            "Ver ações em atraso",
            "Criar nova ação",
            "Copiar mensagem sugerida",
            "Marcar como feito"
          ]
        },
        propostas: {
          title: "Propostas",
          description: "Propostas de venda enviadas para clientes",
          actions: [
            "Criar nova proposta",
            "Enviar para cliente",
            "Acompanhar status",
            "Ver data de vencimento"
          ]
        }
      }
    },

    dashboard: {
      title: "Dashboard",
      icon: "📈",
      description: "Resumo geral do seu negócio",
      metrics: [
        {
          name: "Total de Clientes",
          meaning: "Quantos clientes já compraram de você"
        },
        {
          name: "Total de Leads",
          meaning: "Quantos novos contatos você tem pra acompanhar"
        },
        {
          name: "Carteira de Clientes",
          meaning: "Lista de quem já comprou pra você vender mais"
        },
        {
          name: "Ações Pendentes",
          meaning: "Quantas tarefas você precisa fazer hoje"
        }
      ]
    }
  },

  quickAnswers: {
    "como subir produto": "uploadProdutos",
    "como subo um produto": "uploadProdutos",
    "upload de produto": "uploadProdutos",
    "montar pedido": "montarPedido",
    "criar pedido": "montarPedido",
    "gerenciar cores": "gerenciarCores",
    "editar cor": "gerenciarCores",
    "crm": "crmCompleto",
    "clientes": "crmCompleto",
    "leads": "crmCompleto",
    "ações": "crmCompleto",
    "acoes": "crmCompleto",
    "mensagem": "acoes",
    "propostas": "crmCompleto"
  }
};

export function getModuleGuide(query: string): string {
  const lowerQuery = query.toLowerCase();

  for (const [keyword, moduleKey] of Object.entries(belaKnowledge.quickAnswers)) {
    if (lowerQuery.includes(keyword)) {
      const module = belaKnowledge.modules[moduleKey as keyof typeof belaKnowledge.modules];
      if (module && 'steps' in module) {
        return formatModuleGuide(module as any);
      }
    }
  }

  return "";
}

function formatModuleGuide(module: any): string {
  let guide = `📚 **${module.title}**\n\n`;
  guide += `${module.description}\n\n`;

  if (module.steps) {
    guide += `**Passos:**\n`;
    for (const step of module.steps) {
      guide += `${step.number}️⃣ **${step.title}**\n${step.description}\n\n`;
    }
  }

  if (module.tips) {
    guide += `**💡 Dicas úteis:**\n`;
    for (const tip of module.tips) {
      guide += `• ${tip}\n`;
    }
  }

  return guide;
}
