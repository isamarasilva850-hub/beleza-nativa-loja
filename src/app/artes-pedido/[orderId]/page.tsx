'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { products } from '@/data/products';
import { artesLegendasMap } from '@/data/artes-legendas';

interface Order {
  id: string;
  partnerId: string;
  partnerName: string;
  items: any[];
  created_at: string;
}

export default function ArtesPedidoPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?id=${orderId}`);
        const data = await response.json();
        const foundOrder = Array.isArray(data) ? data.find((o: any) => o.id === orderId) : null;
        setOrder(foundOrder || null);
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">⏳ Carregando artes...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-800 text-lg font-semibold">Artes não encontradas</p>
          <p className="text-gray-500 text-sm mt-1">Verifique o link e tente novamente</p>
        </div>
      </div>
    );
  }

  const catalogLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/catalogo-revendedora/${order.partnerId}`;

  // Pegar imagens dos produtos
  const artes = order.items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId);
    const legenda = artesLegendasMap[item.ref];

    return {
      ref: item.ref,
      name: item.name,
      image: product?.images?.[0] || '/placeholder.png',
      legendaCurta: legenda?.legendaCurta || '',
      legendaCompleta: legenda?.legendaCompleta || '',
    };
  });

  const downloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎨 Suas Artes Estão Prontas!</h1>
          <p className="text-lg text-gray-600">Salve as fotos e use em suas redes sociais e WhatsApp</p>
        </div>

        {/* CATÁLOGO LINK */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-3">📱 Seu Catálogo Exclusivo</h2>
          <p className="mb-4">Clique abaixo para acessar seu catálogo completo com fotos de TODAS as peças, cores, tamanhos e simular novos pedidos:</p>
          <a
            href={catalogLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-teal-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition text-lg mb-3"
          >
            🔗 Acessar Meu Catálogo →
          </a>
          <p className="text-sm opacity-90">Salve este link para acessar sempre!</p>
        </div>

        {/* INSTRUÇÕES */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-12">
          <h3 className="font-bold text-blue-900 mb-3 text-lg">📸 Como Salvar e Usar as Fotos</h3>
          <ol className="text-blue-900 text-sm space-y-2">
            <li><strong>1. Salvar:</strong> Clique no ícone 💾 em cada arte para baixar a imagem</li>
            <li><strong>2. Postar:</strong> Cole as fotos em seu Instagram, Facebook, WhatsApp ou Stories</li>
            <li><strong>3. Vender:</strong> Use as fotos para atrair clientes e fechar vendas!</li>
            <li><strong>Dica:</strong> Crie um álbum no WhatsApp com as fotos para enviar rápido</li>
          </ol>
        </div>

        {/* ARTES */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Suas {artes.length} Artes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artes.map((arte, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {/* IMAGEM */}
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={arte.image}
                    alt={arte.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.png';
                    }}
                  />
                </div>

                {/* CONTEÚDO */}
                <div className="p-6">
                  <p className="text-sm text-gray-500 font-mono mb-1">REF {arte.ref}</p>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{arte.name}</h3>

                  {/* LEGENDAS */}
                  {arte.legendaCurta && (
                    <p className="text-sm text-gray-700 mb-3 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                      <strong>✨ Destaque:</strong> {arte.legendaCurta}
                    </p>
                  )}

                  {arte.legendaCompleta && (
                    <p className="text-xs text-gray-600 mb-4 italic">{arte.legendaCompleta}</p>
                  )}

                  {/* BOTÃO SALVAR */}
                  <button
                    onClick={() => downloadImage(arte.image, `BN-${arte.ref}-${arte.name}.jpg`)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-bold transition"
                  >
                    💾 Salvar Imagem
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRÓXIMO PASSO */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-green-900 mb-4">🚀 Próximo Passo</h3>
          <p className="text-green-800 mb-6 text-lg">
            Salve as fotos, poste nas suas redes e <strong>comece a vender!</strong>
          </p>

          <div className="space-y-3">
            <p className="text-sm text-green-700">
              <strong>Dúvidas?</strong> Fale com a gente pelo WhatsApp:
            </p>
            <a
              href="https://wa.me/5535992100072?text=Oi%20Beleza%20Nativa%21%20Tenho%20d%C3%BAvidas%20sobre%20minhas%20artes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition text-lg"
            >
              💬 Conversar no WhatsApp
            </a>
          </div>
        </div>

        {/* LINK DO CATÁLOGO - COPIAR */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">🔗 Link do seu Catálogo (copie para compartilhar):</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={catalogLink}
              readOnly
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={() => copyToClipboard(catalogLink)}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-bold transition"
            >
              {copied ? '✅ Copiado!' : '📋 Copiar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
