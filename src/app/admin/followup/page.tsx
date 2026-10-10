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

type Registro = { data: string; texto: string };
type Registros = Record<string, Registro[]>;

const ABAS = [
  { id: "hoje", rotulo: "📞 Hoje" },
  { id: "leads", rotulo: "📋 Todos os leads" },
  { id: "pos", rotulo: "🎁 Pós-venda" },
  { id: "reativar", rotulo: "🔁 Reativação" },
] as const;

type Aba = (typeof ABAS)[number]["id"];

const hojeISO = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

const linkWhats = (telefone: string, texto: string) =>
  `https://wa.me/${telefoneWhatsApp(telefone)}?text=${encodeURIComponent(texto)}`;

const diasEntre = (dataISO: string) => {
  const inicio = new Date(dataISO).getTime();
  return Math.floor((Date.now() - inicio) / (1000 * 60 * 60 * 24));
};

const formatarDataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" });

const formatarData = (iso: string) => (iso ? iso.split("-").reverse().join("/") : "—");

function RegistroContato({
  historico,
  onRegistrar,
}: {
  historico: Registro[];
  onRegistrar: (texto: string) => void;
}) {
  const [texto, setTexto] = useState("");
  const ultimos = [...historico].reverse().slice(0, 3);

  return (
    <div className="border-t border-gray-100 pt-3 space-y-2">
      {ultimos.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-600">Últimos registros:</p>
          {ultimos.map((r, i) => (
            <p key={i} className="text-xs text-gray-700 bg-gray-50 rounded-lg p-2">
              <span className="text-gray-400">{formatarDataHora(r.data)}</span> — {r.texto}
            </p>
          ))}
        </div>
      )}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O que vocês conversaram?"
        className="w-full p-2 border border-gray-200 rounded-lg text-sm h-16 resize-none focus:outline-none focus:border-[#7BC9C2]"
      />
      <button
        type="button"
        disabled={!texto.trim()}
        onClick={() => {
          onRegistrar(texto.trim());
          setTexto("");
        }}
        className="w-full py-2 rounded-lg text-sm font-bold bg-[#7BC9C2] hover:bg-[#5fb3ac] disabled:opacity-40 text-white"
      >
        Registrar contato
      </button>
    </div>
  );
}

export default function FollowupPage() {
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState<Aba>("hoje");
  const [leads, setLeads] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [revendedoras, setRevendedoras] = useState<any[]>([]);
  const [passoPorLead, setPassoPorLead] = useState<Record<string, number>>({});
  const [registros, setRegistros] = useState<Registros>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/crm-dados?chave=leads").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/partners").then((r) => r.json()),
      fetch("/api/crm-dados?chave=followup").then((r) => r.json()),
    ])
      .then(([crm, pedidosDados, parceiros, reg]) => {
        setLeads(Array.isArray(crm.valor) ? crm.valor : []);
        setPedidos(Array.isArray(pedidosDados) ? pedidosDados : []);
        setRevendedoras(Array.isArray(parceiros) ? parceiros : []);
        setRegistros(reg.valor && typeof reg.valor === "object" && !Array.isArray(reg.valor) ? reg.valor : {});
      })
      .catch((err) => console.error("Erro ao carregar follow-up", err))
      .finally(() => setCarregando(false));
  }, []);

  const registrarContato = (id: string, texto: string) => {
    const novo: Registro = { data: new Date().toISOString(), texto };
    const atualizado: Registros = { ...registros, [id]: [...(registros[id] || []), novo] };
    setRegistros(atualizado);
    fetch("/api/crm-dados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave: "followup", valor: atualizado }),
    }).catch((err) => console.error("Erro ao salvar registro", err));
  };

  const hoje = hojeISO();

  const contatosPendentes = leads
    .filter((l) => l.proximaData && l.proximaData <= hoje && l.telefone)
    .sort((a, b) => (a.proximaData < b.proximaData ? -1 : 1));

  const todosLeads = leads
    .filter((l) => l.telefone)
    .sort((a, b) => (a.proximaData || "9999") < (b.proximaData || "9999") ? -1 : 1);

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

  const contadores: Record<Aba, number> = {
    hoje: contatosPendentes.length,
    leads: todosLeads.length,
    pos: posVenda.length,
    reativar: paraReativar.length,
  };

  if (carregando) {
    return <div className="p-8 text-gray-500">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <Link href="/admin/crm" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">← Voltar ao CRM</Link>
          <h1 className="text-2xl font-bold text-gray-800">Follow-up e pós-venda</h1>
          <p className="text-gray-600 mt-1">Tudo em um lugar: quem chamar hoje, histórico de cada pessoa e pós-venda.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {ABAS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAba(a.id)}
              className={`px-5 py-3 rounded-lg font-bold transition-all ${
                aba === a.id ? "bg-[#7BC9C2] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {a.rotulo} ({contadores[a.id]})
            </button>
          ))}
        </div>

        {aba === "hoje" && (
          <section className="space-y-3">
            {contatosPendentes.length === 0 && <p className="text-gray-500">Nenhum contato pendente hoje.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contatosPendentes.map((l) => {
                const passo = passoPorLead[l.id] ?? 0;
                const textoAtual = SEQUENCIA_RECUPERACAO[passo].texto.replace("[NOME]", l.nome);
                return (
                  <div key={l.id} className={cartao}>
                    <p className="font-semibold text-gray-900">{l.nome}</p>
                    <p className="text-xs text-gray-500">Etapa: {l.etapa || "—"} · Próximo contato: {formatarData(l.proximaData)}</p>
                    {l.notas && <p className="text-xs text-gray-600 bg-yellow-50 rounded-lg p-2 whitespace-pre-line">📝 {l.notas}</p>}
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
                    <RegistroContato
                      historico={registros[`lead-${l.id}`] || []}
                      onRegistrar={(texto) => registrarContato(`lead-${l.id}`, texto)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {aba === "leads" && (
          <section className="space-y-3">
            {todosLeads.length === 0 && <p className="text-gray-500">Nenhum lead com telefone cadastrado.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todosLeads.map((l) => (
                <div key={l.id} className={cartao}>
                  <p className="font-semibold text-gray-900">{l.nome}</p>
                  <p className="text-xs text-gray-500">
                    Etapa: {l.etapa || "—"} · Próximo contato: {formatarData(l.proximaData)} · {l.telefone}
                  </p>
                  {l.notas && <p className="text-xs text-gray-600 bg-yellow-50 rounded-lg p-2 whitespace-pre-line">📝 {l.notas}</p>}
                  <RegistroContato
                    historico={registros[`lead-${l.id}`] || []}
                    onRegistrar={(texto) => registrarContato(`lead-${l.id}`, texto)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {aba === "pos" && (
          <section className="space-y-3">
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
                  <RegistroContato
                    historico={registros[`pedido-${p.id}`] || []}
                    onRegistrar={(texto) => registrarContato(`pedido-${p.id}`, texto)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {aba === "reativar" && (
          <section className="space-y-3">
            {paraReativar.length === 0 && <p className="text-gray-500">Nenhuma revendedora sem comprar há {DIAS_REATIVACAO}+ dias.</p>}
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
                  <RegistroContato
                    historico={registros[`revenda-${r.id}`] || []}
                    onRegistrar={(texto) => registrarContato(`revenda-${r.id}`, texto)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
