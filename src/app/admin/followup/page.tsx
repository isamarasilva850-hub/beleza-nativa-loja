"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { telefoneWhatsApp } from "@/lib/vitrine";
import {
  criarPlano,
  dataDoPasso,
  passosDeHoje,
  Planos,
  preencherNome,
  Plano,
} from "@/lib/followup";

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
  { id: "planos", rotulo: "📅 Planos" },
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

const dataDoLead = (lead: any) => {
  const ms = Number(lead.id);
  if (!ms || isNaN(ms)) return hojeISO();
  return new Date(ms).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
};

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
  const [planos, setPlanos] = useState<Planos>({});
  const [recebimentoEdicao, setRecebimentoEdicao] = useState<Record<string, string>>({});

  const gravar = (chave: string, valor: unknown) =>
    fetch("/api/crm-dados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave, valor }),
    }).catch((err) => console.error(`Erro ao salvar ${chave}`, err));

  useEffect(() => {
    Promise.all([
      fetch("/api/crm-dados?chave=leads").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/partners").then((r) => r.json()),
      fetch("/api/crm-dados?chave=followup").then((r) => r.json()),
      fetch("/api/crm-dados?chave=planos").then((r) => r.json()),
    ])
      .then(([crm, pedidosDados, parceiros, reg, pl]) => {
        const listaLeads: any[] = Array.isArray(crm.valor) ? crm.valor : [];
        setLeads(listaLeads);
        setPedidos(Array.isArray(pedidosDados) ? pedidosDados : []);
        setRevendedoras(Array.isArray(parceiros) ? parceiros : []);
        setRegistros(reg.valor && typeof reg.valor === "object" && !Array.isArray(reg.valor) ? reg.valor : {});

        const atuais: Planos = pl.valor && typeof pl.valor === "object" && !Array.isArray(pl.valor) ? pl.valor : {};
        const novos: Planos = { ...atuais };
        let mudou = false;
        for (const l of listaLeads) {
          const id = `lead-${l.id}`;
          if (!novos[id] && l.telefone) {
            novos[id] = criarPlano("lead", l.nome, l.telefone, dataDoLead(l));
            mudou = true;
          }
        }
        setPlanos(novos);
        if (mudou) gravar("planos", novos);
      })
      .catch((err) => console.error("Erro ao carregar follow-up", err))
      .finally(() => setCarregando(false));
  }, []);

  const registrarContato = (id: string, texto: string) => {
    const novo: Registro = { data: new Date().toISOString(), texto };
    const atualizado: Registros = { ...registros, [id]: [...(registros[id] || []), novo] };
    setRegistros(atualizado);
    gravar("followup", atualizado);
  };

  const alterarPlanos = (novo: Planos) => {
    setPlanos(novo);
    gravar("planos", novo);
  };

  const marcarPasso = (planoId: string, indice: number) => {
    const plano = planos[planoId];
    const passos = plano.passos.map((p, i) =>
      i === indice ? { ...p, feito: !p.feito, feitoEm: !p.feito ? new Date().toISOString() : undefined } : p
    );
    alterarPlanos({ ...planos, [planoId]: { ...plano, passos } });
  };

  const definirRecebimento = (revenda: any, data: string) => {
    if (!data || !revenda.phone) return;
    const id = `revenda-${revenda.id}`;
    alterarPlanos({ ...planos, [id]: criarPlano("revenda", revenda.company || revenda.name, revenda.phone, data) });
  };

  const hoje = hojeISO();

  const contatosPendentes = leads
    .filter((l) => l.proximaData && l.proximaData <= hoje && l.telefone)
    .sort((a, b) => (a.proximaData < b.proximaData ? -1 : 1));

  const todosLeads = leads
    .filter((l) => l.telefone)
    .sort((a, b) => ((a.proximaData || "9999") < (b.proximaData || "9999") ? -1 : 1));

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

  const listaPlanos = Object.entries(planos)
    .map(([id, plano]) => ({ id, plano, proximo: plano.passos.find((p) => !p.feito) }))
    .sort((a, b) => {
      const da = a.proximo ? dataDoPasso(a.plano, a.proximo) : "9999";
      const db = b.proximo ? dataDoPasso(b.plano, b.proximo) : "9999";
      return da < db ? -1 : 1;
    });

  const passosHoje = passosDeHoje(planos, hoje);
  const passosAtrasados = Object.entries(planos)
    .flatMap(([id, plano]) =>
      plano.passos
        .map((passo, indice) => ({ id, plano, indice, passo, data: dataDoPasso(plano, passo) }))
        .filter((x) => !x.passo.feito && x.data < hoje)
    )
    .sort((a, b) => (a.data < b.data ? -1 : 1))
    .slice(0, 20);

  const planosLeads = listaPlanos.filter((x) => x.plano.tipo === "lead");
  const planosRevenda = listaPlanos.filter((x) => x.plano.tipo === "revenda");

  const cartao = "bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2";
  const botao = "text-center bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold py-2.5 rounded-xl transition-colors";

  const contadores: Record<Aba, number> = {
    hoje: contatosPendentes.length,
    planos: listaPlanos.length,
    leads: todosLeads.length,
    pos: posVenda.length,
    reativar: paraReativar.length,
  };

  const renderPlano = (id: string, plano: Plano) => {
    const pendentes = plano.passos
      .map((p, i) => ({ p, i }))
      .filter((x) => !x.p.feito)
      .slice(0, 6);

    return (
      <div key={id} className={cartao}>
        <div className="flex justify-between items-start gap-2">
          <p className="font-semibold text-gray-900">{plano.nome}</p>
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">
            {plano.tipo === "lead" ? "Lead" : "Revendedora"} · início {formatarData(plano.inicio)}
          </span>
        </div>
        {pendentes.length === 0 && <p className="text-sm text-gray-500">Todos os passos feitos.</p>}
        <div className="space-y-2">
          {pendentes.map(({ p, i }) => {
            const data = dataDoPasso(plano, p);
            const texto = preencherNome(p.mensagem, plano.nome);
            const vencido = data < hoje;
            return (
              <div key={i} className={`rounded-xl border p-3 space-y-2 ${vencido ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"}`}>
                <div className="flex justify-between text-xs text-gray-600">
                  <span className="font-bold">{p.titulo}</span>
                  <span>{formatarData(data)}{vencido ? " · atrasado" : ""}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">{texto}</p>
                <div className="flex gap-2">
                  <a href={linkWhats(plano.telefone, texto)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-[#25D366] hover:bg-[#1ebe5b] text-white text-sm font-bold py-2 rounded-lg">
                    Chamar
                  </a>
                  <button type="button" onClick={() => marcarPasso(id, i)} className="flex-1 text-sm font-bold py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
                    ✓ Feito
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <RegistroContato historico={registros[id] || []} onRegistrar={(t) => registrarContato(id, t)} />
      </div>
    );
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
          <p className="text-gray-600 mt-1">Tudo em um lugar: planos de contato, histórico de cada pessoa e pós-venda.</p>
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
          <section className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-800">✅ Para fazer hoje ({passosHoje.length})</h2>
              {passosHoje.length === 0 && <p className="text-gray-500">Nada para fazer hoje nos planos.</p>}
              {passosHoje.map((x) => {
                const texto = preencherNome(x.passo.mensagem, x.plano.nome);
                return (
                  <div key={`${x.id}-${x.indice}`} className={cartao}>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="font-bold">{x.plano.nome} · {x.plano.tipo === "lead" ? "Lead" : "Revendedora"}</span>
                      <span>{x.passo.titulo}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{texto}</p>
                    <div className="flex gap-2">
                      <a href={linkWhats(x.plano.telefone, texto)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-[#25D366] hover:bg-[#1ebe5b] text-white text-sm font-bold py-2 rounded-lg">
                        Chamar
                      </a>
                      <button type="button" onClick={() => marcarPasso(x.id, x.indice)} className="flex-1 text-sm font-bold py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
                        ✓ Feito
                      </button>
                    </div>
                    <RegistroContato
                      historico={registros[x.id] || []}
                      onRegistrar={(t) => registrarContato(x.id, t)}
                    />
                  </div>
                );
              })}
            </div>

            {passosAtrasados.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-red-700">⚠️ Atrasados ({passosAtrasados.length})</h2>
                {passosAtrasados.map((x) => {
                  const texto = preencherNome(x.passo.mensagem, x.plano.nome);
                  return (
                    <div key={`${x.id}-${x.indice}`} className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span className="font-bold">{x.plano.nome} · {formatarData(x.data)}</span>
                        <span>{x.passo.titulo}</span>
                      </div>
                      <div className="flex gap-2">
                        <a href={linkWhats(x.plano.telefone, texto)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-[#25D366] hover:bg-[#1ebe5b] text-white text-sm font-bold py-2 rounded-lg">
                          Chamar
                        </a>
                        <button type="button" onClick={() => marcarPasso(x.id, x.indice)} className="flex-1 text-sm font-bold py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
                          ✓ Feito
                        </button>
                      </div>
                      <RegistroContato
                        historico={registros[x.id] || []}
                        onRegistrar={(t) => registrarContato(x.id, t)}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-800">Contatos do CRM ({contatosPendentes.length})</h2>
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
            </div>
          </section>
        )}

        {aba === "planos" && (
          <section className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-800">📋 Planos de leads ({planosLeads.length})</h2>
              <p className="text-sm text-gray-500">Começam sozinhos quando o lead entra no CRM.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planosLeads.map((x) => renderPlano(x.id, x.plano))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-800">🛍️ Planos de revendedoras</h2>
              <p className="text-sm text-gray-500">Informe a data em que ela recebeu a mercadoria. Os contatos são contados a partir dessa data.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {revendedoras.map((r) => {
                  const id = `revenda-${r.id}`;
                  const temPlano = !!planos[id];
                  return (
                    <div key={r.id} className={cartao}>
                      <p className="font-semibold text-gray-900">{r.company || r.name}</p>
                      <div className="flex gap-2 items-center">
                        <input
                          type="date"
                          value={recebimentoEdicao[r.id] ?? (temPlano ? planos[id].inicio : "")}
                          onChange={(e) => setRecebimentoEdicao({ ...recebimentoEdicao, [r.id]: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => definirRecebimento(r, recebimentoEdicao[r.id] || "")}
                          className="px-4 py-2 rounded-lg text-sm font-bold bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white"
                        >
                          Salvar
                        </button>
                      </div>
                      {temPlano && <p className="text-xs text-gray-500">Plano ativo desde {formatarData(planos[id].inicio)}</p>}
                    </div>
                  );
                })}
              </div>
              {planosRevenda.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {planosRevenda.map((x) => renderPlano(x.id, x.plano))}
                </div>
              )}
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
