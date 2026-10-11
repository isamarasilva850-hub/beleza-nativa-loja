// Pedidos do site, lidos do servidor (tabela orders) e no mesmo formato usado nas telas do admin.

export interface PedidoItem {
  ref: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PedidoAdmin {
  id: string;
  number: number;
  date: string;
  revendedora: string;
  items: PedidoItem[];
  total: number;
  totalItems: number;
  status: string;
}

// Converte a linha de orders (servidor) para o formato das telas.
// Pedidos antigos guardam o preço em "price"; os novos, em "unitPrice". Normaliza os dois.
export function deServidorPedido(row: any): PedidoAdmin {
  const items: PedidoItem[] = (Array.isArray(row.items) ? row.items : []).map((i: any) => {
    const quantidade = Number(i.quantity) || 0;
    const unitario = Number(i.unitPrice ?? i.price) || 0;
    return {
      ref: String(i.ref ?? ""),
      name: String(i.name ?? ""),
      color: String(i.color ?? ""),
      size: String(i.size ?? ""),
      quantity: quantidade,
      unitPrice: unitario,
      total: Number(i.total) || unitario * quantidade,
    };
  });
  return {
    id: String(row.id),
    number: /^\d+$/.test(String(row.id)) ? Number(row.id) : 0,
    // created_at tem hora, então a data aparece certa no fuso do Brasil
    date: row.created_at || row.date || "",
    revendedora: row.partnername || "",
    items,
    total: Number(row.total) || 0,
    totalItems: items.reduce((soma, i) => soma + i.quantity, 0),
    status: row.status || "pendente",
  };
}

export async function carregarPedidos(): Promise<PedidoAdmin[]> {
  const resposta = await fetch("/api/orders");
  const rows = await resposta.json();
  return Array.isArray(rows) ? rows.map(deServidorPedido) : [];
}
