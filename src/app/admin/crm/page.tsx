"use client";

import { useEffect, useRef, useState } from "react";
import CRMMetodoBN from "@/components/CRMMetodoBN";
import FollowupPage from "../followup/page";
import { passosDeHoje, dataDoPasso, Planos } from "@/lib/followup";

const CHAVES_BACKUP = ["leads", "followup", "planos", "metas", "mensagens"];

export default function CRM() {
  const [visao, setVisao] = useState<"crm" | "followup">("crm");
  const [acoesHoje, setAcoesHoje] = useState(0);
  const [outraAbaAberta, setOutraAbaAberta] = useState(false);
  const idAba = useRef(Math.random().toString(36).slice(2));

  useEffect(() => {
    fetch("/api/crm-dados?chave=planos")
      .then((r) => r.json())
      .then((dados) => {
        const planos: Planos = dados.valor && typeof dados.valor === "object" && !Array.isArray(dados.valor) ? dados.valor : {};
        const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
        const hojeCount = passosDeHoje(planos, hoje).length;
        const atrasados = Object.values(planos).filter((plano) => {
          const proximo = plano.passos.find((p) => !p.feito);
          return !!proximo && dataDoPasso(plano, proximo) < hoje;
        }).length;
        setAcoesHoje(hojeCount + atrasados);
      })
      .catch((err) => console.error("Erro ao contar ações", err));
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const canal = new BroadcastChannel("crm-presenca");
    const vistos: Record<string, number> = {};
    const atualizar = () => {
      const agora = Date.now();
      const ativos = Object.keys(vistos).filter((k) => agora - vistos[k] < 5000 || k === idAba.current);
      setOutraAbaAberta(ativos.length > 1);
    };
    canal.onmessage = (e) => {
      vistos[e.data] = Date.now();
      atualizar();
    };
    const batida = setInterval(() => {
      vistos[idAba.current] = Date.now();
      canal.postMessage(idAba.current);
      atualizar();
    }, 2000);
    return () => {
      clearInterval(batida);
      canal.close();
    };
  }, []);

  const baixarBackup = async () => {
    const backup: Record<string, unknown> = { gerado_em: new Date().toISOString() };
    for (const chave of CHAVES_BACKUP) {
      const r = await fetch(`/api/crm-dados?chave=${chave}`);
      const dados = await r.json();
      backup[chave] = dados.valor ?? null;
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `backup-crm-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div>
      {outraAbaAberta && (
        <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm font-bold px-4 py-2 text-center">
          ⚠️ O CRM está aberto em outra aba ou computador. Feche uma delas para não perder anotações.
        </div>
      )}
      <div className="flex gap-2 p-4 bg-white border-b border-gray-200 items-center">
        <button
          type="button"
          onClick={() => setVisao("crm")}
          className={`px-5 py-2 rounded-lg font-bold ${visao === "crm" ? "bg-[#7BC9C2] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          📊 CRM
        </button>
        <button
          type="button"
          onClick={() => setVisao("followup")}
          className={`px-5 py-2 rounded-lg font-bold flex items-center gap-2 ${visao === "followup" ? "bg-[#7BC9C2] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          🔁 Follow-up e pós-venda
          {acoesHoje > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{acoesHoje}</span>
          )}
        </button>
        <button
          type="button"
          onClick={baixarBackup}
          className="ml-auto px-4 py-2 rounded-lg font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
        >
          💾 Baixar backup
        </button>
      </div>
      {visao === "crm" ? <CRMMetodoBN /> : <FollowupPage />}
    </div>
  );
}
