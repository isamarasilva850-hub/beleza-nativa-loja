"use client";

import { useState } from "react";

export default function AdminProdutosUpload() {
  const [formData, setFormData] = useState({
    ref: "",
    name: "",
    category: "Lingerie",
    gender: "Feminino",
    price: "",
    color: "",
    colorHex: "#000000",
    sizes: [] as string[],
    quantity: "",
    image: "",
  });

  const [preview, setPreview] = useState<string>("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const optimizeImage = (imgBase64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }

        const optimized = canvas.toDataURL("image/webp", 0.85);
        resolve(optimized);
      };
      img.src = imgBase64;
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        const optimized = await optimizeImage(result);
        setPreview(optimized);
        setFormData({ ...formData, image: optimized });
        setSuccess(`📦 Foto otimizada: ${Math.round(optimized.length / 1024)}KB`);
        setTimeout(() => setSuccess(""), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.includes(size)
        ? formData.sizes.filter((s) => s !== size)
        : [...formData.sizes, size],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.ref || !formData.name || !formData.price || !formData.quantity) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    if (formData.sizes.length === 0) {
      setError("Selecione pelo menos um tamanho!");
      return;
    }

    try {
      const mapCategoryToGrupo: Record<string, string> = {
        "Lingerie": "Lingerie",
        "Moda Praia": "Moda Praia",
        "Pijama": "Acessorios",
      };

      const grupoNome = mapCategoryToGrupo[formData.category] || "Lingerie";
      const grupos = await fetch("/api/erp?path=/api/cadastro/grupos").then(r => r.json());
      let grupoId = grupos.find((g: any) => g.nome === grupoNome)?.id || grupos[0]?.id;

      const productPayload = {
        codigo: formData.ref,
        nome: formData.name,
        descricao: `${formData.color ? `Cor: ${formData.color}` : ''} | Gênero: ${formData.gender}`,
        grupo_id: grupoId,
        preco_venda: parseFloat(formData.price),
        preco_custo: parseFloat(formData.price) * 0.5,
        estoque_minimo: 5,
      };

      const productRes = await fetch("/api/erp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "POST",
          path: "/api/cadastro/produtos",
          body: productPayload,
        }),
      });

      if (!productRes.ok) throw new Error("Erro ao criar produto na ERP");

      const { id: productId } = await productRes.json();

      const estoque_res = await fetch("/api/erp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "POST",
          path: "/api/estoque/movimentos",
          body: {
            produto_id: productId,
            tipo_movimento: "entrada_inicial",
            entrada_saida: "E",
            quantidade: parseInt(formData.quantity),
            custo_unitario: parseFloat(formData.price) * 0.5,
            observacao: `Entrada via Upload - ${formData.color || "Padrão"}`,
          },
        }),
      });

      if (!estoque_res.ok) throw new Error("Erro ao registrar estoque");

      setSuccess(`✅ Produto "${formData.name}" criado na ERP com sucesso!`);
      setFormData({
        ref: "",
        name: "",
        category: "Lingerie",
        gender: "Feminino",
        price: "",
        color: "",
        colorHex: "#000000",
        sizes: [],
        quantity: "",
        image: "",
      });
      setPreview("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`Erro ao enviar: ${(err as Error).message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📸 Upload de Produtos</h1>
        <p className="text-gray-500">Adicione novas peças ao catálogo da Beleza Nativa</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📷 Foto do Produto</h2>
          <div className="flex gap-6 flex-col md:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Selecione a foto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm cursor-pointer hover:border-[#7BC9C2] transition-colors"
              />
            </div>
            {preview && (
              <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📝 Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">REF * (ex: 515)</label>
              <input
                type="text"
                required
                value={formData.ref}
                onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                placeholder="Referência da peça"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome * (ex: Conjunto Rendado)</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                placeholder="Nome do produto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] bg-white"
              >
                <option>Lingerie</option>
                <option>Moda Praia</option>
                <option>Pijama</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] bg-white"
              >
                <option>Feminino</option>
                <option>Infantil</option>
                <option>Masculino</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preço e Quantidade */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💰 Preço e Estoque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Atacado * (ex: 50.00)</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                placeholder="50.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade * (ex: 50)</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* Cor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🎨 Cor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Cor (ex: Vinho)</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]"
                placeholder="Vinho, Preto, Rosa..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cor (Seletor)</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.colorHex}
                  onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                  className="w-16 h-11 rounded-lg cursor-pointer border border-gray-200"
                />
                <span className="text-sm text-gray-600 font-mono">{formData.colorHex}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tamanhos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📏 Tamanhos Disponíveis *</h2>
          <div className="flex flex-wrap gap-3">
            {["P", "M", "G", "GG"].map((size) => (
              <label key={size} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="w-4 h-4 rounded border-gray-300 text-[#7BC9C2] cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-medium">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm font-medium">
            {success}
          </div>
        )}

        {/* Botão Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-[#7BC9C2] to-[#6ab8b1] text-white rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
        >
          🚀 ENVIAR PRODUTO
        </button>
      </form>
    </div>
  );
}
