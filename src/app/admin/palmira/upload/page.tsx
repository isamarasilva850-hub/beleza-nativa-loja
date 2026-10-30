"use client";

import Link from "next/link";
import { useState } from "react";

interface ColorInput {
  id: string;
  name: string;
  hex: string;
  // Quantidade por tamanho, livre (PP, P, M, G, GG, 38...50). Ex.: { P: "2", GG: "5" }
  tamanhos: Record<string, string>;
}

// Tamanhos que aparecem prontos para a Palmira preencher; ela pode acrescentar outros
const TAMANHOS_PADRAO = ["PP", "P", "M", "G", "GG", "38", "40", "42", "44", "46", "48", "50"];

// Soma de peças da cor (ignora tamanhos vazios)
const temQuantidade = (c: ColorInput) => Object.values(c.tamanhos).some((q) => parseInt(q) > 0);

export default function PalmiraUploadPage() {
  const [formData, setFormData] = useState({
    ref: "",
    name: "",
    price: "",
    gender: "Feminino",
    colecao: "Lingerie",
  });

  const [colors, setColors] = useState<ColorInput[]>([]);
  const [savedColors, setSavedColors] = useState<ColorInput[]>([]);
  const [images, setImages] = useState<string[]>([]);
  // Fotos já salvas do produto em edição (com o id para poder apagar uma só)
  const [fotosAtuais, setFotosAtuais] = useState<{ src: string; id?: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [savedImages, setSavedImages] = useState<string[]>([]);
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
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  // Cor de cada foto nova (mesma ordem da lista de fotos); "" = foto geral do produto
  const [coresFotos, setCoresFotos] = useState<string[]>([]);
  const [coresFotosSalvas, setCoresFotosSalvas] = useState<string[]>([]);
  // Onde a foto fica no quadro 3:4 do card (topo, centro ou base)
  const [enquadramento, setEnquadramento] = useState<"topo" | "centro" | "base">("centro");
  // Ao salvar um produto existente: manter as fotos salvas (padrão) ou substituir todas
  const [substituirFotos, setSubstituirFotos] = useState(false);

  // Foto final na proporção 3:4 do card da loja (600 x 800), sem esticar:
  // a imagem é ampliada para cobrir o quadro e recortada conforme o enquadramento escolhido
  const optimizeImage = (imgBase64: string, enquadramento: "topo" | "centro" | "base" = "centro"): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const largura = 600;
        const altura = 800;
        const canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const escala = Math.max(largura / img.width, altura / img.height);
          const w = img.width * escala;
          const h = img.height * escala;
          const dx = (largura - w) / 2;
          const dy = enquadramento === "topo" ? 0 : enquadramento === "base" ? altura - h : (altura - h) / 2;
          ctx.drawImage(img, dx, dy, w, h);
        }
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
          try {
            const result = event.target?.result as string;
            console.log(`🖼️ Otimizando imagem ${i + 1}/${files.length}...`);
            const optimized = await optimizeImage(result, enquadramento);
            newImages.push(optimized);
            newPreviews.push(optimized);
            console.log(`✅ Imagem ${i + 1} otimizada: ${Math.round(optimized.length / 1024)}KB`);

            if (newImages.length === files.length) {
              console.log(`🎉 Todas ${newImages.length} imagens prontas!`);
              setImages([...images, ...newImages]);
              setCoresFotos([...coresFotos, ...newImages.map(() => "")]);
              setPreviews([...previews, ...newPreviews]);
              setSuccess(`✅ ${newImages.length} foto(s) adicionada(s)!`);
              setTimeout(() => setSuccess(""), 2000);
            }
          } catch (err) {
            console.error(`❌ Erro ao processar imagem ${i + 1}:`, err);
            setError(`❌ Erro ao processar imagem: ${err instanceof Error ? err.message : String(err)}`);
          }
        };
        reader.onerror = () => {
          console.error(`❌ Erro ao ler arquivo ${i + 1}`);
          setError(`❌ Erro ao ler arquivo da imagem`);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setCoresFotos(coresFotos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSaveImages = () => {
    if (images.length === 0) {
      setError("❌ Nenhuma imagem selecionada!");
      return;
    }
    setSavedImages(images);
    setCoresFotosSalvas(coresFotos);
    setSuccess(`✅ ${images.length} imagem(ns) salva(s)!`);
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleSaveColors = () => {
    if (colors.length === 0) {
      setError("❌ Nenhuma cor adicionada!");
      return;
    }
    const validColors = colors.filter((c) => c.name && temQuantidade(c));
    if (validColors.length === 0) {
      setError("❌ Adicione nome e quantidade para pelo menos uma cor!");
      return;
    }
    setSavedColors(colors);
    setSuccess(`✅ ${colors.length} cor(es) salva(s)!`);
    setTimeout(() => setSuccess(""), 2000);
  };

  const addColor = () => {
    setColors([
      ...colors,
      {
        id: `color_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: "",
        hex: "#000000",
        tamanhos: {},
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

  // Quantidade de um tamanho dentro da cor (ex.: PP, 46)
  const updateTamanho = (id: string, tamanho: string, valor: string) => {
    setColors(
      colors.map((c) => (c.id === id ? { ...c, tamanhos: { ...c.tamanhos, [tamanho]: valor } } : c))
    );
  };

  // Acrescenta um tamanho que não está na lista padrão
  const adicionarTamanho = (id: string, nome: string) => {
    const tamanho = nome.trim().toUpperCase();
    if (!tamanho) return;
    setColors(
      colors.map((c) => (c.id === id ? { ...c, tamanhos: { ...c.tamanhos, [tamanho]: c.tamanhos[tamanho] || "" } } : c))
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

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newProducts = [...allProducts];
    [newProducts[index], newProducts[index - 1]] = [newProducts[index - 1], newProducts[index]];
    setAllProducts(newProducts);
  };

  const moveDown = (index: number) => {
    if (index === allProducts.length - 1) return;
    const newProducts = [...allProducts];
    [newProducts[index], newProducts[index + 1]] = [newProducts[index + 1], newProducts[index]];
    setAllProducts(newProducts);
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedItem === null || draggedItem === index) return;
    const newProducts = [...allProducts];
    const draggedProduct = newProducts[draggedItem];
    newProducts.splice(draggedItem, 1);
    newProducts.splice(index, 0, draggedProduct);
    setAllProducts(newProducts);
    setDraggedItem(null);
  };

  const handleSaveOrder = async () => {
    try {
      setSavingOrder(true);
      setError("");
      setSuccess("");

      const updates = allProducts.map((product, index) => ({
        ref: product.ref,
        display_order: index,
      }));

      const response = await fetch("/api/admin/update-product-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar ordem");
      }

      setSuccess(`✅ Ordem de ${allProducts.length} produtos salva com sucesso!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingOrder(false);
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

      const res = await fetch("/api/products?completo=1");
      const products = await res.json();
      const product = products.find((p: any) => p.ref === formData.ref);

      if (!product) {
        throw new Error(`❌ Produto com REF "${formData.ref}" não encontrado. Deixaremos em branco para criar novo.`);
      }

      setEditMode(true);
      setFotosAtuais((product.images || []).map((src: string, i: number) => ({ src, id: product.imageIds?.[i] })));
      setFormData({
        ref: product.ref,
        name: product.name,
        price: product.price?.toString() || "",
        gender: product.gender || "Feminino",
        colecao: product.collection || "Lingerie",
      });
      // Produtos do banco trazem as cores em "colors"; os do catálogo original, em "variants"
      const coresDoProduto = product.variants?.length ? product.variants : (product.colors || []);
      if (coresDoProduto.length > 0) {
        setColors(
          coresDoProduto.map((v: any) => ({
            id: `color_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: v.color_name || v.name || '',
            hex: v.color_hex || v.hex || '#000000',
            // Tamanhos já salvos (livres); se não houver, usa as colunas antigas P, M, G, GG
            tamanhos: v.tamanhos
              ? Object.fromEntries(Object.entries(v.tamanhos).map(([k, q]) => [k, String(q ?? 0)]))
              : { P: String(v.qty_p ?? 0), M: String(v.qty_m ?? 0), G: String(v.qty_g ?? 0), GG: String(v.qty_gg ?? 0) },
          }))
        );
      }
      setSuccess(`✅ Produto "${product.name}" carregado! Adicione mais fotos/cores.`);
    } catch (err: any) {
      setError(err.message);
      setEditMode(false);
    } finally {
      setLoadingSearchExisting(false);
    }
  };

  // Troca a coleção de um produto direto na lista (sem abrir o formulário)
  const mudarColecao = async (product: any, colecao: string) => {
    setError("");
    const r = await fetch("/api/admin/update-colecao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref: product.ref, colecao, name: product.name, price: product.price }),
    });
    if (!r.ok) {
      setError("Não foi possível trocar a coleção.");
      return;
    }
    setSuccess(`✅ Coleção do produto "${product.ref}" alterada para ${colecao}.`);
    setTimeout(() => setSuccess(""), 3000);
    loadAllProducts();
  };

  // Apaga direto da lista "Meus Produtos", com confirmação
  const apagarDaLista = async (ref: string) => {
    if (!confirm(`Apagar o produto ${ref}? Esta ação não pode ser desfeita.`)) return;
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/admin/delete-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || "Erro ao deletar");
      }
      setSuccess(`🗑️ Produto "${ref}" deletado com sucesso!`);
      setTimeout(() => setSuccess(""), 4000);
      loadAllProducts();
    } catch (err: any) {
      setError(err.message);
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

      if (savedColors.length === 0) {
        throw new Error("❌ Clique em 'Salvar Cores' antes de enviar o produto!");
      }

      const hasQty = colors.some(temQuantidade);

      if (!hasQty) {
        throw new Error("❌ Adicione quantidade para pelo menos um tamanho!");
      }

      const productData = {
        ref: formData.ref,
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        gender: formData.gender,
        colecao: formData.colecao || "Lingerie",
        colors: savedColors.map((c) => {
          // Só envia tamanhos com quantidade maior que zero
          const tamanhos = Object.fromEntries(
            Object.entries(c.tamanhos).map(([k, q]) => [k, parseInt(q) || 0]).filter(([, q]) => (q as number) > 0)
          );
          return {
            name: c.name || 'Sem cor',
            hex: c.hex,
            tamanhos,
            // Colunas antigas, mantidas para os locais que ainda leem P, M, G, GG
            qty_p: tamanhos.P || 0,
            qty_m: tamanhos.M || 0,
            qty_g: tamanhos.G || 0,
            qty_gg: tamanhos.GG || 0,
          };
        }),
        images: savedImages,
        imagensCor: coresFotosSalvas,
        substituirFotos,
      };

      console.log('📤 Enviando:', {
        ref: formData.ref,
        images_count: images.length,
        first_image_sample: images[0]?.substring(0, 100)
      });

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
      setFormData({ ref: "", name: "", price: "", gender: "Feminino", colecao: "Lingerie" });
      setColors([]);
      setImages([]);
      setPreviews([]);
      setSavedImages([]);
      setCoresFotos([]);
      setCoresFotosSalvas([]);

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
            onClick={() => {
              setActiveTab("reordenar");
              loadAllProducts();
            }}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === "reordenar"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🔄 Reordenar
          </button>
          <button
            type="button"
            onClick={() => {
              // Abrir a aba começa um produto novo (o ✏️ da lista carrega um existente)
              setFormData({ ref: "", name: "", price: "", gender: "Feminino", colecao: "Lingerie" });
              setColors([]);
              setImages([]);
              setPreviews([]);
              setEditMode(false);
              setError("");
              setSuccess("");
              setActiveTab("criar");
            }}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === "criar"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            📦 Cadastrar / Editar Produto
          </button>
        </div>

        <div className="space-y-8 bg-white rounded-xl shadow-sm p-8">
          {/* TAB: Listar Produtos */}
          {activeTab === "listar" && (
            <div className="space-y-6">
              {/* Excluir produto pela REF (apaga o produto, as cores e as fotos) */}
              <form onSubmit={handleDelete} className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-bold text-red-700">🗑️ Excluir produto pela REF</p>
                <p className="text-xs text-red-600">Apaga o produto do site, com as cores e as fotos. Não tem como desfazer.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deleteRef}
                    onChange={(e) => setDeleteRef(e.target.value)}
                    placeholder="REF do produto (ex.: 551)"
                    className="flex-1 px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                  <button type="submit" disabled={loadingDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
                    {loadingDelete ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </form>

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
                        <th className="px-4 py-3 text-left font-bold text-gray-800">Coleção</th>
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
                            <td className="px-4 py-3">
                              <select
                                value={product.collection || "Lingerie"}
                                onChange={(e) => mudarColecao(product, e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-xs"
                              >
                                <option value="Lingerie">Lingerie</option>
                                <option value="Moda Praia">Moda Praia</option>
                                <option value="Linha Noite">Pijamas e Linha Noite</option>
                              </select>
                            </td>
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
                                    setActiveTab("criar");
                                    setFormData({
                                      ref: product.ref,
                                      name: product.name,
                                      price: product.price?.toString() || "",
                                      gender: product.gender || "Feminino",
                                      colecao: product.collection || "Lingerie",
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
                                  onClick={async () => {
                                    const mapa: Record<string, string> = {};
                                    for (const v of product.variants || []) {
                                      const original = v.colorOriginal || v.color;
                                      const nova = window.prompt(
                                        `Nome da cor "${v.color}" no produto ${product.ref} (deixe igual se estiver certo):`,
                                        v.color
                                      );
                                      if (nova === null) return;
                                      mapa[original] = nova.trim() || original;
                                    }
                                    const r = await fetch("/api/admin/ajustes-cor", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ ref: product.ref, mapa }),
                                    });
                                    if (!r.ok) {
                                      setError("Não foi possível salvar as cores.");
                                      return;
                                    }
                                    setSuccess(`🎨 Cores do produto "${product.ref}" salvas!`);
                                    setTimeout(() => setSuccess(""), 4000);
                                    loadAllProducts();
                                  }}
                                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-bold"
                                  title="Corrigir nomes das cores"
                                >
                                  🎨
                                </button>
                                <button
                                  type="button"
                                  onClick={() => apagarDaLista(product.ref)}
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

          {/* TAB: Reordenar Produtos */}
          {activeTab === "reordenar" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">🔄 Reordenar Produtos na Loja</h2>
                  <p className="text-sm text-gray-600 mb-4">Arraste os produtos para mudar a ordem ou use os botões ⬆️ ⬇️</p>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
                >
                  👀 Ver Loja
                </a>
              </div>

              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={savingOrder || loadingProducts || allProducts.length === 0}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {savingOrder ? "⏳ Salvando..." : "💾 SALVAR NOVA ORDEM"}
              </button>

              {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

              {loadingProducts ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">⏳ Carregando produtos...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {allProducts.map((product, index) => (
                      <div
                        key={product.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-indigo-400 transition-all cursor-move ${
                          draggedItem === index ? "opacity-50 border-indigo-500" : ""
                        }`}
                      >
                        <span className="text-sm font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          #{index + 1}
                        </span>

                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-600">REF: {product.ref}</p>
                        </div>

                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded font-bold"
                          >
                            ⬆️
                          </button>
                          <button
                            type="button"
                            onClick={() => moveDown(index)}
                            disabled={index === allProducts.length - 1}
                            className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded font-bold"
                          >
                            ⬇️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </>
              )}
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
              <select
                value={formData.colecao}
                onChange={(e) => setFormData({ ...formData, colecao: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                title="Coleção: onde o produto aparece no menu"
              >
                <option value="Lingerie">Lingerie</option>
                <option value="Moda Praia">Moda Praia</option>
                <option value="Linha Noite">Pijamas e Linha Noite</option>
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
              {colors.length > 0 && (
                <button
                  type="button"
                  onClick={handleSaveColors}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                >
                  💾 Salvar Cores
                </button>
              )}
            </div>

            {savedColors.length > 0 && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
                <p className="text-green-700 text-sm">✅ {savedColors.length} cor(es) salva(s)!</p>
              </div>
            )}

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
                      {/* Tamanhos padrão + qualquer tamanho que a cor já tenha */}
                      {Array.from(new Set([...TAMANHOS_PADRAO, ...Object.keys(color.tamanhos)])).map((size) => (
                        <div key={size} className="flex flex-col">
                          <label className="text-xs font-bold text-gray-700 mb-1">{size}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={color.tamanhos[size] || ""}
                            onChange={(e) => updateTamanho(color.id, size, e.target.value)}
                            className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-[#7BC9C2]"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Outro tamanho (ex.: 52)"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            adicionarTamanho(color.id, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Escolha de como as fotos novas entram: manter ou substituir as salvas */}
          {editMode && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
              <p className="text-sm font-bold text-gray-700">Ao salvar este produto, as fotos:</p>
              <label className="flex gap-2 items-start text-sm">
                <input type="radio" name="modoFotos" checked={!substituirFotos} onChange={() => setSubstituirFotos(false)} className="mt-1" />
                <span>Mantêm as fotos salvas e acrescentam as novas (padrão)</span>
              </label>
              <label className="flex gap-2 items-start text-sm">
                <input type="radio" name="modoFotos" checked={substituirFotos} onChange={() => setSubstituirFotos(true)} className="mt-1" />
                <span>Substituem todas: apagam as fotos salvas e usam só as novas</span>
              </label>
            </div>
          )}

          {/* Fotos já salvas: a Palmira pode apagar uma foto errada sem apagar o produto */}
          {fotosAtuais.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-bold text-gray-700 mb-2">Fotos salvas deste produto</p>
              <div className="grid grid-cols-4 gap-2">
                {fotosAtuais.map((foto, idx) => (
                  <div key={`${foto.id || idx}`} className="relative">
                    <img src={foto.src} alt={`Foto ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      disabled={!foto.id}
                      onClick={async () => {
                        if (!confirm("Apagar esta foto? As outras fotos continuam.")) return;
                        const r = await fetch("/api/admin/delete-image", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ imageId: foto.id }),
                        });
                        if (r.ok) {
                          setFotosAtuais((atuais) => atuais.filter((_, i) => i !== idx));
                          setSuccess("✅ Foto apagada.");
                        } else {
                          setError("❌ Não foi possível apagar a foto.");
                        }
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold disabled:opacity-40"
                      title="Apagar esta foto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fotos */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">📷 Fotos</h2>
            <p className="text-sm text-gray-600 mb-3 bg-blue-50 p-3 rounded-lg">
              💡 <strong>Dica:</strong> Você pode selecionar VÁRIAS fotos de uma vez! Clique uma vez e selecione todas!
            </p>
            <div className="mb-3">
              <label className="block text-sm font-bold text-gray-700 mb-1">Enquadramento da foto (na vitrine ela fica em 3:4)</label>
              <select
                value={enquadramento}
                onChange={(e) => setEnquadramento(e.target.value as "topo" | "centro" | "base")}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
              >
                <option value="centro">Centro (padrão)</option>
                <option value="topo">Topo (para mostrar a cabeça da modelo)</option>
                <option value="base">Base (para mostrar a parte de baixo)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Escolha antes de selecionar as fotos. Fotos já salvas precisam ser enviadas de novo.</p>
            </div>
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
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-700">
                    {previews.length} foto(s) adicionada(s) {savedImages.length > 0 && `✅ ${savedImages.length} salva(s)`}
                  </p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className={`w-full h-24 object-cover rounded-lg border-2 ${savedImages.length > 0 ? 'border-green-500' : 'border-gray-200'}`}
                      />
                      {/* Cor desta foto: aparece na loja quando a cliente escolhe essa cor */}
                      <select
                        value={coresFotos[index] || ""}
                        onChange={(e) => setCoresFotos(coresFotos.map((c, i) => (i === index ? e.target.value : c)))}
                        className="w-full mt-1 px-1 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="">Foto geral</option>
                        {colors
                          .filter((c) => c.name.trim())
                          .map((c) => (
                            <option key={c.id} value={c.name.trim()}>{c.name.trim()}</option>
                          ))}
                      </select>
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
                <button
                  type="button"
                  onClick={handleSaveImages}
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  💾 Salvar Imagens
                </button>
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
        </div>
      </div>
    </div>
  );
}
