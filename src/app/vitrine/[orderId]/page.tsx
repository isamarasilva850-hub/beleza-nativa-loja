"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { agruparPecas, formatarPreco, MENSAGEM_PADRAO, PecaVitrine, telefoneWhatsApp } from "@/lib/vitrine";

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
  const whatsapp = vitrine?.whatsapp ? telefoneWhatsApp(vitrine.whatsapp) : "";

  const linkWhatsApp = (texto: string) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`;

  return (
    <div className="min-h-screen bg-[#FBF8F4]">
      <header className="bg-[#7BC9C2] text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          {vitrine?.logo ? (
            <img src={vitrine.logo} alt={nome} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-white" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/30 mx-auto mb-4 flex items-center justify-center text-4xl">💎</div>
          )}
          <h1 className="text-3xl md:text-4xl font-semibold">{nome}</h1>
          <p className="mt-3 max-w-2xl mx-auto whitespace-pre-line text-white/95 leading-relaxed">{mensagem}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Peças escolhidas para você</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {pecas.map((peca) => {
            const preco = formatarPreco(vitrine?.precos?.[peca.ref]);
            const cores = peca.cores.join(", ");
            const tamanhos = peca.tamanhos.join(", ");
            return (
              <div key={peca.ref} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div className="aspect-square bg-gray-100">
                  {fotos[peca.ref] && (
                    <img src={fotos[peca.ref]} alt={peca.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <p className="font-medium text-gray-900 leading-snug">{peca.name}</p>
                  {cores && <p className="text-sm text-gray-500">Cor: {cores}</p>}
                  {tamanhos && <p className="text-sm text-gray-500">Tamanhos: {tamanhos}</p>}
                  <p className="text-xl font-semibold text-gray-900 mt-1">{preco || "Consulte"}</p>
                  {whatsapp && (
                    <a
                      href={linkWhatsApp(`Olá! Tenho interesse na peça ${peca.name} (REF ${peca.ref}). Pode me confirmar?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-center bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      Quero esta peça
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {whatsapp && (
          <div className="text-center mt-12">
            <a
              href={linkWhatsApp("Olá! Vi a sua vitrine e gostaria de falar com você.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Falar com {nome} no WhatsApp
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
