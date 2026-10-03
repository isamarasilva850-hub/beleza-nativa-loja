"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { notifyStorageChange } from "@/lib/storageEvents";

// Alias para o construtor Image do DOM (não confundir com Image do Next.js)
const DOMImage = typeof window !== 'undefined' ? window.Image : Image;

interface UploadedProduct {
  ref: string;
  name: string;
  price: number;
  color: string;
  colorHex?: string;
  images: string[];
  sizes: string[];
  quantity: number;
  timestamp: string;
}

export default function PalmiraProdutosPage() {
  const [products, setProducts] = useState<UploadedProduct[]>([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<UploadedProduct | null>(null);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
    setProducts(uploads);
  }, []);

  const saveProducts = (updated: UploadedProduct[]) => {
    localStorage.setItem("belezanativa_product_uploads", JSON.stringify(updated));
    setProducts(updated);
    notifyStorageChange("belezanativa_product_uploads", updated);
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    if (!editingProduct) return;
    const newImages = [...editingProduct.images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    setEditingProduct({ ...editingProduct, images: newImages });
  };

  const removeImage = (index: number) => {
    if (!editingProduct) return;
    const newImages = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, images: newImages });
  };

  const addNewImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct || !e.target.files) return;

    const files = e.target.files;
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const result = event.target?.result as string;
        const imgElement = new DOMImage();
        imgElement.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 800;
          canvas.height = 800;
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.drawImage(imgElement, 0, 0, 800, 800);
          newImages.push(canvas.toDataURL("image/webp", 0.85));

          if (newImages.length === files.length) {
            setEditingProduct({
              ...editingProduct,
              images: [...editingProduct.images, ...newImages],
            });
          }
        };
        imgElement.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEditedProduct = () => {
    if (!editingProduct) return;

    const updated = products.map((p) =>
      p.ref === editingProduct.ref ? editingProduct : p
    );
    saveProducts(updated);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/palmira" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">📦 Produtos Cadastrados</h1>
          <p className="text-gray-600 mt-1">Total: {filteredProducts.length} produtos</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar por referência ou nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.ref} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {product.images.length} fotos
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-gray-400 font-mono mb-1">REF {product.ref}</p>
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-[#7BC9C2]">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                    {product.color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: product.colorHex || product.color }}
                        />
                        <span className="text-xs text-gray-600">{product.color}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <p>📏 Tamanhos: {product.sizes.join(", ")}</p>
                    <p>📦 Quantidade: {product.quantity}</p>
                    <p className="text-gray-400">
                      {new Date(product.timestamp).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="mt-4 w-full bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    ✏️ Editar Fotos & Dados
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Nenhum produto encontrado</p>
            <Link href="/admin/palmira/upload" className="text-[#7BC9C2] hover:underline text-sm mt-2 inline-block">
              Adicionar produto →
            </Link>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Editar: REF {editingProduct.ref}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800">📋 Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Nome</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Preço</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Cor</label>
                    <input
                      type="text"
                      value={editingProduct.color}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, color: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Quantidade</label>
                    <input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Photos - Reordenable */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">📸 Fotos ({editingProduct.images.length})</h3>
                  <label className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200">
                    ➕ Adicionar Fotos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={addNewImages}
                      className="hidden"
                    />
                  </label>
                </div>

                {editingProduct.images.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">
                      Arraste para reordenar, clique no X para remover
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {editingProduct.images.map((img, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={() => setDraggedImageIndex(index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (draggedImageIndex !== null && draggedImageIndex !== index) {
                              handleImageReorder(draggedImageIndex, index);
                              setDraggedImageIndex(null);
                            }
                          }}
                          className={`relative group cursor-move rounded-lg overflow-hidden border-2 ${
                            draggedImageIndex === index
                              ? "border-[#7BC9C2] opacity-50"
                              : "border-gray-200 hover:border-[#7BC9C2]"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold">
                              #{index + 1}
                            </div>
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                    Nenhuma foto. Clique em "➕ Adicionar Fotos" para começar!
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Buttons */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3 justify-end">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveEditedProduct}
                className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg hover:bg-[#5fb3ac] transition-colors font-semibold"
              >
                💾 Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
