// NOTA: Os produtos agora são armazenados em products.json
// Este arquivo mantém as interfaces TypeScript para tipagem

export interface ProductVariant {
  color: string;
  colorHex: string;
  sizes: string[];
}

export interface Product {
  id: number;
  ref: string;
  slug?: string;
  name: string;
  price: number;
  description?: string;
  composition?: string;
  care?: string;
  collection?: string;
  gender?: string;
  category?: string;
  variants?: ProductVariant[];
  images?: string[];
}

// Import dinâmico do JSON será feito no servidor
// Para uso client-side, use a API /api/products
// Mantemos um array vazio por compatibilidade
export const products: Product[] = [];
