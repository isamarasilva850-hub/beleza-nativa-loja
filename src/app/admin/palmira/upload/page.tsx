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
        id: `color_${Date.now()}`,
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao deletar");
      }

      setSuccess(`🗑️ Produto "${deleteRef}" deletado com sucesso!`);
      setDeleteRef("");
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar");
      }

      setSuccess(`✅ Produto "${formData.name}" salvo com sucesso! Aparecerá na loja em segundos!`);
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

        <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Upload de Produtos</h1>
        <p className="text-gray-600 mb-8">Adicione fotos quantas quiser!</p>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-sm p-8">
          {/* Dados do Produto */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Dados do Produto</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Referência (ex: REF001)"
                value={formData.ref}
                onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              />
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

          {/* Seção de Deletar Produto */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-bold text-red-600 mb-4">🗑️ Deletar Produto</h3>
            <form onSubmit={handleDelete} className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Digite a REF do produto para deletar"
                value={deleteRef}
                onChange={(e) => setDeleteRef(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={loadingDelete}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                {loadingDelete ? "⏳ Deletando..." : "🗑️ DELETAR"}
              </button>
            </form>
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7BC9C2] hover:bg-[#5fb3ac] disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? "⏳ Salvando..." : "✅ SALVAR PRODUTO"}
          </button>
        </form>
      </div>
    </div>
  );
}
