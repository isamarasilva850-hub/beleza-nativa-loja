export default function Frete() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Condições de Frete</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
        <p>
          Enviamos para <strong>todo o Brasil</strong> pelos Correios ou transportadora.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Frete grátis</h2>
        <p>
          Consulte as condições de frete grátis para sua região diretamente com nossa equipe
          pelo WhatsApp. O valor do frete pode variar conforme o destino e o peso do pedido.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Prazo de entrega</h2>
        <p>
          O prazo de entrega varia de acordo com a localidade:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Sudeste:</strong> 3 a 7 dias úteis</li>
          <li><strong>Sul e Centro-Oeste:</strong> 5 a 10 dias úteis</li>
          <li><strong>Nordeste e Norte:</strong> 7 a 15 dias úteis</li>
        </ul>
        <p className="text-sm text-gray-500">
          Os prazos começam a contar após a confirmação do pagamento e postagem.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Rastreamento</h2>
        <p>
          Após a postagem, enviamos o código de rastreio pelo WhatsApp para que
          você acompanhe a entrega em tempo real.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Embalagem</h2>
        <p>
          Todos os pedidos são embalados com cuidado para garantir que as peças cheguem
          em perfeito estado.
        </p>

        <p className="mt-8">
          Dúvidas sobre frete? Fale conosco: <strong>(35) 99210-0072</strong>
        </p>
      </div>
    </div>
  );
}
