import { NextRequest, NextResponse } from 'next/server';
import { getModuleGuide, belaKnowledge } from '@/lib/belaKnowledge';
import { getModuleGuideExtended } from '@/lib/belaKnowledge.extended';
import { gerarMensagem } from '@/lib/messageGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
    }

    // Primeiro, tenta encontrar uma resposta na base de conhecimento expandida (Palmira)
    const moduleGuideExtended = getModuleGuideExtended(message);
    console.log('🔍 Extended search for:', message);
    console.log('📊 Extended result:', moduleGuideExtended ? '✅ FOUND' : '❌ NOT FOUND');
    if (moduleGuideExtended) {
      return NextResponse.json({
        response: moduleGuideExtended,
        type: 'guide'
      });
    }

    // Depois, tenta na base de conhecimento original
    const moduleGuide = getModuleGuide(message);
    if (moduleGuide) {
      return NextResponse.json({
        response: moduleGuide,
        type: 'guide'
      });
    }

    // Se a pergunta é sobre gerar mensagem para cliente
    if (
      message.toLowerCase().includes('mensagem') ||
      message.toLowerCase().includes('mandar') ||
      message.toLowerCase().includes('whatsapp') ||
      message.toLowerCase().includes('email')
    ) {
      if (context?.cliente) {
        const tipoAcao = message.toLowerCase().includes('email') ? 'email' : 'whatsapp';
        const mensagem = gerarMensagem(context.cliente, tipoAcao);

        return NextResponse.json({
          response: `💬 **Mensagem sugerida:**\n\n${mensagem}\n\n[Copiar] [Enviar]`,
          type: 'message'
        });
      }
    }

    // Se nada específico foi encontrado, responde como assistente genérico
    const genericResponse = await generateGenericResponse(message);
    return NextResponse.json({
      response: genericResponse,
      type: 'generic'
    });

  } catch (error) {
    console.error('Erro na Bela:', error);
    return NextResponse.json(
      { error: 'Erro ao processar sua pergunta' },
      { status: 500 }
    );
  }
}

async function generateGenericResponse(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase();

  // Respostas pré-definidas para dúvidas comuns
  const responses: Record<string, string> = {
    'oi': '👋 Oi! Sou a Bela, sua assistente de IA da Beleza Nativa. Como posso te ajudar? Você pode me perguntar sobre:\n• Como usar qualquer módulo do admin\n• Como criar um pedido\n• Como gerenciar produtos\n• Como escrever mensagens para clientes\n\nQual é sua dúvida?',

    'ola': '👋 Oi! Sou a Bela, sua assistente de IA da Beleza Nativa. Como posso te ajudar? Você pode me perguntar sobre:\n• Como usar qualquer módulo do admin\n• Como criar um pedido\n• Como gerenciar produtos\n• Como escrever mensagens para clientes\n\nQual é sua dúvida?',

    'quem é você': '🤖 Sou a **Bela**, uma assistente de IA criada para ajudar você, a Rose e a Palmira a usar o admin da Beleza Nativa. Posso:\n\n✅ Explicar como usar cada módulo\n✅ Dar instruções passo-a-passo\n✅ Ajudar a escrever mensagens para clientes\n✅ Responder dúvidas sobre o sistema\n\nComo posso te ajudar?',

    'obrigado': '😊 De nada! Estou aqui pra ajudar. Tem mais alguma dúvida?',

    'thanks': '😊 De nada! Estou aqui pra ajudar. Tem mais alguma dúvida?',

    'help': '📚 Você pode me perguntar sobre:\n\n📦 **Upload de Produtos** - Como subir produto, cores, tamanhos\n🛒 **Montar Pedido** - Como criar pedidos para clientes\n🎨 **Gerenciar Cores** - Como editar cores dos produtos\n📊 **CRM** - Como gerenciar clientes e leads\n💬 **Mensagens** - Como escrever mensagens para clientes\n📈 **Dashboard** - Entender os números\n\nQual desses você quer aprender?',

    'ajuda': '📚 Você pode me perguntar sobre:\n\n📦 **Upload de Produtos** - Como subir produto, cores, tamanhos\n🛒 **Montar Pedido** - Como criar pedidos para clientes\n🎨 **Gerenciar Cores** - Como editar cores dos produtos\n📊 **CRM** - Como gerenciar clientes e leads\n💬 **Mensagens** - Como escrever mensagens para clientes\n📈 **Dashboard** - Entender os números\n\nQual desses você quer aprender?'
  };

  // Procura por uma resposta exata
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  // Resposta padrão
  return `🤔 Não entendi direito sua pergunta. Você pode me perguntar sobre:\n\n📦 Upload de Produtos\n🛒 Montar Pedido\n🎨 Gerenciar Cores\n📊 CRM / Clientes / Leads\n💬 Mensagens para clientes\n\nQual é sua dúvida?`;
}
