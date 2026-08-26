"use client";

import { useState } from "react";
import { products } from "@/data/products";

export default function CatalogoDigital() {
  const [copied, setCopied] = useState(false);
  const catalogUrl = typeof window !== "undefined" ? `${window.location.origin}` : "https://belezanativaloja.com.br";

  const copyLink = () => {
    navigator.clipboard.writeText(catalogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = (msg: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const totalProducts = products.length;
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Catálogo Digital</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#7BC9C2]/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#7BC9C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Link do Catálogo</h2>
              <p className="text-xs text-gray-500">Compartilhe com suas clientes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input readOnly value={catalogUrl} className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600" />
            <button onClick={copyLink} className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${copied ? "bg-green-500 text-white" : "bg-[#7BC9C2] text-white hover:bg-[#6ab8b1]"}`}>
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => shareWhatsApp(`Olá! Confira nosso catálogo de Lingerie e Moda Praia: ${catalogUrl}`)}
              className="flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              WhatsApp
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(`Olá! Confira nosso catálogo de Lingerie e Moda Praia: ${catalogUrl}`); alert("Mensagem copiada!"); }}
              className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              Copiar Msg
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Resumo do Catálogo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#7BC9C2]">{totalProducts}</p>
              <p className="text-xs text-gray-500 mt-1">Produtos Ativos</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#7BC9C2]">{categories.length}</p>
              <p className="text-xs text-gray-500 mt-1">Categorias</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase">Categorias Disponíveis</h3>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <span key={cat} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{cat}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-4">Envio por Categoria</h2>
        <p className="text-sm text-gray-500 mb-4">Envie links específicos por categoria para suas clientes</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => shareWhatsApp(`Confira nossa coleção de ${cat}: ${catalogUrl}`)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">{cat}</p>
                  <p className="text-xs text-gray-400">{count} produtos</p>
                </div>
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
