"use client";

import Link from "next/link";
import { useState } from "react";

interface ColorInput {
  id: string;
  name: string;
  hex: string;
  qty_p: string;
  qty_m: string;
  qty_g: string;
  qty_gg: string;
}

export default function PalmiraUploadPage() {
  const [formData, setFormData] = useState({
    ref: "",
    name: "",
    price: "",
    gender: "Feminino",
  });

  const [colors, setColors] = useState<ColorInput[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteRef, setDeleteRef] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [foundProduct, setFoundProduct] = useState<any>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loadingSearchExisting, setLoadingSearchExisting] = useState(false);
  const [activeTab, setActiveTab] = useState("criar");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);

  const optimizeImage = (imgBase64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0, 800, 800);
        resolve(canvas.toDataURL("image/webp", 0.85));
      };
      img.src = imgBase64;
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      const newPreviews: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = async (event) => {
          const result = event.target?.result as string;
          const optimized = await optimizeImage(result);
          newImages.push(optimized);
          newPreviews.push(optimized);

          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
            setPreviews([...previews, ...newPreviews]);
            setSuccess(`✅ ${newImages.length} foto(s) adicionada(s)!`);
            setTimeout(() => setSuccess(""), 2000);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const addColor = () => {
    setColors([
      ...colors,
      {
        id: `color_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: "",
        hex: "#000000",
        qty_p: "",
        qty_m: "",
        qty_g: "",
        qty_gg: "",
      },
    ]);
  };

  const removeColor = (id: string) => {
    setColors(colors.filter((c) => c.id !== id));
  };

  const updateColor = (id: string, field: string, value: string) => {
    setColors(
      colors.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSearchProduct = async () => {
    setError("");
    setSuccess("");
    setLoadingSearch(true);

    try {
      if (!deleteRef.trim()) {
        throw new Error("❌ Digite a REF do produto!");
      }

      const res = await fetch("/api/products");
      const products = await res.json();
      const product = products.find((p: any) => p.ref === deleteRef);

      if (!product) {
        throw new Error(`❌ Produto com REF "${deleteRef}" não encontrado`);
      }

      setFoundProduct(product);
    } catch (err: any) {
      setError(err.message);
      setFoundProduct(null);
    } finally {
      setLoadingSearch(false);
    }
  };

  const loadAllProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      const products = await res.json();
      setAllProducts(products);
    } catch (err) {
      setError("❌ Erro ao carregar produtos");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearchExistingProduct = async () => {
    setError("");
    setSuccess("");
    setLoadingSearchExisting(true);

    try {
      if (!formData.ref.trim()) {
        throw new Error("❌ Digite a REF do produto para editar!");
      }

      const res = await fetch("/api/products");
      const products = await res.json();
      const product = products.find((p: any) => p.ref === formData.ref);

      if (!product) {
        throw new Error(`❌ Produto com REF "${formData.ref}" não encontrado. Deixaremos em branco para criar novo.`);
      }

      setEditMode(true);
      setFormData({
        ref: product.ref,
        name: product.name,
        price: product.price?.toString() || "",
        gender: product.gender || "Feminino",
      });
      setSuccess(`✅ Produto "${product.name}" carregado! Adicione mais fotos/cores.`);
    } catch (err: any) {
      setError(err.message);
      setEditMode(false);
    } finally {
      setLoadingSearchExisting(false);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoadingDelete(true);

    try {
      if (!deleteRef.trim()) {
        throw new Error("❌ Digite a REF do produto para deletar!");
      }

      const response = await fetch("/api/admin/delete-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: deleteRef }),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || "Erro ao deletar");
        } catch (parseErr) {
          throw new Error(`Erro ao deletar: ${response.status} ${response.statusText}`);
        }
      }

      setSuccess(`🗑️ Produto "${deleteRef}" deletado com sucesso!`);
      setDeleteRef("");
      setFoundProduct(null);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!formData.ref || !formData.name || !formData.price) {
        throw new Error("❌ Preencha REF, Nome e Preço!");
      }

      if (colors.length === 0) {
        throw new Error("❌ Adicione pelo menos uma cor!");
      }

      if (images.length === 0) {
        throw new Error("❌ Adicione pelo menos uma foto!");
      }

      const hasQty = colors.some(
        (c) =>
          parseInt(c.qty_p) > 0 ||
          parseInt(c.qty_m) > 0 ||
          parseInt(c.qty_g) > 0 ||
          parseInt(c.qty_gg) > 0
      );

      if (!hasQty) {
        throw new Error("❌ Adicione quantidade para pelo menos um tamanho!");
      }

      const productData = {
        ref: formData.ref,
        name: formData.name,
        price: formData.price,
        gender: formData.gender,
        colors: colors.map((c) => ({
          name: c.name,
          hex: c.hex,
          qty_p: c.qty_p,
          qty_m: c.qty_m,
          qty_g: c.qty_g,
          qty_gg: c.qty_gg,
        })),
        images,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || "Erro ao salvar");
        } catch (parseErr) {
          throw new Error(`Erro ao salvar: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      setSuccess(`✅ Produto "${formData.name}" salvo com sucesso! ID: ${data.id}`);
      setFormData({ ref: "", name: "", price: "", gender: "Feminino" });
      setColors([]);
      setImages([]);
      setPreviews([]);

      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
          ← Voltar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Gerenciar Produtos</h1>
        <p className="text-gray-600 mb-8">Um painel para tudo!</p>

        {/* Abas */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setActiveTab("listar");
              loadAllProducts();
            }}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === "listar"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            📋 Meus Produtos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("criar")}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === "criar"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            📦 Criar Produto
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("editar")}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === "editar"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ✏️ Editar Produto
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preco")}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === "preco"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            💰 Corrigir Preço
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("deletar")}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === "deletar"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🗑️ Deletar Produto
          </button>
        </div>

        <div className="space-y-8 bg-white rounded-xl shadow-sm p-8">
          {/* TAB: Listar Produtos */}
          {activeTab === "listar" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Meus Produtos</h2>
                <input
                  type="text"
                  placeholder="🔍 Buscar por REF, nome ou categoria..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 mb-4"
                />
              </div>

              {loadingProducts ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">⏳ Carregando produtos...</p>
                </div>
              ) : allProducts.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">📭 Nenhum produto encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-gray-800">REF</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800">Nome</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800">Preço</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800">Cores</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800">Fotos</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-800">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allProducts
                        .filter(
                          (p) =>
                            p.ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono font-bold text-gray-900">{product.ref}</td>
                            <td className="px-4 py-3 text-gray-700">{product.name}</td>
                            <td className="px-4 py-3 font-bold text-green-600">R$ {product.price?.toFixed(2).replace(".", ",")}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                                {product.variants?.length || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                                {product.images?.length || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab("editar");
                                    setFormData({
                                      ref: product.ref,
                                      name: product.name,
                                      price: product.price?.toString() || "",
                                      gender: product.gender || "Feminino",
                                    });
                                    setEditMode(true);
                                    setSuccess(`✅ Produto "${product.name}" carregado! Adicione mais fotos/cores.`);
                                  }}
                                  className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded font-bold"
                                >
                                  ✏️
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeleteRef(product.ref);
                                    setActiveTab("deletar");
                                    handleSearchProduct();
                                  }}
                                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                💡 Total: <strong>{allProducts.length} produtos</strong> | Mostrando: <strong>{allProducts.filter((p) =>
                  p.ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.name?.toLowerCase().includes(searchQuery.toLowerCase())
                ).length}</strong>
              </div>
            </div>
          )}

          {/* TAB: Criar Produto */}
          {activeTab === "criar" && (
            <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados do Produto */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Dados do Produto</h2>
            <div className="mb-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Referência (ex: REF001)"
                  value={formData.ref}
                  onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                />
                <button
                  type="button"
                  onClick={handleSearchExistingProduct}
                  disabled={loadingSearchExisting || !formData.ref.trim()}
                  className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                >
                  {loadingSearchExisting ? "🔍 Buscando..." : "🔍 Buscar Existente"}
                </button>
              </div>
              {editMode && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="text-sm text-green-700 font-semibold">✅ Modo edição ativado! Adicione mais fotos/cores abaixo.</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nome do produto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Preço (ex: 50.00)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              >
                <option value="Feminino">👧 Feminino</option>
                <option value="Masculino">👨 Masculino</option>
                <option value="Infantil">👶 Infantil</option>
              </select>
            </div>
          </div>

          {/* Cores e Estoque */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">🎨 Cores e Estoque</h2>
              <button
                type="button"
                onClick={addColor}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                + Adicionar Cor
              </button>
            </div>

            {colors.length === 0 ? (
              <p className="text-gray-500 text-sm">Clique em "Adicionar Cor" para começar</p>
            ) : (
              <div className="space-y-4">
                {colors.map((color) => (
                  <div key={color.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 flex-1">
                        <input
                          type="text"
                          placeholder="Nome da cor"
                          value={color.name}
                          onChange={(e) => updateColor(color.id, "name", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                        />
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => updateColor(color.id, "hex", e.target.value)}
                          className="w-14 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeColor(color.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg ml-2"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {["P", "M", "G", "GG"].map((size) => (
                        <div key={size} className="flex flex-col">
                          <label className="text-xs font-bold text-gray-700 mb-1">{size}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={color[`qty_${size.toLowerCase()}` as keyof ColorInput] || ""}
                            onChange={(e) =>
                              updateColor(color.id, `qty_${size.toLowerCase()}`, e.target.value)
                            }
                            className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-[#7BC9C2]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fotos */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">📷 Fotos</h2>
            <p className="text-sm text-gray-600 mb-3 bg-blue-50 p-3 rounded-lg">
              💡 <strong>Dica:</strong> Você pode selecionar VÁRIAS fotos de uma vez! Clique uma vez e selecione todas!
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#7BC9C2] transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageInput"
              />
              <label htmlFor="imageInput" className="cursor-pointer block">
                <div className="text-4xl mb-2">📸</div>
                <p className="font-bold text-gray-700">Clique ou arraste fotos</p>
                <p className="text-xs text-gray-500">Quantas quiser!</p>
              </label>
            </div>

            {previews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-bold text-gray-700 mb-3">{previews.length} foto(s)</p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mensagens */}
          {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7BC9C2] hover:bg-[#5fb3ac] disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? "⏳ Salvando..." : "✅ SALVAR PRODUTO"}
          </button>
            </form>
          )}

          {/* TAB: Editar Produto */}
          {activeTab === "editar" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Buscar Produto Existente</h2>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Digite a REF do produto (ex: REF001)"
                    value={formData.ref}
                    onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleSearchExistingProduct}
                    disabled={loadingSearchExisting || !formData.ref.trim()}
                    className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {loadingSearchExisting ? "🔍 Buscando..." : "🔍 BUSCAR"}
                  </button>
                </div>

                {editMode && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
                    <p className="text-sm text-green-700 font-semibold">✅ Produto carregado! Agora você pode:</p>
                    <ul className="text-sm text-green-700 mt-2 space-y-1 ml-4">
                      <li>✓ Adicionar mais cores</li>
                      <li>✓ Adicionar mais fotos</li>
                      <li>✓ Editar preço</li>
                    </ul>
                  </div>
                )}

                {editMode && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-1">Nome</p>
                        <p className="text-lg font-bold text-gray-900">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-1">Preço</p>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-1">Gênero</p>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                        >
                          <option value="Feminino">👧 Feminino</option>
                          <option value="Masculino">👨 Masculino</option>
                          <option value="Infantil">👶 Infantil</option>
                        </select>
                      </div>
                    </div>

                    {/* Adicionar Cores */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">🎨 Cores e Estoque</h3>
                        <button
                          type="button"
                          onClick={addColor}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                        >
                          + Cor
                        </button>
                      </div>

                      {colors.length === 0 ? (
                        <p className="text-gray-500 text-sm">Clique em "+ Cor" para adicionar cores ao produto</p>
                      ) : (
                        <div className="space-y-4">
                          {colors.map((color) => (
                            <div key={color.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="flex gap-4 flex-1">
                                  <input
                                    type="text"
                                    placeholder="Nome da cor"
                                    value={color.name}
                                    onChange={(e) => updateColor(color.id, "name", e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                  />
                                  <input
                                    type="color"
                                    value={color.hex}
                                    onChange={(e) => updateColor(color.id, "hex", e.target.value)}
                                    className="w-14 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeColor(color.id)}
                                  className="text-red-500 hover:text-red-700 font-bold text-lg ml-2"
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="grid grid-cols-4 gap-2">
                                {["P", "M", "G", "GG"].map((size) => (
                                  <div key={size} className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-700 mb-1">{size}</label>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="0"
                                      value={color[`qty_${size.toLowerCase()}` as keyof ColorInput] || ""}
                                      onChange={(e) =>
                                        updateColor(color.id, `qty_${size.toLowerCase()}`, e.target.value)
                                      }
                                      className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-purple-500"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Adicionar Fotos */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">📷 Fotos</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="editImageInput"
                        />
                        <label htmlFor="editImageInput" className="cursor-pointer block">
                          <div className="text-4xl mb-2">📸</div>
                          <p className="font-bold text-gray-700">Clique para adicionar fotos</p>
                          <p className="text-xs text-gray-500">Quantas quiser!</p>
                        </label>
                      </div>

                      {previews.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-bold text-gray-700 mb-3">{previews.length} foto(s)</p>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {previews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mensagens */}
                    {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                    {/* Botão Salvar Edição */}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      {loading ? "⏳ Salvando..." : "✅ SALVAR EDIÇÕES"}
                    </button>
                  </>
                )}

                {/* Mensagens */}
                {success && !editMode && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
              </div>
            </div>
          )}

          {/* TAB: Corrigir Preço */}
          {activeTab === "preco" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800">💰 Corrigir Preço</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Digite a REF do produto"
                  value={deleteRef}
                  onChange={(e) => setDeleteRef(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                />
                <button
                  type="button"
                  onClick={handleSearchProduct}
                  disabled={loadingSearch || !deleteRef.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                >
                  {loadingSearch ? "🔍 Buscando..." : "🔍 BUSCAR"}
                </button>
              </div>

              {foundProduct && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <p className="font-bold text-gray-800 mb-3">✅ Produto encontrado:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-bold text-gray-700">Nome</p>
                      <p className="text-gray-900 font-semibold">{foundProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">REF</p>
                      <p className="text-gray-900 font-semibold">{foundProduct.ref}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">Preço Atual</p>
                      <p className="text-lg font-black text-yellow-600">R$ {foundProduct.price?.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>

                  {foundProduct.images && foundProduct.images.length > 0 && (
                    <div className="mb-4">
                      <img src={foundProduct.images[0]} alt={foundProduct.name} className="w-32 h-32 object-cover rounded" />
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Novo Preço:</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder={foundProduct.price?.toString()}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 text-lg font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPrice = formData.price;
                          if (newPrice && newPrice !== foundProduct.price?.toString()) {
                            setFormData({ ...foundProduct, price: newPrice });
                            handleSubmit({ preventDefault: () => {} } as any);
                          }
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                      >
                        💾 ATUALIZAR
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            </div>
          )}

          {/* TAB: Deletar Produto */}
          {activeTab === "deletar" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-red-600">🗑️ Deletar Produto</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Digite a REF do produto para deletar"
                  value={deleteRef}
                  onChange={(e) => setDeleteRef(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={handleSearchProduct}
                  disabled={loadingSearch || !deleteRef.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                >
                  {loadingSearch ? "🔍 Buscando..." : "🔍 BUSCAR"}
                </button>
              </div>

              {foundProduct && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <p className="font-bold text-gray-800 mb-3">⚠️ Produto encontrado:</p>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Nome:</strong> {foundProduct.name}</p>
                    <p><strong>REF:</strong> {foundProduct.ref}</p>
                    <p><strong>Preço:</strong> R$ {foundProduct.price?.toFixed(2).replace(".", ",")}</p>
                    {foundProduct.images && foundProduct.images.length > 0 && (
                      <div>
                        <strong>Imagem:</strong>
                        <img src={foundProduct.images[0]} alt={foundProduct.name} className="mt-2 w-24 h-24 object-cover rounded" />
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleDelete} className="mt-4">
                    <button
                      type="submit"
                      disabled={loadingDelete}
                      className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                    >
                      {loadingDelete ? "⏳ Deletando..." : "🗑️ DELETAR ESTE PRODUTO"}
                    </button>
                  </form>
                </div>
              )}

              {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
