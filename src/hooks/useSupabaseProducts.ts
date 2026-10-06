import { useEffect, useState } from 'react';
import { Product, ProductVariant } from '@/data/products';

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Erro ao carregar produtos');

        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error('GET /api/products did not return array:', data);
          setProducts([]);
          setError('Dados inválidos');
          return;
        }

        const normalizeGender = (gender: any) => {
          if (!gender || typeof gender !== 'string') return "Feminino";
          const normalized = gender.toLowerCase?.() || "";
          if (normalized.includes("infantil")) return "Infantil";
          if (normalized.includes("masculino")) return "Masculino";
          if (normalized.includes("feminino")) return "Feminino";
          return "Feminino";
        };

        const formattedProducts: Product[] = data.map((item: any, index: number) => {
          try {
            // Item.variants já vem do GET com color, colorHex, sizes
            // Se não, tenta processar item.colors (para produtos do Supabase)
            let variants: any[] = [];

            if (Array.isArray(item.variants)) {
              variants = item.variants;
            } else if (Array.isArray(item.colors)) {
              variants = item.colors?.map((color: any) => ({
                color: color.color_name,
                colorHex: color.color_hex || "#000000",
                sizes: [
                  ...(parseInt(color.qty_p) > 0 ? ['P'] : []),
                  ...(parseInt(color.qty_m) > 0 ? ['M'] : []),
                  ...(parseInt(color.qty_g) > 0 ? ['G'] : []),
                  ...(parseInt(color.qty_gg) > 0 ? ['GG'] : []),
                ],
              })) || [];
            }

            return {
              id: index + 1,
              ref: item.ref || '',
              slug: (item.ref || '').toLowerCase().replace(/\s+/g, '-'),
              name: item.name || 'Produto sem nome',
              price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
              description: `Produto ${item.name || ''}`,
              composition: "Veja a descrição completa na loja",
              care: "Lavar com sabão neutro",
              collection: "Lingerie",
              gender: normalizeGender(item.gender),
              category: item.category || "Lingerie",
              variants: Array.isArray(variants) ? variants : [],
              images: Array.isArray(item.images) ? item.images.map((img: any) => typeof img === 'string' ? img : (img?.image_base64 || img?.image_url)) : [],
            };
          } catch (itemErr) {
            console.error('Erro ao processar item:', item, itemErr);
            return null;
          }
        }).filter((p: any) => p !== null);

        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
    const interval = setInterval(loadProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  return { products, loading, error };
}
