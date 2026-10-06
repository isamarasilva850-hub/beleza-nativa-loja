'use client';

import { useState } from 'react';
import { products } from '@/data/products';

const LUCRO_PERCENT = 100; // 100% de lucro para revendedoras!

// Calcular preço de revenda
const PRODUCTS = products.slice(0, 10).map(p => ({
  id: p.id,
  name: p.name,
  priceCost: p.price, // Preço que a revendedora compra
  priceReseller: p.price * 2 // Preço sugerido de venda (2x o custo)
}));

export default function QueroComecear() {
  const [selectedProduct, setSelectedProduct] = useState<number>(1);
  const [quantidade, setQuantidade] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Revendedora',
    status: 'Quer começar'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const produto = PRODUCTS.find(p => p.id === selectedProduct);
  const precoCost = produto?.priceCost || 0;
  const precoVenda = produto?.priceReseller || 0;
  const lucroUnitario = precoVenda - precoCost; // Lucro por peça
  const lucroTotal = lucroUnitario * quantidade;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/parceiros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.name,
          telefone: formData.phone.replace(/\D/g, ''),
          status: 'ativo'
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', type: 'Revendedora', status: 'Quer começar' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🚀 Quanto Você Pode Ganhar?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra seu potencial de lucro. Tudo pronto para você vender — artes, fotos, descrições. Zero trabalho criativo.
          </p>
        </div>

        {/* CALCULADORA */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border-t-4 border-teal-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            💰 Calculadora de Lucro
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Produto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Qual peça você vai vender?
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
              >
                {PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - R$ {p.priceReseller?.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quantas peças por mês?
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* RESULTADO GRANDE */}
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-xl p-8 text-white text-center mb-8">
            <p className="text-sm uppercase tracking-widest font-semibold mb-2 opacity-90">
              Seu lucro potencial
            </p>
            <p className="text-6xl font-bold mb-2">
              R$ {lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </p>
            <p className="text-lg opacity-90">
              por mês com {quantidade} peças
            </p>
            <div className="mt-4 pt-4 border-t border-white border-opacity-30 text-sm">
              <p>Lucro por peça: R$ {lucroUnitario.toFixed(2)}</p>
            </div>
          </div>

          {/* DETALHES */}
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">Você compra por</p>
              <p className="text-lg font-bold text-teal-600">R$ {precoCost.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">Vende por</p>
              <p className="text-lg font-bold text-teal-600">R$ {precoVenda.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">Lucro/Peça</p>
              <p className="text-lg font-bold text-teal-600">R$ {lucroUnitario.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* CATÁLOGO PERSONALIZADO - DESTAQUE */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 md:p-12 mb-12 border-2 border-purple-300">
          <div className="flex items-start gap-6">
            <div className="text-6xl">📚</div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Catálogo Profissional para Suas Clientes
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Receba um catálogo com as peças que você comprou. Adicione sua logo e envie para suas clientes! Tudo pronto, sem trabalho criativo.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-purple-600">📋 Modelo Pronto</p>
                  <p className="text-sm text-gray-600">Com todas as peças</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-purple-600">✨ Sua Marca</p>
                  <p className="text-sm text-gray-600">Você coloca sua logo</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-purple-600">🚀 Envie!</p>
                  <p className="text-sm text-gray-600">Para suas clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BENEFÍCIOS */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
            <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Você recebe pronto:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-teal-500 font-bold text-lg">🎨</span>
                <span>Artes profissionais para cada peça</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-500 font-bold text-lg">📸</span>
                <span>Fotos em alta qualidade</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-500 font-bold text-lg">✍️</span>
                <span>Descrição e textos otimizados</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-500 font-bold text-lg">📱</span>
                <span>Tudo pronto para postar</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💎 Seus benefícios:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold text-lg">🎯</span>
                <span>Zero trabalho criativo/design</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold text-lg">🤝</span>
                <span>Suporte e consultoria</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold text-lg">💻</span>
                <span>Plataforma 100% digital</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold text-lg">⚡</span>
                <span>Começa com pouco investimento</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FORMULÁRIO */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-teal-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Pronto para começar? 🚀
          </h2>

          {submitted && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 text-green-800">
              ✅ Recebemos seu interesse! Em breve entraremos em contato.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seu Nome *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                placeholder="João Silva"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seu WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                placeholder="(35) 99181-2558"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Você é *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
              >
                <option value="Revendedora">Revendedora</option>
                <option value="Lojista">Lojista</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Você *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
              >
                <option value="Quer começar">Quer começar</option>
                <option value="Já revende">Já revende</option>
              </select>
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? '⏳ Enviando...' : '✨ Quero Começar Agora'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Entraremos em contato em breve via WhatsApp
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
