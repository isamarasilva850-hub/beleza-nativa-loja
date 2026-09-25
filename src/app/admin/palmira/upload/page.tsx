"use client";

import Link from "next/link";
import { useState } from "react";

export default function PalmiraUploadPage() {
  const [formData, setFormData] = useState({
    ref: "",
    name: "",
    price: "",
    color: "",
    colorHex: "#000000",
    sizes: [] as string[],
    quantity: "",
    images: [] as string[],
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
            setFormData({ ...formData, images: [...formData.images, ...newImages] });
            setPreviews([...previews, ...newPreviews]);
            setSuccess(`✅ ${newImages.length} fotos adicionadas!`);
            setTimeout(() => setSuccess(""), 2000);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setPreviews(newPreviews);
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
      setError("❌ Preencha Referência, Nome, Preço e Quantidade!");
      return;
    }

    if (formData.sizes.length === 0) {
      setError("❌ Selecione pelo menos um tamanho!");
      return;
    }

    if (formData.images.length === 0) {
      setError("❌ Adicione pelo menos uma foto!");
      return;
    }

    try {
      const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
      uploads.push({
        ref: formData.ref,
        name: formData.name,
        category: "Lingerie",
        gender: "Feminino",
        price: parseFloat(formData.price),
        images: formData.images,
        color: formData.color,
        colorHex: formData.colorHex,
        sizes: formData.sizes,
        quantity: parseInt(formData.quantity),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("belezanativa_product_uploads", JSON.stringify(uploads));

      setSuccess(`✅ Produto salvo com ${formData.images.length} fotos!`);
      setFormData({
        ref: "",
        name: "",
        price: "",
        color: "",
        colorHex: "#000000",
        sizes: [],
        quantity: "",
        images: [],
      });
      setPreviews([]);
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">📸 Upload de Produtos</h1>
          <p className="text-gray-600 mt-1">Adicione fotos quantas quiser</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">📋 Dados do Produto</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Referência"
                value={formData.ref}
                onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              />
              <input
                type="text"
                placeholder="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.01"
                placeholder="Preço"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              />
              <input
                type="number"
                placeholder="Quantidade"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              />
            </div>
          </div>

          {/* Cor */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">🎨 Cor</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome da cor"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              />
              <input
                type="color"
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Tamanhos */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">📏 Tamanhos</h3>
            <div className="flex gap-2">
              {["P", "M", "G", "GG"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`px-4 py-2 rounded font-bold transition-colors ${
                    formData.sizes.includes(size)
                      ? "bg-[#7BC9C2] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Upload de Fotos */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">📷 Fotos</h3>
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
          </div>

          {/* Preview */}
          {previews.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700">{previews.length} foto(s)</p>
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

          {/* Mensagens */}
          {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white font-bold py-3 rounded-lg transition-colors"
          >
            ✅ SALVAR PRODUTO
          </button>
        </form>
      </div>
    </div>
  );
}
