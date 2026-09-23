import Link from "next/link";

export default function ComoComprar() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Como Comprar</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
        <p>
          Comprar na <strong>Beleza Nativa</strong> é simples e rápido. Veja o passo a passo:
        </p>

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Cadastre-se</h3>
              <p>
                <Link href="/cadastro" className="text-primary hover:underline">Faça seu cadastro</Link> como
                revendedora para ter acesso aos preços de atacado.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Escolha seus produtos</h3>
              <p>
                Navegue pelo catálogo, escolha as peças, cores e tamanhos desejados e adicione ao carrinho.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Monte seu pedido</h3>
              <p>
                O pedido mínimo para atacado é de <strong>R$ 600,00</strong>. Você pode
                misturar modelos, cores e tamanhos como preferir.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Finalize pelo WhatsApp</h3>
              <p>
                Ao finalizar, seu pedido é enviado direto para nosso WhatsApp. Lá combinamos
                o pagamento e o envio.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-gray-800 mb-2">Compra para uso próprio?</h3>
          <p>
            Você também pode comprar peças avulsas pelo preço de varejo, sem necessidade de
            cadastro. Basta adicionar ao carrinho e finalizar pelo WhatsApp.
          </p>
        </div>

        <p>
          Dúvidas? Fale conosco pelo WhatsApp: <strong>(35) 99210-0072</strong>
        </p>
      </div>
    </div>
  );
}
