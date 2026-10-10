"use client";

import { useEffect, useState } from "react";
import CRMMetodoBN from "@/components/CRMMetodoBN";
import FollowupPage from "../followup/page";
import { passosDeHoje, dataDoPasso, Planos } from "@/lib/followup";

export default function CRM() {
  const [visao, setVisao] = useState<"crm" | "followup">("crm");
  const [acoesHoje, setAcoesHoje] = useState(0);

  useEffect(() => {
    fetch("/api/crm-dados?chave=planos")
      .then((r) => r.json())
      .then((dados) => {
        const planos: Planos = dados.valor && typeof dados.valor === "object" && !Array.isArray(dados.valor) ? dados.valor : {};
        const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
        const hojeCount = passosDeHoje(planos, hoje).length;
        const atrasados = Object.values(planos).reduce(
          (total, plano) => total + plano.passos.filter((p) => !p.feito && dataDoPasso(plano, p) < hoje).length,
          0
        );
        setAcoesHoje(hojeCount + atrasados);
      })
      .catch((err) => console.error("Erro ao contar ações", err));
  }, []);

  return (
    <div>
      <div className="flex gap-2 p-4 bg-white border-b border-gray-200">
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
      </div>
      {visao === "crm" ? <CRMMetodoBN /> : <FollowupPage />}
    </div>
  );
}
