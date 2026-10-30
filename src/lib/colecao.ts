// Coleção do produto (Lingerie, Moda Praia, Linha Noite), a partir da categoria salva.
// Produtos antigos só têm categoria (ex.: "Biquínis e Maiô"); esta função decide a coleção.
const DA_MODA_PRAIA = ['Moda Praia', 'Biquínis e Maiô', 'Saída de Praia'];
const DA_LINHA_NOITE = ['Linha Noite', 'Pijamas', 'Camisolas e Robes', 'Baby Doll e Pijamas'];

export function colecaoDaCategoria(categoria?: string | null): string {
  if (!categoria) return 'Lingerie';
  if (DA_MODA_PRAIA.includes(categoria)) return 'Moda Praia';
  if (DA_LINHA_NOITE.includes(categoria)) return 'Linha Noite';
  return 'Lingerie';
}
