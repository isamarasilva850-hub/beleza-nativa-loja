import { revalidatePath } from 'next/cache';

// Limpa o cache da lista pública de produtos (/api/products).
// Chamar depois de qualquer gravação de produto, cor, foto, ordem ou ajuste de cor.
export function invalidarCatalogo() {
  revalidatePath('/api/products');
}
