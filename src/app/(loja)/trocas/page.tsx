export default function Trocas() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Trocas e Devoluções</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
        <p>
          A <strong>Beleza Nativa</strong> trabalha para que você receba sempre peças
          em perfeito estado. Caso haja algum problema, estamos à disposição.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Quando posso trocar?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Produto com defeito de fabricação</li>
          <li>Produto diferente do pedido (modelo, cor ou tamanho errado)</li>
          <li>Produto danificado no transporte</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Prazo para solicitar</h2>
        <p>
          Você tem até <strong>7 dias corridos</strong> após o recebimento para solicitar a
          troca ou devolução, conforme o Código de Defesa do Consumidor.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Como solicitar</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Entre em contato pelo WhatsApp <strong>(35) 99210-0072</strong></li>
          <li>Envie fotos do produto e descreva o problema</li>
          <li>Aguarde a análise da nossa equipe (até 2 dias úteis)</li>
          <li>Após aprovada, envie o produto para nosso endereço</li>
        </ol>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Condições</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>O produto deve estar sem uso, com etiquetas e na embalagem original</li>
          <li>Peças íntimas (calcinhas, sutiãs) só podem ser trocadas se houver defeito de fabricação, por questões de higiene</li>
          <li>O frete de devolução por defeito fica por nossa conta</li>
        </ul>

        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-gray-800 mb-2">Importante</h3>
          <p>
            Ao receber seu pedido, confira todas as peças imediatamente. Qualquer divergência
            deve ser comunicada o mais rápido possível.
          </p>
        </div>
      </div>
    </div>
  );
}
