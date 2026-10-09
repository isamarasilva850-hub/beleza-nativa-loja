"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { agruparPecas, formatarPreco, MENSAGEM_PADRAO, PecaVitrine } from "@/lib/vitrine";

export default function VitrinePublica() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [vitrine, setVitrine] = useState<any>(null);
  const [pecas, setPecas] = useState<PecaVitrine[]>([]);
  const [fotos, setFotos] = useState<Record<string, string>>({});
  const [nomePedido, setNomePedido] = useState("");

  useEffect(() => {
    if (!orderId) return;
    Promise.all([
      fetch(`/api/vitrine?pedidoId=${orderId}`).then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([dados, produtos]) => {
        if (dados.error) throw new Error(dados.error);
        setVitrine(dados.vitrine);
        setNomePedido(dados.pedido.partnerName);
        setPecas(agruparPecas(dados.pedido.items));
        const mapaFotos: Record<string, string> = {};
        for (const p of Array.isArray(produtos) ? produtos : []) {
          if (p.ref && p.images?.[0]) mapaFotos[p.ref] = p.images[0];
        }
        setFotos(mapaFotos);
      })
      .catch(() => setErro("Não encontramos esta vitrine. Confira o link com a sua revendedora."))
      .finally(() => setCarregando(false));
  }, [orderId]);

  if (carregando) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Carregando sua vitrine...</div>;
  }

  if (erro) {
    return <div className="min-h-screen flex items-center justify-center p-6 text-center text-gray-600">{erro}</div>;
  }

  const nome = vitrine?.nome || nomePedido;
  const mensagem = vitrine?.mensagem || MENSAGEM_PADRAO;
  const whatsappDigitos = (vitrine?.whatsapp || "").replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-[#FBF8F4] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-[#7BC9C2]/20 p-6 md:p-8 text-center">
          {vitrine?.logo ? (
            <img src={vitrine.logo} alt={nome} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#7BC9C2]/20 mx-auto mb-4 flex items-center justify-center text-3xl">💎</div>
          )}
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{nome}</h1>
          <p className="text-gray-600 mt-3 whitespace-pre-line leading-relaxed">{mensagem}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {pecas.map((peca) => {
            const preco = formatarPreco(vitrine?.precos?.[peca.ref]);
            return (
              <div key={peca.ref} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="aspect-square bg-gray-100">
                  {fotos[peca.ref] && (
                    <img src={fotos[peca.ref]} alt={peca.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm">{peca.name}</p>
                  {peca.cores.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Cor: {peca.cores.join(", ")}</p>
                  )}
                  {peca.tamanhos.length > 0 && (
                    <p className="text-xs text-gray-500">Tamanhos: {peca.tamanhos.join(", ")}</p>
                  )}
                  <p className="text-base font-semibold text-gray-900 mt-2">{preco || "Consulte a revendedora"}</p>
                </div>
              </div>
            );
          })}
        </div>

        {whatsappDigitos && (
          <div className="text-center mt-10">
            <a
              href={`https://wa.me/55${whatsappDigitos}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Falar com {nome} no WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
