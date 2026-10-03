import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============ TIPOS ============

export interface Partner {
  id: string;
  name: string;
  company: string;
  cnpj: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  markupPercentage?: number;
  logo?: string;
}

export interface OrderRecord {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  items: Array<{
    productId: number;
    ref: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
  }>;
  total: number;
  date: string;
  status: "pendente" | "pago" | "artes_enviadas";
}

export interface PurchasedProduct {
  id?: string;
  partnerId: string;
  productId: number;
  ref: string;
  quantity: number;
  color: string;
  size: string;
  purchaseDate: string;
  price: number;
  name: string;
}

export interface CartItem {
  id?: string;
  partnerId: string;
  productId: number;
  ref: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}

// ============ PARTNERS ============

export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase.from("partners").select("*");
  if (error) {
    console.error("Erro ao buscar parceiros:", error);
    return [];
  }
  return data || [];
}

export async function createPartner(partner: Omit<Partner, "id" | "createdAt">) {
  const { data, error } = await supabase
    .from("partners")
    .insert([
      {
        ...partner,
        createdAt: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar parceiro:", error);
    return null;
  }
  return data;
}

export async function updatePartner(id: string, updates: Partial<Partner>) {
  const { data, error } = await supabase
    .from("partners")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar parceiro:", error);
    return null;
  }
  return data;
}

export async function deletePartner(id: string) {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) {
    console.error("Erro ao deletar parceiro:", error);
    return false;
  }
  return true;
}

// ============ ORDERS ============

export async function getOrders(): Promise<OrderRecord[]> {
  const { data, error } = await supabase.from("orders").select("*");
  if (error) {
    console.error("Erro ao buscar pedidos:", error);
    return [];
  }
  return (data || []).map((order) => ({
    ...order,
    items: JSON.parse(order.items || "[]"),
  }));
}

export async function createOrder(order: OrderRecord) {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        id: order.id,
        partnerId: order.partnerId,
        partnerName: order.partnerName,
        partnerPhone: order.partnerPhone,
        items: JSON.stringify(order.items),
        total: order.total,
        date: order.date,
        status: order.status,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar pedido:", error);
    return null;
  }
  return data;
}

export async function updateOrderStatus(id: string, status: OrderRecord["status"]) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar pedido:", error);
    return null;
  }
  return data;
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) {
    console.error("Erro ao deletar pedido:", error);
    return false;
  }
  return true;
}

// ============ RESELLER PURCHASES ============

export async function getResellerPurchases(partnerId: string): Promise<PurchasedProduct[]> {
  const { data, error } = await supabase
    .from("reseller_purchases")
    .select("*")
    .eq("partnerId", partnerId);

  if (error) {
    console.error("Erro ao buscar compras:", error);
    return [];
  }
  return data || [];
}

export async function addResellerPurchase(product: PurchasedProduct) {
  const { data, error } = await supabase
    .from("reseller_purchases")
    .insert([
      {
        partnerId: product.partnerId,
        productId: product.productId,
        ref: product.ref,
        quantity: product.quantity,
        color: product.color,
        size: product.size,
        purchaseDate: product.purchaseDate,
        price: product.price,
        name: product.name,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao adicionar compra:", error);
    return null;
  }
  return data;
}

// ============ SHOPPING CARTS ============

export async function getCart(partnerId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from("shopping_carts")
    .select("*")
    .eq("partnerId", partnerId);

  if (error) {
    console.error("Erro ao buscar carrinho:", error);
    return [];
  }
  return data || [];
}

export async function saveCart(partnerId: string, items: CartItem[]) {
  // Deletar carrinho antigo
  await supabase.from("shopping_carts").delete().eq("partnerId", partnerId);

  // Inserir novos itens
  if (items.length === 0) return true;

  const { error } = await supabase.from("shopping_carts").insert(
    items.map((item) => ({
      partnerId,
      productId: item.productId,
      ref: item.ref,
      name: item.name,
      price: item.price,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }))
  );

  if (error) {
    console.error("Erro ao salvar carrinho:", error);
    return false;
  }
  return true;
}

export async function clearCart(partnerId: string) {
  const { error } = await supabase
    .from("shopping_carts")
    .delete()
    .eq("partnerId", partnerId);

  if (error) {
    console.error("Erro ao limpar carrinho:", error);
    return false;
  }
  return true;
}
