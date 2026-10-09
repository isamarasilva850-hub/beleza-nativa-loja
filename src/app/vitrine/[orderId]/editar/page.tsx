"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { agruparPecas, MENSAGEM_PADRAO, PecaVitrine } from "@/lib/vitrine";
import { artesLegendasMap } from "@/data/artes-legendas";

function reduzirLogo(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error("Não consegui ler a imagem"));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido"));
      img.onload = () => {
        const lado = 240;
        const canvas = document.createElement("canvas");
        canvas.width = lado;
        canvas.height = lado;
        const ctx = canvas.getContext("2d");
        const menor = Math.min(img.width, img.height);
        const x = (img.width - menor) / 2;
        const y = (img.height - menor) / 2;
        ctx?.drawImage(img, x, y, menor, menor, 0, 0, lado, lado);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(leitor.result);
    };
    leitor.readAsDataURL(arquivo);
  });
}

export default function EditarVitrine() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [pecas, setPecas] = useState<PecaVitrine[]>([]);
  const [form, setForm] = useState({
    nome: "",
    logo: "",
    mensagem: MENSAGEM_PADRAO,
    whatsapp: "",
  });
  const [precos, setPrecos] = useState<Record<string, string>>({});
  const [fotos, setFotos] = useState<Record<string, string>>({});
  const [legendaCopiada, setLegendaCopiada] = useState("");

  useEffect(() => {
    if (!orderId) return;
    Promise.all([
      fetch(`/api/vitrine?pedidoId=${orderId}`).then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([dados, produtos]) => {
        if (dados.error) throw new Error(dados.error);
        const v = dados.vitrine || {};
        setForm({
          nome: v.nome || dados.pedido.partnerName || "",
          logo: v.logo || "",
          mensagem: v.mensagem || MENSAGEM_PADRAO,
          whatsapp: v.whatsapp || "",
        });
        setPrecos(v.precos || {});
        setPecas(agruparPecas(dados.pedido.items));
        const mapaFotos: Record<string, string> = {};
        for (const p of Array.isArray(produtos) ? produtos : []) {
          if (p.ref && p.images?.[0]) mapaFotos[p.ref] = p.images[0];
        }
        setFotos(mapaFotos);
      })
      .catch((err) => setMensagemStatus({ tipo: "erro", texto: err.message }))
      .finally(() => setCarregando(false));
  }, [orderId]);

  const baixarFoto = (ref: string) => {
    const link = document.createElement("a");
    link.href = fotos[ref];
    link.download = `${ref}.jpg`;
    link.click();
  };

  const copiarLegenda = async (ref: string) => {
    const entrada = artesLegendasMap[ref as keyof typeof artesLegendasMap];
    const texto = entrada?.legendaCurta || entrada?.legendaCompleta || `REF ${ref}`;
    await navigator.clipboard.writeText(texto);
    setLegendaCopiada(ref);
    setTimeout(() => setLegendaCopiada(""), 2000);
  };

  const trocarLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    try {
      const logo = await reduzirLogo(arquivo);
      setForm((f) => ({ ...f, logo }));
    } catch (err) {
      setMensagemStatus({ tipo: "erro", texto: err instanceof Error ? err.message : "Erro na imagem" });
    }
  };

  const salvar = async () => {
    setSalvando(true);
    setMensagemStatus(null);
    try {
      const res = await fetch("/api/vitrine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId: orderId, ...form, precos }),
      });
      const dados = await res.json();
      if (!res.ok) throw new Error(dados.error || "Erro ao salvar");
      setMensagemStatus({ tipo: "ok", texto: "Vitrine salva!" });
    } catch (err) {
      setMensagemStatus({ tipo: "erro", texto: err instanceof Error ? err.message : "Erro ao salvar" });
    } finally {
      setSalvando(false);
    }
  };

  const linkPublico = typeof window !== "undefined" ? `${window.location.origin}/vitrine/${orderId}` : "";

  const copiarLink = async () => {
    await navigator.clipboard.writeText(linkPublico);
    setMensagemStatus({ tipo: "ok", texto: "Link copiado! Envie para a sua cliente." });
  };

  if (carregando) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Carregando...</div>;
  }

  const campo = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7BC9C2]";

  return (
    <div className="min-h-screen bg-[#FBF8F4] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Monte sua vitrine</h1>
          <p className="text-gray-600 text-sm mt-1">Personalize e defina o preço de revenda de cada peça.</p>
        </div>

        <section className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
          <div className="flex items-center gap-4">
            {form.logo ? (
              <img src={form.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#7BC9C2]/20" />
            )}
            <label className="text-sm font-medium text-[#3d8c85] cursor-pointer">
              Trocar logo
              <input type="file" accept="image/*" onChange={trocarLogo} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Nome da vitrine</label>
            <input className={campo} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Mensagem de boas-vindas</label>
            <textarea
              className={`${campo} min-h-[140px]`}
              value={form.mensagem}
              onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Seu WhatsApp (com DDD)</label>
            <input
              className={campo}
              placeholder="(35) 99999-0000"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 space-y-3 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Peças e preço de revenda</h2>
          {pecas.map((peca) => (
            <div key={peca.ref} className="flex items-center gap-3 border-t border-gray-100 pt-3">
              {fotos[peca.ref] ? (
                <img src={fotos[peca.ref]} alt={peca.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{peca.name}</p>
                <p className="text-xs text-gray-500">REF {peca.ref}</p>
              </div>
              <input
                className="w-32 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7BC9C2]"
                placeholder="Seu preço"
                inputMode="decimal"
                value={precos[peca.ref] || ""}
                onChange={(e) => setPrecos({ ...precos, [peca.ref]: e.target.value })}
              />
              <div className="flex flex-col gap-1">
                {fotos[peca.ref] && (
                  <button
                    type="button"
                    onClick={() => baixarFoto(peca.ref)}
                    className="text-xs px-3 py-1.5 border border-[#7BC9C2] text-[#3d8c85] rounded-lg hover:bg-[#7BC9C2]/10"
                  >
                    Baixar foto
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => copiarLegenda(peca.ref)}
                  className="text-xs px-3 py-1.5 border border-[#7BC9C2] text-[#3d8c85] rounded-lg hover:bg-[#7BC9C2]/10"
                >
                  {legendaCopiada === peca.ref ? "Legenda copiada!" : "Copiar legenda"}
                </button>
              </div>
            </div>
          ))}
        </section>

        {mensagemStatus && (
          <p className={`p-3 rounded-xl text-sm ${mensagemStatus.tipo === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {mensagemStatus.texto}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="flex-1 bg-[#7BC9C2] hover:bg-[#5fb3ac] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {salvando ? "Salvando..." : "Salvar vitrine"}
          </button>
          <button
            type="button"
            onClick={copiarLink}
            className="flex-1 border border-[#7BC9C2] text-[#3d8c85] font-semibold py-3 rounded-xl hover:bg-[#7BC9C2]/10 transition-colors"
          >
            Copiar link para a cliente
          </button>
        </div>
      </div>
    </div>
  );
}
