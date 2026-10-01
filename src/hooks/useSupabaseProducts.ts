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

        const formattedProducts: Product[] = data.map((item: any, index: number) => ({
          id: index + 1,
          ref: item.ref,
          slug: item.ref.toLowerCase().replace(/\s+/g, '-'),
          name: item.name,
          price: parseFloat(item.price),
          description: `Produto ${item.name}`,
          composition: "Veja a descrição completa na loja",
          care: "Lavar com sabão neutro",
          collection: "Lingerie",
          gender: item.gender || "Feminino",
          category: item.category || "Lingerie",
          variants: item.colors?.map((color: any) => ({
            color: color.color_name,
            colorHex: color.color_hex || "#000000",
            sizes: [
              ...(parseInt(color.qty_p) > 0 ? ['P'] : []),
              ...(parseInt(color.qty_m) > 0 ? ['M'] : []),
              ...(parseInt(color.qty_g) > 0 ? ['G'] : []),
              ...(parseInt(color.qty_gg) > 0 ? ['GG'] : []),
            ],
          })) || [],
          images: item.images?.map((img: any) => img.image_base64 || img.image_url) || [],
        }));

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
