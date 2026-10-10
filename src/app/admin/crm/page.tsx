"use client";

import { useState } from "react";
import CRMMetodoBN from "@/components/CRMMetodoBN";
import FollowupPage from "../followup/page";

export default function CRM() {
  const [visao, setVisao] = useState<"crm" | "followup">("crm");

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
          className={`px-5 py-2 rounded-lg font-bold ${visao === "followup" ? "bg-[#7BC9C2] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          🔁 Follow-up e pós-venda
        </button>
      </div>
      {visao === "crm" ? <CRMMetodoBN /> : <FollowupPage />}
    </div>
  );
}
