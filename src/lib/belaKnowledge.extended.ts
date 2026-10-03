/**
 * Base de Conhecimento Expandida para Bela Assistant
 * Guias completos para todas as funcionalidades do Admin
 * Especialmente focado em Palmira (Vendas & Produtos)
 */

export const belaKnowledgeExtended = {
  modules: {
    // ==================== PALMIRA PANEL ====================

    palmiraUpload: {
      title: "📦 Palmira: Upload de Novos Produtos",
      description: "Adicionar produtos com fotos, cores, tamanhos e estoque",
      url: "/admin/palmira/upload",
      steps: [
        {
          number: 1,
          title: "Acesse o painel",
          description: "Ir em ADMIN → Painel da Palmira → Upload de Produtos"
        },
        {
          number: 2,
          title: "Referência do produto",
          description: "Digite uma referência única (ex: BN001, VEST-001). Deve ser diferente para cada produto"
        },
        {
          number: 3,
          title: "Nome do produto",
          description: "Nome descritivo (ex: Biquíni Mãe Dourada Triângulo)"
        },
        {
          number: 4,
          title: "Preço de venda",
          description: "Preço que você vende (ex: 89.90). Use ponto para centavos"
        },
        {
          number: 5,
          title: "Escolha o gênero",
          description: "Feminino, Masculino ou Infantil (aparece no site assim)"
        },
        {
          number: 6,
          title: "Adicione cores",
          description: "Clique em '+ Adicionar Cor' para CADA cor que o produto tem"
        },
        {
          number: 7,
          title: "Preencha quantidades por tamanho",
          description: "Para CADA cor, coloque quanto você tem de P, M, G, GG (se tiver 0, não aparece como opção)"
        },
        {
          number: 8,
          title: "Arraste as fotos",
          description: "Arraste várias fotos do produto (PNG, JPG). Serão redimensionadas automaticamente para 800x800"
        },
        {
          number: 9,
          title: "Salve o produto",
          description: "Clique em '✅ SALVAR PRODUTO'. Aparece na loja em segundos"
        }
      ],
      tips: [
        "📷 Fotos de boa qualidade (mínimo 800x800) com fundo branco ou limpo",
        "🎨 Nomes de cores descritivos: 'Rosa', 'Rosa Claro', 'Rosa Escuro'",
        "📊 Se tiver 0 quantidade de um tamanho, ele não aparece como opção pro cliente",
        "🔄 Você pode adicionar vários produtos e depois sincronizar tudo de uma vez",
        "💾 Os dados ficam salvos localmente até você clicar '🚀 Sincronizar Agora'",
        "🚀 Após sincronizar, o produto aparece no site automaticamente"
      ]
    },

    palmiraEditarProdutos: {
      title: "✏️ Palmira: Editar Produtos Existentes",
      description: "Modificar nome, preço, fotos, cores e estoque de produtos já cadastrados",
      url: "/admin/palmira/produtos",
      steps: [
        {
          number: 1,
          title: "Acesse produtos",
          description: "ADMIN → Painel da Palmira → Produtos Cadastrados"
        },
        {
          number: 2,
          title: "Busque o produto",
          description: "Use a caixa de busca (por referência ou nome) para encontrar o produto"
        },
        {
          number: 3,
          title: "Clique no card do produto",
          description: "Clique em '✏️ Editar Fotos & Dados' no card do produto"
        },
        {
          number: 4,
          title: "Modal de edição abre",
          description: "Você pode editar: nome, preço, cores, tamanhos, fotos"
        },
        {
          number: 5,
          title: "Reordene fotos",
          description: "Arraste as fotos para mudar a ordem. A primeira aparece como destaque no site"
        },
        {
          number: 6,
          title: "Remova fotos antigas",
          description: "Clique no 'X' vermelho para remover uma foto específica"
        },
        {
          number: 7,
          title: "Adicione novas fotos",
          description: "Clique em 'Adicionar novas fotos' para incluir mais fotos SEM deletar as antigas"
        },
        {
          number: 8,
          title: "Edite dados",
          description: "Altere nome, preço, cores, quantidades conforme necessário"
        },
        {
          number: 9,
          title: "Salve as mudanças",
          description: "Clique em '💾 Salvar Alterações'. Mudanças aparecem no site em segundos"
        }
      ],
      tips: [
        "🖼️ A PRIMEIRA foto é o destaque do produto no site",
        "📸 Reordene fotos arrastando - a primeira é a mais importante",
        "❌ Remover fotos: clique no X vermelho (não afeta outras fotos)",
        "➕ Adicionar fotos: nunca deleta as antigas, só adiciona",
        "💰 Pode mudar preço sem afetar estoque",
        "🎨 Pode adicionar novas cores sem deletar as antigas",
        "🔄 Após sincronizar, as mudanças ficam no site automaticamente"
      ]
    },

    palmiraAdicionarCor: {
      title: "🎨 Palmira: Adicionar Cores a Produto Existente",
      description: "Incluir nova cor em um produto sem afetar cores existentes",
      url: "/admin/palmira/adicionar-cor",
      steps: [
        {
          number: 1,
          title: "Acesse adicionar cor",
          description: "ADMIN → Painel da Palmira → Adicionar Cor"
        },
        {
          number: 2,
          title: "Busque o produto",
          description: "Digite a referência ou nome do produto onde quer adicionar a cor"
        },
        {
          number: 3,
          title: "Escolha a cor",
          description: "Selecione a cor ou digite um nome novo (ex: Rosa Claro, Azul Marinho)"
        },
        {
          number: 4,
          title: "Defina estoque por tamanho",
          description: "Quantas peças você tem daquela cor em P, M, G, GG"
        },
        {
          number: 5,
          title: "Salve",
          description: "Clique em '✅ Adicionar Cor' e pronto!"
        }
      ],
      tips: [
        "🎨 Use nomes de cores claros para o cliente entender",
        "🔄 A nova cor aparece no site automaticamente",
        "📊 Se tiver 0 estoque, aquele tamanho não aparece como opção"
      ]
    },

    palmiraCorrigirPrecos: {
      title: "💰 Palmira: Corrigir Preços em Lote",
      description: "Mudar preço de vários produtos de uma vez",
      url: "/admin/palmira/corrigir-precos",
      steps: [
        {
          number: 1,
          title: "Acesse a página",
          description: "ADMIN → Painel da Palmira → Corrigir Preços"
        },
        {
          number: 2,
          title: "Selecione produtos",
          description: "Escolha quais produtos quer mudar de preço (pode marcar vários)"
        },
        {
          number: 3,
          title: "Digite novo preço",
          description: "Coloque o novo preço que quer aplicar"
        },
        {
          number: 4,
          title: "Aplique",
          description: "Clique em '✅ Aplicar Novo Preço' e pronto!"
        }
      ],
      tips: [
        "⚡ Rápido para atualizar preços de vários produtos",
        "💾 Usa percentual ou valor fixo (escolha qual)",
        "🔄 Mudanças aparecem no site em tempo real"
      ]
    },

    palmiraEstoque: {
      title: "📦 Palmira: Controle de Estoque",
      description: "Ver quanto tem de cada produto, cor e tamanho",
      url: "/admin/palmira/estoque",
      steps: [
        {
          number: 1,
          title: "Acesse estoque",
          description: "ADMIN → Painel da Palmira → Controle de Estoque"
        },
        {
          number: 2,
          title: "Veja produtos com baixo estoque",
          description: "Produtos em vermelho têm menos de 5 unidades - atenção!"
        },
        {
          number: 3,
          title: "Filtre por produto",
          description: "Use a busca para encontrar um produto específico"
        },
        {
          number: 4,
          title: "Edite quantidades",
          description: "Clique no campo de quantidade para editar direto"
        }
      ],
      tips: [
        "🔴 Vermelho = estoque baixo (< 5 unidades)",
        "🟡 Amarelo = estoque moderado",
        "🟢 Verde = estoque ok",
        "📊 Mostra por produto → cor → tamanho",
        "⚠️ Se ficar 0, aquele tamanho some do site"
      ]
    },

    palmiraReordenar: {
      title: "🔄 Palmira: Reordenar Produtos na Loja",
      description: "Mudar a ordem que os produtos aparecem no site",
      url: "/admin/palmira/reordenar-produtos",
      steps: [
        {
          number: 1,
          title: "Acesse reordenar",
          description: "ADMIN → Painel da Palmira → Reordenar Produtos"
        },
        {
          number: 2,
          title: "Veja lista de produtos",
          description: "Todos os seus produtos aparecem em ordem"
        },
        {
          number: 3,
          title: "Arraste para reordenar",
          description: "Clique e arraste o produto para a posição que quer"
        },
        {
          number: 4,
          title: "Salve a ordem",
          description: "Clique em '💾 Salvar Ordem' e pronto!"
        }
      ],
      tips: [
        "📌 O primeiro produto é o destaque da loja",
        "🎯 Coloque seus melhores produtos no topo",
        "⭐ Produtos novos podem vir no começo"
      ]
    },

    palmiraVisualizarLoja: {
      title: "👁️ Palmira: Visualizar Loja em Tempo Real",
      description: "Ver como seus produtos aparecem para o cliente",
      url: "/admin/palmira/visualizar-loja",
      steps: [
        {
          number: 1,
          title: "Acesse visualizar",
          description: "ADMIN → Painel da Palmira → Visualizar Loja"
        },
        {
          number: 2,
          title: "Veja seus produtos",
          description: "Você vê exatamente como o cliente vê na loja"
        },
        {
          number: 3,
          title: "Teste um produto",
          description: "Clique em um produto para ver cores, tamanhos, preço"
        },
        {
          number: 4,
          title: "Volte e faça ajustes",
          description: "Se tiver algo errado, volta e edita o produto"
        }
      ],
      tips: [
        "🔍 Use para verificar se tudo está correto",
        "📸 Veja como as fotos aparecem",
        "🎨 Confira nomes de cores",
        "💰 Veja preços formatados",
        "⚠️ Se algo não está certo, volta e edita o produto"
      ]
    },

    // ==================== SINCRONIZAÇÃO ====================

    palmiraSincronizar: {
      title: "🚀 Palmira: Sincronizar com Banco de Dados",
      description: "Enviar produtos para Supabase e GitHub (IMPORTANTE!)",
      url: "/admin/palmira",
      steps: [
        {
          number: 1,
          title: "Adicione/edite seus produtos",
          description: "Faça todos os uploads, edições e mudanças que precisa"
        },
        {
          number: 2,
          title: "Verifique tudo",
          description: "Use 'Visualizar Loja' para confirmar que está certo"
        },
        {
          number: 3,
          title: "Volte ao painel principal",
          description: "Volte para ADMIN → Painel da Palmira (página inicial)"
        },
        {
          number: 4,
          title: "Clique em sincronizar",
          description: "Clique no botão grande '🚀 Sincronizar Agora' (amarelo/roxo)"
        },
        {
          number: 5,
          title: "Aguarde",
          description: "Vai sincronizar com Supabase (banco de dados) e GitHub. Leva 2-3 segundos"
        },
        {
          number: 6,
          title: "Pronto!",
          description: "Seu site está atualizado! Produtos aparecem ao vivo em belezanativaloja.com.br"
        }
      ],
      tips: [
        "🔴 OBRIGATÓRIO: Sempre sincronizar antes de sair do admin",
        "⚙️ Sincroniza com Supabase (dados) + GitHub (site)",
        "⏱️ Leva 2-3 segundos para completar",
        "✅ Site atualiza automaticamente em tempo real",
        "🔐 Seus dados ficam salvos em 2 lugares (segurança extra)",
        "⚠️ Se sair SEM sincronizar, ninguém vê suas mudanças!"
      ]
    },

    // ==================== OUTROS MÓDULOS ====================

    montarPedido: {
      title: "🛒 Montar Pedido para Cliente",
      description: "Criar pedidos rápidos e enviar resumo por WhatsApp",
      url: "/admin/montar-pedido",
      steps: [
        {
          number: 1,
          title: "Acesse a página",
          description: "ADMIN → Minha Loja → Montar Pedido"
        },
        {
          number: 2,
          title: "Busque o produto",
          description: "Digite nome ou referência do produto"
        },
        {
          number: 3,
          title: "Escolha cor",
          description: "Clique na cor desejada (só aparecem cores com estoque)"
        },
        {
          number: 4,
          title: "Escolha tamanho",
          description: "Selecione P, M, G ou GG (depende de quanto tem de estoque)"
        },
        {
          number: 5,
          title: "Defina quantidade",
          description: "Use + e - ou digite direto"
        },
        {
          number: 6,
          title: "Adicione ao pedido",
          description: "Clique '✅ Adicionar ao Pedido'"
        },
        {
          number: 7,
          title: "Adicione mais itens",
          description: "Repita os passos anteriores para outros produtos"
        },
        {
          number: 8,
          title: "Gere resumo",
          description: "Clique '📋 Copiar Resumo' (já formatado pra WhatsApp)"
        },
        {
          number: 9,
          title: "Envie para cliente",
          description: "Cola no WhatsApp e envia! Cliente vê nome, cor, tamanho, preço e total"
        }
      ],
      tips: [
        "📋 Resumo já vem formatado - é só copiar e colar",
        "➕ Pode adicionar vários itens antes de enviar",
        "💰 Total é calculado automaticamente",
        "🗑️ Use '🗑️ Limpar Pedido' para começar um novo",
        "⏱️ Rápido e evita erros de cálculo",
        "✅ Cliente recebe tudo organizado"
      ]
    },

    pedidos: {
      title: "📦 Ver Pedidos Recebidos",
      description: "Acompanhar pedidos que clientes fizeram pelo site",
      url: "/admin/pedidos",
      steps: [
        {
          number: 1,
          title: "Acesse pedidos",
          description: "ADMIN → Minha Loja → Painel de Pedidos"
        },
        {
          number: 2,
          title: "Veja lista de pedidos",
          description: "Todos os pedidos aparecem com status, data, cliente, total"
        },
        {
          number: 3,
          title: "Filtro por status",
          description: "Novo, Separando, Pronto, Enviado, Cancelado"
        },
        {
          number: 4,
          title: "Clique em um pedido",
          description: "Ver detalhes: itens, endereço de entrega, telefone"
        },
        {
          number: 5,
          title: "Atualize status",
          description: "Mude status do pedido conforme você avança na preparação"
        }
      ],
      tips: [
        "🔴 Novo = chegou agora, precisa separar",
        "🟠 Separando = você já está preparando",
        "🟢 Pronto = já separou, pronto pra enviar",
        "🔵 Enviado = saiu da sua mão",
        "⚫ Cancelado = cliente desistiu",
        "📞 Clique no telefone para ligar/WhatsApp direto"
      ]
    },

    vendas: {
      title: "📈 Vendas em Tempo Real",
      description: "Ver vendas acontecendo, gráficos, números do dia",
      url: "/admin/vendas",
      steps: [
        {
          number: 1,
          title: "Acesse vendas",
          description: "ADMIN → Minha Loja → Vendas em Tempo Real"
        },
        {
          number: 2,
          title: "Veja números do dia",
          description: "Quantas vendas, ticket médio, produto mais vendido"
        },
        {
          number: 3,
          title: "Acompanhe em tempo real",
          description: "Números atualizam a cada nova venda"
        }
      ],
      tips: [
        "📊 Atualiza em tempo real",
        "💰 Mostra faturamento do dia/semana/mês",
        "🏆 Produto mais vendido",
        "👥 Quantidade de clientes",
        "📈 Gráficos bonitinhos para apresentar"
      ]
    },

    gerenciarCores: {
      title: "🎨 Gerenciar Cores",
      description: "Editar nomes das cores dos seus produtos",
      url: "/admin/cores",
      steps: [
        {
          number: 1,
          title: "Acesse cores",
          description: "ADMIN → Gestão de Produtos → Gerenciar Cores"
        },
        {
          number: 2,
          title: "Selecione produto",
          description: "Escolha qual produto quer editar cores"
        },
        {
          number: 3,
          title: "Clique em editar",
          description: "Clique no ✏️ ao lado da cor"
        },
        {
          number: 4,
          title: "Mude o nome",
          description: "Altere para nome mais descritivo (Rosa → Rosa Claro)"
        },
        {
          number: 5,
          title: "Salve",
          description: "Clique em '💾 Salvar' e aparece na loja em segundos"
        }
      ],
      tips: [
        "🎨 Nomes que o cliente entenda",
        "📱 Aparece igual no site e no app",
        "⚡ Muda em tempo real"
      ]
    },

    estoque: {
      title: "📊 Controle de Estoque Geral",
      description: "Ver quanto tem de cada produto, cor e tamanho",
      url: "/admin/estoque",
      steps: [
        {
          number: 1,
          title: "Acesse estoque",
          description: "ADMIN → Gestão de Produtos → Controle de Estoque"
        },
        {
          number: 2,
          title: "Filtro por produto",
          description: "Busque um produto específico"
        },
        {
          number: 3,
          title: "Veja disponibilidade",
          description: "Mostra por cor e tamanho"
        },
        {
          number: 4,
          title: "Edite quantidades",
          description: "Clique no número para editar direto"
        }
      ],
      tips: [
        "🔴 Vermelho = estoque baixo",
        "🟡 Amarelo = moderado",
        "🟢 Verde = ok",
        "0️⃣ Se colocar 0, não aparece no site"
      ]
    },

    crm: {
      title: "📊 CRM - Gerenciar Clientes e Leads",
      description: "Banco de dados de clientes, leads, ações e propostas",
      url: "/admin/crm",
      steps: [
        {
          number: 1,
          title: "Acesse CRM",
          description: "ADMIN → Comercial → CRM Completo"
        },
        {
          number: 2,
          title: "Escolha seção",
          description: "Clientes, Leads, Ações ou Propostas"
        },
        {
          number: 3,
          title: "Clientes",
          description: "Veja quem já comprou, histórico, quanto gastou"
        },
        {
          number: 4,
          title: "Leads",
          description: "Novos contatos que ainda não compraram - acompanhe!"
        },
        {
          number: 5,
          title: "Ações",
          description: "Tarefas que você precisa fazer hoje (em vermelho = atrasado)"
        },
        {
          number: 6,
          title: "Propostas",
          description: "Propostas de venda que enviou - veja status"
        }
      ],
      tips: [
        "👥 Carteira de clientes = ouro, venda pra eles",
        "📌 Ações em vermelho = fazer hoje",
        "💬 Pode copiar mensagem sugerida pro cliente",
        "📊 Mostra valor total que cada cliente gastou"
      ]
    },

    cupons: {
      title: "🎟️ Cupons de Desconto",
      description: "Criar e gerenciar cupons promocionais",
      url: "/admin/cupons",
      steps: [
        {
          number: 1,
          title: "Acesse cupons",
          description: "ADMIN → Ferramentas → Cupons de Desconto"
        },
        {
          number: 2,
          title: "Crie novo cupom",
          description: "Clique em '+ Novo Cupom'"
        },
        {
          number: 3,
          title: "Defina código",
          description: "Código que cliente digita (ex: BEMAINDA2026)"
        },
        {
          number: 4,
          title: "Defina desconto",
          description: "Percentual (ex: 10%) ou valor fixo (ex: R$ 10)"
        },
        {
          number: 5,
          title: "Validade",
          description: "Até quando o cupom funciona"
        },
        {
          number: 6,
          title: "Salve",
          description: "Clique em '✅ Criar Cupom'"
        }
      ],
      tips: [
        "🎟️ Cliente usa código na finalização de compra",
        "📢 Anuncia em redes sociais/WhatsApp",
        "📊 Vê quantas vezes foi usado",
        "⏰ Pode colocar validade limitada"
      ]
    },

    tabelaPrecos: {
      title: "💰 Tabela de Preços para Revendedoras",
      description: "Defina preço que as revendedoras pagam (preço de atacado)",
      url: "/admin/tabela-precos",
      steps: [
        {
          number: 1,
          title: "Acesse tabela",
          description: "ADMIN → Ferramentas → Tabela de Preços"
        },
        {
          number: 2,
          title: "Veja produtos",
          description: "Lista de todos seus produtos"
        },
        {
          number: 3,
          title: "Veja preço de atacado",
          description: "Quanto você cobra das revendedoras"
        },
        {
          number: 4,
          title: "Edite se necessário",
          description: "Clique no preço para mudá-lo"
        }
      ],
      tips: [
        "💼 Revendedoras veem este preço",
        "💰 Geralmente 40-50% de desconto do varejo",
        "📱 Aparece no app de revendedora"
      ]
    },

    mensagensClientes: {
      title: "💬 Como Escrever Mensagens para Clientes",
      description: "Dicas de ouro para escrever mensagens que vendem no WhatsApp",
      steps: [
        {
          number: 1,
          title: "Personalize",
          description: "Use o nome do cliente: 'Oi Mari!' vende mais que 'Oi!'"
        },
        {
          number: 2,
          title: "Seja breve",
          description: "Máximo 3-4 linhas. Cliente com pressa ignora texto longo"
        },
        {
          number: 3,
          title: "Destaque o benefício",
          description: "Não fale do produto, fale do que ele FAZ: 'Fica linda em você' não 'É um biquíni'"
        },
        {
          number: 4,
          title: "Use emojis",
          description: "Deixa mais atrativo: '✨ Chegou novidade' vende mais que 'Chegou novidade'"
        },
        {
          number: 5,
          title: "Chame pra ação",
          description: "Diga exatamente o que quer: 'Clica aqui' / 'Envia um oi' / 'Vem ver'"
        },
        {
          number: 6,
          title: "Melhor hora",
          description: "Mande entre 9-12h ou 14-18h. Evite madrugada e horário de trabalho"
        }
      ],
      tips: [
        "💬 Teste 2-3 versões diferentes e veja qual vende mais",
        "⏱️ Resonda rápido - 5min de demora já perde cliente",
        "😊 Seja amigável, não robótica - é um relacionamento",
        "📸 Foto do produto JUNTO com mensagem vende 50% mais",
        "✅ Confirme recebimento: 'Recebeu meu oi?' traz 30% mais respostas",
        "🚫 Evite: buzz words ('lindo', 'perfeito'), MAIÚSCULAS, muitos emojis",
        "🎯 Segmente: mãe compra por conforto, adolescente por estilo",
        "💝 Ofereça valor: desconto progressivo, frete grátis, presente surpresa"
      ]
    },

    conducaoClientes: {
      title: "🎯 Condução de Clientes (Follow-up)",
      description: "Estratégia para manter cliente quente e converter em venda",
      steps: [
        {
          number: 1,
          title: "Cliente viu mas não comprou?",
          description: "Aguarde 2-3 horas. Se silêncio: mande 'Ficou com dúvida?' ou 'Quer tentar?'"
        },
        {
          number: 2,
          title: "Ofereça alternativa",
          description: "Se disse que tá caro: 'Temos em rosa também, é 10% mais barato' ou parcelado"
        },
        {
          number: 3,
          title: "Crie urgência",
          description: "Use FATOS: 'Só 2 peças em P dessa cor' ou 'Vai viajar e quer novo?'"
        },
        {
          number: 4,
          title: "Se sumiu por dias",
          description: "Mande algo útil (não venda!): dica de moda, cuida roupa, história do produto"
        },
        {
          number: 5,
          title: "Reative com desconto",
          description: "Se foi cliente 1x: 'Voltou novidade! Só pra você que já confia: 15% OFF'"
        },
        {
          number: 6,
          title: "Invista em relacionamento",
          description: "Parabéns data dela, pergunte se a peça chegou bem, compartilhe unboxing"
        }
      ],
      tips: [
        "🔥 1ª mensagem = aquecimento (sem vender), 2ª = oferta, 3ª = urgência",
        "💰 Ciclo de vendas é 3-7 mensagens, nunca é só 1",
        "👥 Cliente que nunca respondeu ≠ cliente que respondeu e sumiu",
        "📊 Clientes que respondem pedindo referência = ouro puro (3-5x mais valiosos)",
        "⏰ Melhor momento pra reconquistar: 3 dias após compra (enquanto está feliz)",
        "🎁 Ofereça referência: 'Traga amiga, vcs ganham 20% cada'",
        "❌ Não spam: máximo 2-3 mensagens se não responde, depois dá espaço",
        "✨ Estrela = cliente que virou revendedora (ela faz follow-up COM VOCÊ!)"
      ]
    },

    mensagensEstagios: {
      title: "📱 Mensagens por Estágio de Cliente",
      description: "Mensagem certa no momento certo do customer journey",
      steps: [
        {
          number: 1,
          title: "🔍 AWARENESS (Primeira vez que descobre)",
          description: "Não venda, seja ÚTIL: dica de moda, educação. Ex: 'Sabe qual cor combina com sua pele? Azul traz transparência, rosa aquece. Qual combina mais com você?'"
        },
        {
          number: 2,
          title: "💭 INTERESSE (Viu, curtiu, quer saber mais)",
          description: "Mostre VALOR + PROVA. Ex: 'Viu que elas se encaixam em 3 tipos de corpo? Quer saber qual é o seu?' ou tag com foto de cliente igual no seu tipo"
        },
        {
          number: 3,
          title: "⚖️ CONSIDERAÇÃO (Tá na dúvida entre 2-3 peças)",
          description: "COMPARAÇÃO + BENEFÍCIO. Ex: 'Essa cor dura mais (tingimento importado) e aquela é confortável. Qual você usa mais: na praia ou trabalho?'"
        },
        {
          number: 4,
          title: "✅ DECISÃO (Quer mas tá com medo)",
          description: "REMOVA OBJEÇÃO: preço, tamanho, entrega. Ex: 'Primeira compra? Entra no nosso grupo de amigas da Beleza - ganha 20% OFF + chat de dúvidas sempre aberto'"
        },
        {
          number: 5,
          title: "🎁 COMPRA (Pedido confirmado)",
          description: "CELEBRE + EXPECTATIVA. Ex: 'Compra confirmada! 🎉 Sua cor chegará em 3-5 dias. Quer dica de como cuidar pra durar 10x mais?'"
        },
        {
          number: 6,
          title: "🌟 RETENÇÃO (Já recebeu)",
          description: "PEÇA FEEDBACK + CRIE HÁBITO. Ex: 'Chegou bem? Envia foto com ela! Que cor combina com você? Aquelas outras cores que curtiu?' + ativação newsletter"
        }
      ],
      tips: [
        "📊 A MAIORIA abandona na fase 3-4. Use objeção reversa: 'Não quer?', 'Ficou com medo?', 'Tá diferente do que imaginava?'",
        "🎯 AWARENESS = 70% educação + 30% branding. DECISÃO = 70% venda + 30% garantia",
        "💬 NUNCA venda direto no 1º contato. Antes precisa: saber o tipo dela, qual sua dúvida, se combina",
        "⏰ Timing por estágio: Awareness (dias), Interesse (horas), Consideração (minutos!), Decisão (imediato), Compra (segundos), Retenção (2 min após recebido)",
        "🔄 Se pulou estágio (ex: awareness → compra = raro), retorne: educação. Se travou num estágio, respeite mas não abandone",
        "👥 Clientes que passam por TODOS os 6 estágios virão sua marca pra amigas = OURO",
        "🎁 Estágio mais importante pra retenção = COMPRA (expectativa) + RETENÇÃO (feedback). 70% volta se recebeu BEM e você perguntou como foi",
        "💡 Se cliente pula de INTERESSE direto pra COMPRA = impulso. Se sai de RETENÇÃO = marca ruim (não foi celebrado bem)"
      ]
    }
  },

  palmiraQuickAnswers: {
    // Upload
    "como subir produto": "palmiraUpload",
    "como subo um produto": "palmiraUpload",
    "upload de produto": "palmiraUpload",
    "upload novo produto": "palmiraUpload",
    "adicionar produto": "palmiraUpload",
    "novo produto": "palmiraUpload",
    "subo produto": "palmiraUpload",

    // Editar
    "como editar produto": "palmiraEditarProdutos",
    "editar produto": "palmiraEditarProdutos",
    "mudar foto": "palmiraEditarProdutos",
    "reordenar fotos": "palmiraEditarProdutos",
    "remover foto": "palmiraEditarProdutos",
    "adicionar foto": "palmiraEditarProdutos",

    // Cores
    "adicionar cor": "palmiraAdicionarCor",
    "nova cor": "palmiraAdicionarCor",
    "cor do produto": "palmiraAdicionarCor",

    // Preços
    "corrigir preço": "palmiraCorrigirPrecos",
    "mudar preço": "palmiraCorrigirPrecos",
    "atualizar preço": "palmiraCorrigirPrecos",

    // Estoque
    "estoque palmira": "palmiraEstoque",
    "quanto tenho de estoque": "palmiraEstoque",
    "ver estoque": "palmiraEstoque",

    // Reordenar
    "reordenar produtos": "palmiraReordenar",
    "mudar ordem produtos": "palmiraReordenar",
    "qual primeiro produto": "palmiraReordenar",

    // Visualizar
    "como fica na loja": "palmiraVisualizarLoja",
    "ver loja": "palmiraVisualizarLoja",
    "visualizar": "palmiraVisualizarLoja",
    "como cliente vê": "palmiraVisualizarLoja",

    // Sincronizar
    "sincronizar": "palmiraSincronizar",
    "botão sync": "palmiraSincronizar",
    "🚀 sincronizar agora": "palmiraSincronizar",
    "enviar pro site": "palmiraSincronizar",
    "atualizar site": "palmiraSincronizar",
    "onde salva": "palmiraSincronizar",

    // Montar Pedido
    "montar pedido": "montarPedido",
    "criar pedido": "montarPedido",
    "pedido cliente": "montarPedido",
    "resumo pedido": "montarPedido",

    // Mensagens
    "mensagem": "mensagensClientes",
    "como escrevo mensagem": "mensagensClientes",
    "como mandar mensagem": "mensagensClientes",
    "escrever para cliente": "mensagensClientes",
    "texto para whatsapp": "mensagensClientes",
    "mensagem vendedora": "mensagensClientes",
    "como vendo no whatsapp": "mensagensClientes",

    // Condução
    "condução": "conducaoClientes",
    "follow-up": "conducaoClientes",
    "cliente sumiu": "conducaoClientes",
    "cliente não respondeu": "conducaoClientes",
    "como reativar cliente": "conducaoClientes",
    "cliente voltou": "conducaoClientes",
    "reconquistar cliente": "conducaoClientes",

    // Estágios de Cliente
    "mensagens estágio": "mensagensEstagios",
    "estágio cliente": "mensagensEstagios",
    "todos os momentos": "mensagensEstagios",
    "awareness": "mensagensEstagios",
    "interesse": "mensagensEstagios",
    "consideração": "mensagensEstagios",
    "decisão": "mensagensEstagios",
    "retenção": "mensagensEstagios",
    "customer journey": "mensagensEstagios",

    // Outros
    "pedidos": "pedidos",
    "vendas": "vendas",
    "cores": "gerenciarCores",
    "estoque": "estoque",
    "crm": "crm",
    "cupom": "cupons",
    "preço revendedora": "tabelaPrecos"
  }
};

// Função para buscar guia na base expandida
export function getModuleGuideExtended(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Busca nos quick answers da Palmira
  for (const [keyword, moduleKey] of Object.entries(belaKnowledgeExtended.palmiraQuickAnswers)) {
    if (lowerQuery.includes(keyword)) {
      const module = belaKnowledgeExtended.modules[moduleKey as keyof typeof belaKnowledgeExtended.modules];
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

  if (module.url) {
    guide += `🔗 Acesso: \`${module.url}\`\n\n`;
  }

  if (module.steps) {
    guide += `**Passos:**\n`;
    for (const step of module.steps) {
      guide += `${step.number}️⃣ **${step.title}**\n${step.description}\n\n`;
    }
  }

  if (module.tips) {
    guide += `**💡 Dicas úteis:**\n`;
    for (const tip of module.tips) {
      guide += `${tip}\n`;
    }
  }

  return guide;
}
