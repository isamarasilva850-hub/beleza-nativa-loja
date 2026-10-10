"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { telefoneWhatsApp } from "@/lib/vitrine";

const DIAS_REATIVACAO = 60;

const SEQUENCIA_RECUPERACAO = [
  {
    rotulo: "Dia 1: perguntar se ficou dúvida",
    texto: "Oi, [NOME]! Te mandei o catálogo e os preços. Ficou alguma dúvida? Posso te ajudar a escolher as peças 😊",
  },
  {
    rotulo: "Dia 4: trazer um motivo novo",
    texto: "[NOME], uma peça que está saindo bastante é a [NOME DA PEÇA]. Você já trabalha com algum modelo parecido?",
  },
  {
    rotulo: "Dia 10: oferecer um começo pequeno",
    texto: "Oi, [NOME]! Se quiser começar devagar, posso montar um pedido só com 3 ou 4 peças para você testar. Quer que eu faça?",
  },
];

const hojeISO = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

const linkWhats = (telefone: string, texto: string) =>
  `https://wa.me/${telefoneWhatsApp(telefone)}?text=${encodeURIComponent(texto)}`;

const diasEntre = (dataISO: string) => {
  const inicio = new Date(dataISO).getTime();
  return Math.floor((Date.now() - inicio) / (1000 * 60 * 60 * 24));
};

export default function FollowupPage() {
  const [carregando, setCarregando] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [revendedoras, setRevendedoras] = useState<any[]>([]);
  const [passoPorLead, setPassoPorLead] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/crm-dados?chave=leads").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/partners").then((r) => r.json()),
    ])
      .then(([crm, pedidosDados, parceiros]) => {
        setLeads(Array.isArray(crm.valor) ? crm.valor : []);
        setPedidos(Array.isArray(pedidosDados) ? pedidosDados : []);
        setRevendedoras(Array.isArray(parceiros) ? parceiros : []);
      })
      .catch((err) => console.error("Erro ao carregar follow-up", err))
      .finally(() => setCarregando(false));
  }, []);

  const hoje = hojeISO();

  const contatosPendentes = leads
    .filter((l) => l.proximaData && l.proximaData <= hoje && l.telefone)
    .sort((a, b) => (a.proximaData < b.proximaData ? -1 : 1));

  const posVenda = pedidos
    .filter((p) => (p.status === "pago" || p.status === "artes_enviadas") && p.partnerPhone)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  const ultimoPedidoPorRevendedora = new Map<string, string>();
  for (const p of pedidos) {
    const atual = ultimoPedidoPorRevendedora.get(p.partnerId);
    if (!atual || p.created_at > atual) ultimoPedidoPorRevendedora.set(p.partnerId, p.created_at);
  }

  const paraReativar = revendedoras.filter((r) => {
    const ultimo = ultimoPedidoPorRevendedora.get(r.id);
    if (!ultimo) return false;
    return diasEntre(ultimo) >= DIAS_REATIVACAO;
  });

  const cartao = "bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2";
  const botao = "text-center bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold py-2.5 rounded-xl transition-colors";

  if (carregando) {
    return <div className="p-8 text-gray-500">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <Link href="/admin/crm" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">← Voltar ao CRM</Link>
          <h1 className="text-2xl font-bold text-gray-800">Follow-up e pós-venda</h1>
          <p className="text-gray-600 mt-1">Quem precisa de contato hoje, quem comprou e quem está sem comprar.</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800">📞 Contatos de hoje e atrasados ({contatosPendentes.length})</h2>
          {contatosPendentes.length === 0 && <p className="text-gray-500">Nenhum contato pendente.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contatosPendentes.map((l) => {
              const passo = passoPorLead[l.id] ?? 0;
              const textoAtual = SEQUENCIA_RECUPERACAO[passo].texto.replace("[NOME]", l.nome);
              return (
                <div key={l.id} className={cartao}>
                  <p className="font-semibold text-gray-900">{l.nome}</p>
                  <p className="text-xs text-gray-500">Etapa: {l.etapa || "—"} · Próximo contato: {l.proximaData.split("-").reverse().join("/")}</p>
                  <select
                    value={passo}
                    onChange={(e) => setPassoPorLead({ ...passoPorLead, [l.id]: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    {SEQUENCIA_RECUPERACAO.map((s, i) => (
                      <option key={i} value={i}>{s.rotulo}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{textoAtual}</p>
                  <a href={linkWhats(l.telefone, textoAtual)} target="_blank" rel="noopener noreferrer" className={botao}>
                    Chamar no WhatsApp
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800">🎁 Pós-venda: perguntar se gostou ({posVenda.length})</h2>
          {posVenda.length === 0 && <p className="text-gray-500">Nenhum pedido pago para acompanhar.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posVenda.map((p) => (
              <div key={p.id} className={cartao}>
                <p className="font-semibold text-gray-900">{p.partnerName}</p>
                <p className="text-xs text-gray-500">Pedido de {p.date || p.created_at?.slice(0, 10)}</p>
                <a
                  href={linkWhats(p.partnerPhone, `Oi, ${p.partnerName}! Tudo bem? Passando para saber se as peças chegaram certinho e se você gostou. Qualquer dúvida, estou à disposição 💛`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={botao}
                >
                  Perguntar como foi
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800">🔁 Sem comprar há {DIAS_REATIVACAO}+ dias ({paraReativar.length})</h2>
          {paraReativar.length === 0 && <p className="text-gray-500">Nenhuma revendedora nessa situação.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paraReativar.map((r) => (
              <div key={r.id} className={cartao}>
                <p className="font-semibold text-gray-900">{r.company || r.name}</p>
                <p className="text-xs text-gray-500">
                  Última compra há {diasEntre(ultimoPedidoPorRevendedora.get(r.id) || "")} dias
                </p>
                <a
                  href={linkWhats(r.phone, `Oi, ${r.name}! Saudades 💛 Chegaram peças novas na Beleza Nativa. Quer que eu te mande as novidades?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={botao}
                >
                  Chamar de volta
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
