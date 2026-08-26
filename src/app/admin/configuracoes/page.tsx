"use client";

import { useState, useEffect } from "react";

interface Config {
  storeName: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  minOrderWholesale: number;
  freeShippingAbove: number;
  priceMultiplier: number;
  instagram: string;
  facebook: string;
  workingHours: string;
  welcomeMessage: string;
  orderConfirmMessage: string;
}

const defaultConfig: Config = {
  storeName: "Beleza Nativa - Lingerie e Moda Praia",
  cnpj: "",
  phone: "(35) 99210-0072",
  whatsapp: "5535992100072",
  email: "contato@belezanativa.com.br",
  address: "",
  city: "",
  state: "MG",
  cep: "",
  minOrderWholesale: 300,
  freeShippingAbove: 500,
  priceMultiplier: 2,
  instagram: "@belezanativa",
  facebook: "",
  workingHours: "Seg a Sex: 08h às 18h / Sáb: 08h às 12h",
  welcomeMessage: "Olá! Bem-vinda à Beleza Nativa! Como posso ajudar?",
  orderConfirmMessage: "Seu pedido foi recebido com sucesso! Em breve entraremos em contato.",
};

export default function Configuracoes() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("belezanativa_config");
    if (stored) setConfig(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    localStorage.setItem("belezanativa_config", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: keyof Config, value: string | number) => setConfig((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Configurações Gerais</h1>
        <button onClick={handleSave} className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${saved ? "bg-green-500 text-white" : "bg-[#7BC9C2] text-white hover:bg-[#6ab8b1]"}`}>
          {saved ? "Salvo!" : "Salvar Configurações"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#7BC9C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          Dados da Loja
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Nome da Loja</label>
            <input value={config.storeName} onChange={(e) => update("storeName", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">CNPJ</label>
            <input value={config.cnpj} onChange={(e) => update("cnpj", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Telefone</label>
            <input value={config.phone} onChange={(e) => update("phone", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp (número completo)</label>
            <input value={config.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">E-mail</label>
            <input value={config.email} onChange={(e) => update("email", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#7BC9C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Endereço
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Endereço</label>
            <input value={config.address} onChange={(e) => update("address", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Cidade</label>
            <input value={config.city} onChange={(e) => update("city", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
            <input value={config.state} onChange={(e) => update("state", e.target.value)} maxLength={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">CEP</label>
            <input value={config.cep} onChange={(e) => update("cep", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#7BC9C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Comercial
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Pedido Mínimo Atacado (R$)</label>
            <input type="number" value={config.minOrderWholesale} onChange={(e) => update("minOrderWholesale", Number(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Frete Grátis Acima de (R$)</label>
            <input type="number" value={config.freeShippingAbove} onChange={(e) => update("freeShippingAbove", Number(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Multiplicador Atacado → Varejo</label>
            <input type="number" step="0.1" value={config.priceMultiplier} onChange={(e) => update("priceMultiplier", Number(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#7BC9C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          Redes Sociais
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Instagram</label>
            <input value={config.instagram} onChange={(e) => update("instagram", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Facebook</label>
            <input value={config.facebook} onChange={(e) => update("facebook", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#7BC9C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Mensagens Automáticas
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Horário de Funcionamento</label>
            <input value={config.workingHours} onChange={(e) => update("workingHours", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Mensagem de Boas-Vindas</label>
            <textarea value={config.welcomeMessage} onChange={(e) => update("welcomeMessage", e.target.value)} rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Mensagem de Confirmação de Pedido</label>
            <textarea value={config.orderConfirmMessage} onChange={(e) => update("orderConfirmMessage", e.target.value)} rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] resize-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
