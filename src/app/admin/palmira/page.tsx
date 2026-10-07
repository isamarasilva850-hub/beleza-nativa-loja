"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PalmiraDashboard() {
  // Dashboard principal da Palmira com ferramentas de gestão
  const [productCount, setProductCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [updatingGenders, setUpdatingGenders] = useState(false);
  const [genderUpdateMessage, setGenderUpdateMessage] = useState("");

  useEffect(() => {
    const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
    setProductCount(uploads.length);
  }, []);

  const syncToSupabase = async () => {
    setSyncing(true);
    setSyncMessage("🔄 Sincronizando com Supabase...");
    try {
      const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");

      if (uploads.length === 0) {
        setSyncMessage("❌ Nenhum produto para sincronizar!");
        setTimeout(() => setSyncMessage(""), 3000);
        setSyncing(false);
        return;
      }

      // Step 1: Sync to Supabase
      const supabaseResponse = await fetch("/api/sync-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: uploads }),
      });

      if (!supabaseResponse.ok) {
        throw new Error("Erro ao sincronizar com Supabase");
      }

      setSyncMessage("📤 Enviando para GitHub...");

      // Step 2: Sync to GitHub
      const githubResponse = await fetch("/api/sync-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: uploads }),
      });

      if (!githubResponse.ok) {
        throw new Error("Erro ao sincronizar com GitHub");
      }

      const githubResult = await githubResponse.json();
      setSyncMessage(`✅ ${uploads.length} produtos sincronizados! Commit: ${githubResult.commit?.substring(0, 7) || "ok"}`);
      setTimeout(() => setSyncMessage(""), 4000);
    } catch (err: any) {
      setSyncMessage(`❌ Erro: ${err.message}`);
      setTimeout(() => setSyncMessage(""), 4000);
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdateGenders = async () => {
    try {
      setUpdatingGenders(true);
      setGenderUpdateMessage("");

      const response = await fetch("/api/admin/atualizar-generos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      if (response.ok) {
        const data = await response.json();
        setGenderUpdateMessage(`✅ Atualizado! ${data.updated.infantil} Infantil, ${data.updated.masculino} Masculino, ${data.updated.feminino} Feminino`);
      } else {
        setGenderUpdateMessage("❌ Erro ao atualizar gêneros");
      }
    } catch (err) {
      setGenderUpdateMessage("❌ Erro na atualização");
      console.error(err);
    } finally {
      setUpdatingGenders(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">👩‍💼 Painel da Palmira</h1>
          <p className="text-gray-600 mt-2">Gerencie produtos e pedidos de forma simples</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-blue-800 font-medium">💡 Dica: Comece pelo Upload de Produtos para adicionar novas peças com múltiplas fotos!</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-amber-800 font-medium">🔄 Sincronização com Supabase</p>
            <p className="text-xs text-amber-700 mt-1">Envie seus produtos para o banco de dados ({productCount} produtos pendentes)</p>
            {syncMessage && <p className="text-xs text-amber-900 mt-1 font-semibold">{syncMessage}</p>}
          </div>
          <button
            onClick={syncToSupabase}
            disabled={syncing || productCount === 0}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              syncing || productCount === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            {syncing ? "⏳ Sincronizando..." : "🚀 Sincronizar Agora"}
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-900 font-medium mb-2">🏷️ Atualizar Classificação de Produtos</p>
              <p className="text-xs text-purple-800">Clique para categorizar os produtos como Infantil, Masculino ou Feminino</p>
              {genderUpdateMessage && (
                <p className="text-sm mt-2 font-semibold">{genderUpdateMessage}</p>
              )}
            </div>
            <button
              onClick={handleUpdateGenders}
              disabled={updatingGenders}
              className="ml-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              {updatingGenders ? "⏳ Atualizando..." : "✨ Atualizar"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Link href="/admin/palmira/upload" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-blue-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">📸 Upload</h3>
                <p className="text-sm text-gray-600 mt-1">Adicione produtos com fotos</p>
              </div>
              <div className="text-4xl">📤</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-blue-500">✓</span><span>Múltiplas fotos por produto</span></div>
              <div className="flex items-center gap-2"><span className="text-blue-500">✓</span><span>Preço, tamanhos e cores</span></div>
              <div className="flex items-center gap-2"><span className="text-blue-500">✓</span><span>Sincronização automática</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-blue-600 font-semibold text-sm">Clique para fazer upload →</div>
          </Link>

          <Link href="/admin/palmira/produtos" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-purple-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">📦 Produtos</h3>
                <p className="text-sm text-gray-600 mt-1">Veja todos os produtos</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-purple-500">✓</span><span>Galeria com miniaturas</span></div>
              <div className="flex items-center gap-2"><span className="text-purple-500">✓</span><span>Pesquisa por referência</span></div>
              <div className="flex items-center gap-2"><span className="text-purple-500">✓</span><span>Total: {productCount} produtos</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-purple-600 font-semibold text-sm">Clique para visualizar →</div>
          </Link>

          <Link href="/admin/palmira/estoque" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-green-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">📊 Estoque</h3>
                <p className="text-sm text-gray-600 mt-1">Controle de quantidade</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Total de peças em estoque</span></div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Alerta de baixo estoque</span></div>
              <div className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Ordenar por quantidade</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-green-600 font-semibold text-sm">Clique para acompanhar →</div>
          </Link>


          <Link href="/admin/palmira/reordenar-produtos" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-orange-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">🔄 Reordenar</h3>
                <p className="text-sm text-gray-600 mt-1">Ordem na loja</p>
              </div>
              <div className="text-4xl">📍</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-orange-500">✓</span><span>Arraste os produtos</span></div>
              <div className="flex items-center gap-2"><span className="text-orange-500">✓</span><span>Define ordem na loja</span></div>
              <div className="flex items-center gap-2"><span className="text-orange-500">✓</span><span>Salva automaticamente</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-orange-600 font-semibold text-sm">Clique para reordenar →</div>
          </Link>

          <Link href="/admin/palmira/visualizar-loja" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-indigo-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">👀 Prévia Loja</h3>
                <p className="text-sm text-gray-600 mt-1">Como aparecem os produtos</p>
              </div>
              <div className="text-4xl">🏪</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-indigo-500">✓</span><span>Veja ordem exata</span></div>
              <div className="flex items-center gap-2"><span className="text-indigo-500">✓</span><span>Filtro por categoria</span></div>
              <div className="flex items-center gap-2"><span className="text-indigo-500">✓</span><span>Prévia em tempo real</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-indigo-600 font-semibold text-sm">Clique para visualizar →</div>
          </Link>

          <Link href="/admin/palmira/editar-produto" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-red-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">✏️ Editar Produto</h3>
                <p className="text-sm text-gray-600 mt-1">Mudar cores e fotos</p>
              </div>
              <div className="text-4xl">🔧</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-red-500">✓</span><span>Buscar por REF</span></div>
              <div className="flex items-center gap-2"><span className="text-red-500">✓</span><span>Editar cores/qty</span></div>
              <div className="flex items-center gap-2"><span className="text-red-500">✓</span><span>Deletar fotos</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-red-600 font-semibold text-sm">Clique para editar →</div>
          </Link>

          <Link href="/admin/palmira/corrigir-precos" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-yellow-500 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">💰 Corrigir Preços</h3>
                <p className="text-sm text-gray-600 mt-1">Atualizar valores</p>
              </div>
              <div className="text-4xl">💵</div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><span className="text-yellow-500">✓</span><span>Buscar por REF</span></div>
              <div className="flex items-center gap-2"><span className="text-yellow-500">✓</span><span>Editar preço</span></div>
              <div className="flex items-center gap-2"><span className="text-yellow-500">✓</span><span>Salva na loja</span></div>
            </div>
            <div className="pt-4 border-t border-gray-100 text-yellow-600 font-semibold text-sm">Clique para corrigir →</div>
          </Link>
        </div>

        <div className="mt-8 bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">📦 Montar Pedido Rápido</h3>
              <p className="text-sm opacity-90 mt-1">Crie pedidos em segundos e envie pelo WhatsApp</p>
            </div>
            <Link href="/admin/montar-pedido" className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-lg transition-colors">Acessar →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
