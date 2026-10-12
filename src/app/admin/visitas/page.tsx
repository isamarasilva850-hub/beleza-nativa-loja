"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Visita {
  aparelho: string;
  nome: string | null;
  telefone: string | null;
  ultimaVisita: string;
  ultimaPagina: string | null;
  totalVisitas: number;
}

const formatar = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

export default function VisitasPage() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [soIdentificadas, setSoIdentificadas] = useState(false);
  const [interessadas, setInteressadas] = useState<{ nome: string; telefone: string; ultimaVisita: string; visitas: number }[]>([]);

  useEffect(() => {
    fetch("/api/visitas/interessadas")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setInteressadas(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/visitas")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setVisitas(data);
      })
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, []);

  const lista = visitas
    .filter((v) => !soIdentificadas || v.nome)
    .sort((a, b) => new Date(b.ultimaVisita).getTime() - new Date(a.ultimaVisita).getTime());

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
          ← Voltar
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">👀 Visitas ao site</h1>
        <p className="text-gray-600 mb-6">Última visita de cada aparelho. Nome e telefone aparecem quando a pessoa já se identificou.</p>

        {interessadas.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-4 mb-6">
            <h2 className="font-bold text-gray-800 mb-1">📝 Interessadas (preencheram e não enviaram o formulário)</h2>
            <p className="text-xs text-gray-500 mb-3">Para chamar no WhatsApp. Elas ainda não são leads.</p>
            <div className="divide-y">
              {interessadas.map((i) => (
                <div key={i.telefone} className="py-2 flex justify-between gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">{i.nome || "(sem nome)"}</p>
                    <p className="text-gray-600">{i.telefone}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>{new Date(i.ultimaVisita).toLocaleDateString("pt-BR")}</p>
                    <p>{i.visitas} {i.visitas === 1 ? "visita" : "visitas"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={soIdentificadas}
            onChange={(e) => setSoIdentificadas(e.target.checked)}
          />
          Mostrar só clientes identificadas
        </label>

        {loading && <p className="text-gray-500">⏳ Carregando...</p>}
        {erro && <p className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{erro}</p>}

        {!loading && !erro && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Nome</th>
                  <th className="p-3">Telefone</th>
                  <th className="p-3">Última visita</th>
                  <th className="p-3">Última página</th>
                  <th className="p-3">Visitas</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((v) => (
                  <tr key={v.aparelho} className="border-t">
                    <td className="p-3 font-semibold">{v.nome || <span className="text-gray-400">Anônima</span>}</td>
                    <td className="p-3">{v.telefone || "—"}</td>
                    <td className="p-3">{formatar(v.ultimaVisita)}</td>
                    <td className="p-3 text-gray-600">{v.ultimaPagina || "—"}</td>
                    <td className="p-3">{v.totalVisitas}</td>
                  </tr>
                ))}
                {lista.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">Nenhuma visita registrada ainda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
