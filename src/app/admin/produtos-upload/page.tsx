"use client";

import { useState, useEffect } from "react";

export default function AdminProdutosUpload() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    images: [] as string[],
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products-upload");
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Deletar este produto?")) return;
    try {
      const res = await fetch(`/api/products-upload/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("✅ Produto deletado!");
        loadProducts();
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError("❌ Erro ao deletar");
      }
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

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
            setSuccess(`📦 ${newImages.length} fotos adicionadas!`);
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
        subgrupo_id: null,
        marca_id: null,
        unidade_medida_id: null,
        preco_custo: parseFloat(formData.price) * 0.5,
        preco_venda: parseFloat(formData.price),
        estoque_minimo: 5,
        peso: 0,
        codigo_barras: null,
        ncm: null,
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
            produto_grade_id: null,
            tipo_movimento: "entrada_inicial",
            entrada_saida: "E",
            quantidade: parseInt(formData.quantity),
            valor_unitario: parseFloat(formData.price),
          },
        }),
      });

      if (!estoque_res.ok) throw new Error("Erro ao registrar estoque");

      const productData = {
        ref: formData.ref,
        name: formData.name,
        category: formData.category,
        gender: formData.gender,
        price: parseFloat(formData.price),
        images: formData.images,
        color: formData.color,
        colorHex: formData.colorHex,
        sizes: formData.sizes,
        quantity: parseInt(formData.quantity),
        timestamp: new Date().toISOString(),
      };

      // Salvar no localStorage (para backup local)
      const uploads = JSON.parse(localStorage.getItem("belezanativa_product_uploads") || "[]");
      uploads.push(productData);
      localStorage.setItem("belezanativa_product_uploads", JSON.stringify(uploads));

      // Salvar no Supabase
      const response = await fetch("/api/products-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar no servidor");
      }

      setSuccess(`✅ Produto criado com ${formData.images.length} fotos!`);
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
        images: [],
      });
      setPreviews([]);
      loadProducts();
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">📸 Upload de Produtos</h1>
        <p className="text-sm text-gray-500">Adicione fotos quantas quiser de cada peça</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        {/* Dados do Produto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referência *</label>
            <input
              type="text"
              value={formData.ref}
              onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              placeholder="Ex: 537"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              placeholder="Ex: Conjunto Sem Bojo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              placeholder="Ex: 46.90"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
            >
              <option>Feminino</option>
              <option>Masculino</option>
              <option>Infantil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              placeholder="Ex: 100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
              placeholder="Ex: Vinho"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código da Cor</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* Tamanhos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tamanhos *</label>
          <div className="flex gap-2 flex-wrap">
            {["P", "M", "G", "GG"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeChange(size)}
                className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
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

        {/* Upload de Múltiplas Fotos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">📸 Fotos do Produto *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#7BC9C2] transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageInput"
            />
            <label htmlFor="imageInput" className="cursor-pointer">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm font-medium text-gray-700">Clique ou arraste fotos aqui</p>
              <p className="text-xs text-gray-500">Suporta múltiplas imagens</p>
            </label>
          </div>
        </div>

        {/* Preview das Imagens */}
        {previews.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos adicionadas: {previews.length}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
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
          ✅ ENVIAR PRODUTO COM {formData.images.length} FOTO{formData.images.length !== 1 ? "S" : ""}
        </button>
      </form>

      {/* Lista de Produtos Salvos */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Produtos Salvos ({products.length})</h2>
        {loading ? (
          <p className="text-gray-500 text-center py-8">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            <p>Nenhum produto salvo ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">Ref: {product.ref}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          R$ {product.price?.toFixed(2) || 'N/A'}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-bold"
                      >
                        ❌
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {product.images?.length || 0} foto(s) | {product.quantity} un.
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
