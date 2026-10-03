interface Cliente {
  nome: string;
  tipo: string;
  totalGasto?: number;
  compras?: number;
  dataCadastro?: string;
}

export function gerarMensagem(cliente: Cliente, tipoAcao: string): string {
  const dias = cliente.dataCadastro
    ? Math.floor(
        (Date.now() - new Date(cliente.dataCadastro).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const ehNovo = dias <= 3;
  const jaComprou = (cliente.compras || 0) > 0;
  const ehEmpresarial = cliente.tipo === 'empresarial';

  switch (tipoAcao) {
    case 'whatsapp':
      if (ehNovo && !jaComprou) {
        return `Oi ${cliente.nome}! 👋 Vi que você se cadastrou na Beleza Nativa. Gostaria de conversar sobre nossos preços especiais de atacado? Temos ótimas oportunidades! Quando você teria um tempo? 💬`;
      } else if (jaComprou) {
        return `Oi ${cliente.nome}! 😊 Como foi com o pedido anterior? Chegou tudo certo? Temos novos modelos que você pode gostar! Quer conferir? 📸`;
      } else if (ehEmpresarial) {
        return `Oi ${cliente.nome}! 👔 Estamos com promocionais especiais para empresas. Qual seria o melhor momento para conversarmos sobre uma parceria? 🤝`;
      }
      return `Oi ${cliente.nome}! Tudo bem? Gostaria de conversar sobre nossas ofertas exclusivas. Quando você teria um tempo? 💬`;

    case 'email':
      if (ehNovo && !jaComprou) {
        return `Olá ${cliente.nome},\n\nBem-vindo(a) à Beleza Nativa! 🎉\n\nVimos que você se cadastrou em nosso site e gostaria de apresentar nossas oportunidades de atacado com preços especiais.\n\nQual seria o melhor momento para conversarmos?\n\nAbços,\nEquipe Beleza Nativa`;
      } else if (jaComprou) {
        return `Olá ${cliente.nome},\n\nObrigado pela sua compra anterior! ❤️\n\nGostaríamos de saber como foi sua experiência e apresentar nossos novos produtos.\n\nEstamos à disposição para qualquer dúvida.\n\nAbços,\nEquipe Beleza Nativa`;
      }
      return `Olá ${cliente.nome},\n\nEspero que esteja bem! 😊\n\nGostaríamos de apresentar nossas melhores ofertas para você.\n\nQual seria o melhor momento para conversarmos?\n\nAbços,\nEquipe Beleza Nativa`;

    case 'ligar':
      if (ehNovo && !jaComprou) {
        return `Ligar para ${cliente.nome} e apresentar: nossos preços de atacado, condições de pagamento, opções de produtos disponíveis. Deixar claro que somos wholesaler.`;
      } else if (jaComprou) {
        return `Ligar para ${cliente.nome} e: 1) Agradecer pelo pedido anterior, 2) Perguntar como foi a experiência, 3) Apresentar novos produtos, 4) Oferecer descontos para novo pedido.`;
      }
      return `Ligar para ${cliente.nome} e apresentar oportunidades de negócio com a Beleza Nativa.`;

    case 'follow-up':
      if (jaComprou) {
        return `Follow-up: Verificar se ${cliente.nome} recebeu o pedido, se está satisfeito, e oferecer suporte caso haja dúvidas.`;
      }
      return `Follow-up: Verificar interesse de ${cliente.nome} em nossos produtos e esclarecer possíveis dúvidas.`;

    case 'proposta':
      if (ehEmpresarial) {
        return `Enviar proposta customizada para ${cliente.nome} com: lista de produtos, preços, condições de pagamento e prazo de entrega.`;
      }
      return `Enviar proposta com produtos sugeridos para ${cliente.nome}, baseado em perfil de compra anterior.`;

    default:
      return `Ação com ${cliente.nome}: ${tipoAcao}`;
  }
}
