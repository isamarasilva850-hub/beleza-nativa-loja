"use client";

import Link from "next/link";

export default function ParceirosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">
          ← Voltar
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">👩‍💼</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem-vinda, Revendedora!</h1>
          <p className="text-gray-600 mb-8">
            Você está no portal exclusivo da Beleza Nativa para nossas revendedoras.
          </p>

          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white mb-8">
            <h2 className="text-xl font-bold mb-3">🛍️ Catálogo de Produtos</h2>
            <p className="mb-4">Navegue por todos os nossos produtos, filtre por categoria e confira os preços de atacado.</p>
            <Link
              href="/"
              className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Acessar Catálogo →
            </Link>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-3 text-left">
              <h3 className="font-bold text-gray-800 mb-1">📱 Acesso à Loja</h3>
              <p className="text-sm text-gray-600">Consulte todos os produtos, preços, cores e tamanhos disponíveis.</p>
            </div>
            <div className="border-l-4 border-primary pl-4 py-3 text-left">
              <h3 className="font-bold text-gray-800 mb-1">💰 Preços de Atacado</h3>
              <p className="text-sm text-gray-600">Tabelas especiais com descontos para revendedoras cadastradas.</p>
            </div>
            <div className="border-l-4 border-primary pl-4 py-3 text-left">
              <h3 className="font-bold text-gray-800 mb-1">📞 Suporte</h3>
              <p className="text-sm text-gray-600">Dúvidas? Entre em contato via WhatsApp +55 (35) 99210-0072</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
