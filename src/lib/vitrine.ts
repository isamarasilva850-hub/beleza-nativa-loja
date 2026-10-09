export const MENSAGEM_PADRAO =
  "Olá! Que alegria ter você por aqui 💛\n\nSeparei com carinho as peças do seu pedido para você montar a sua vitrine. Cada uma está com foto, cor e tamanho para facilitar sua vida.\n\nDefina o preço de revenda que preferir, salve e envie o link para as suas clientes. Qualquer dúvida, é só me chamar!";

export interface ItemPedido {
  ref: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
}

export interface PecaVitrine {
  ref: string;
  name: string;
  cores: string[];
  tamanhos: string[];
}

export function agruparPecas(items: ItemPedido[]): PecaVitrine[] {
  const mapa = new Map<string, PecaVitrine>();
  for (const item of items || []) {
    if (!item.ref) continue;
    const atual = mapa.get(item.ref) || { ref: item.ref, name: item.name, cores: [], tamanhos: [] };
    if (item.color && !atual.cores.includes(item.color)) atual.cores.push(item.color);
    if (item.size && !atual.tamanhos.includes(item.size)) atual.tamanhos.push(item.size);
    mapa.set(item.ref, atual);
  }
  return [...mapa.values()];
}

export function telefoneWhatsApp(telefone: string | undefined | null): string {
  const digitos = String(telefone || "").replace(/\D/g, "");
  return digitos.length <= 11 ? `55${digitos}` : digitos;
}

export function formatarPreco(valor: string | number | undefined | null): string {
  const numero = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : valor;
  if (!numero || isNaN(numero)) return "";
  return `R$ ${numero.toFixed(2).replace(".", ",")}`;
}
