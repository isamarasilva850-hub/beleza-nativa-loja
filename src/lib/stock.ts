interface StockEntry {
  ref: string;
  color: string;
  size: string;
  quantity: number;
}

const STOCK_KEY = "belezanativa_stock";
const STOCK_UPDATED_KEY = "belezanativa_stock_updated";

export function getStock(): StockEntry[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STOCK_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveStock(stock: StockEntry[]) {
  localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
  localStorage.setItem(STOCK_UPDATED_KEY, new Date().toLocaleString("pt-BR"));
}

export function isStockConfigured(): boolean {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem(STOCK_KEY);
  if (!saved) return false;
  const stock: StockEntry[] = JSON.parse(saved);
  return stock.length > 0;
}

export function getStockQuantity(ref: string, color: string, size: string): number {
  if (!isStockConfigured()) return -1;
  const stock = getStock();
  return stock.find((s) => s.ref === ref && s.color === color && s.size === size)?.quantity ?? 0;
}

export function hasStock(ref: string, color: string, size: string, qty: number = 1): boolean {
  if (!isStockConfigured()) return true;
  return getStockQuantity(ref, color, size) >= qty;
}

export function deductStock(items: { ref: string; color: string; size: string; quantity: number }[]) {
  const stock = getStock();
  items.forEach((item) => {
    const entry = stock.find((s) => s.ref === item.ref && s.color === item.color && s.size === item.size);
    if (entry) {
      entry.quantity = Math.max(0, entry.quantity - item.quantity);
    }
  });
  saveStock(stock);
}

export function buildPalmiraMessage(
  items: { ref: string; name: string; color: string; size: string; quantity: number }[],
  orderNumber: number,
  revendedora: string
): string {
  const grouped: Record<string, { name: string; details: string[] }> = {};
  items.forEach((item) => {
    const key = item.ref;
    if (!grouped[key]) {
      grouped[key] = { name: item.name, details: [] };
    }
    grouped[key].details.push(`  ${item.color} ${item.size} (${item.quantity})`);
  });

  const lines = Object.entries(grouped).map(
    ([ref, data]) => `REF ${ref} - ${data.name}\n${data.details.join("\n")}`
  );

  const totalPecas = items.reduce((s, i) => s + i.quantity, 0);

  return [
    `🔔 BAIXA NO HUNTER - Pedido #${orderNumber}`,
    "",
    ...lines,
    "",
    `Total: ${totalPecas} peça(s)`,
    `Revendedora: ${revendedora}`,
    `Data: ${new Date().toLocaleString("pt-BR")}`,
  ].join("\n");
}
