export default function Parcelamento() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Condições de Parcelamento</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
        <p>
          A <strong>Beleza Nativa</strong> oferece diversas formas de pagamento para facilitar
          sua compra.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Formas de pagamento</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-800 mb-2">PIX</h3>
            <p className="text-sm">Pagamento à vista com confirmação imediata. Seu pedido é processado mais rápido.</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-800 mb-2">Cartão de Crédito</h3>
            <p className="text-sm">Parcelamento em até 6x. Aceitamos Visa, Mastercard e Amex.</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-800 mb-2">Boleto Bancário</h3>
            <p className="text-sm">Disponível para clientes selecionadas, mediante avaliação. Consulte pelo WhatsApp.</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-800 mb-2">Transferência</h3>
            <p className="text-sm">Transferência bancária com confirmação em até 1 dia útil.</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Parcelamento no cartão</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Parcelas</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Condição</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-3 text-sm">1x (à vista)</td>
                <td className="border border-gray-200 px-4 py-3 text-sm">Sem juros</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3 text-sm">2x</td>
                <td className="border border-gray-200 px-4 py-3 text-sm">Sem juros</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-3 text-sm">3x</td>
                <td className="border border-gray-200 px-4 py-3 text-sm">Sem juros</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3 text-sm">4x a 6x</td>
                <td className="border border-gray-200 px-4 py-3 text-sm">Consulte condições</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          As condições de pagamento são combinadas diretamente pelo WhatsApp no momento do pedido.
        </p>

        <p className="mt-8">
          Dúvidas sobre pagamento? Fale conosco: <strong>(35) 99210-0072</strong>
        </p>
      </div>
    </div>
  );
}
