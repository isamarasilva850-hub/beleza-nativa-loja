import { useEffect, useState } from "react";
import { supabase, Partner, OrderRecord, PurchasedProduct, CartItem } from "@/lib/supabase";

// ============ PARTNERS HOOK ============
export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    const data = await supabase.from("partners").select("*");
    if (!data.error) {
      setPartners(data.data || []);
    }
    setLoading(false);
  };

  const addPartner = async (partner: Omit<Partner, "id" | "createdAt">) => {
    const id = Date.now().toString(36);
    const { data, error } = await supabase
      .from("partners")
      .insert([{ ...partner, id, createdAt: new Date().toISOString() }])
      .select()
      .single();

    if (!error) {
      setPartners([...partners, data]);
      return data;
    }
    return null;
  };

  const updatePartner = async (id: string, updates: Partial<Partner>) => {
    const { data, error } = await supabase
      .from("partners")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (!error) {
      setPartners(partners.map((p) => (p.id === id ? data : p)));
      return data;
    }
    return null;
  };

  return { partners, loading, addPartner, updatePartner, refetch: loadPartners };
}

// ============ ORDERS HOOK ============
export function useOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*");
    if (!error) {
      const parsedOrders = (data || []).map((order) => ({
        ...order,
        items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
      }));
      setOrders(parsedOrders);
    }
    setLoading(false);
  };

  const addOrder = async (order: OrderRecord) => {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          ...order,
          items: JSON.stringify(order.items),
        },
      ])
      .select()
      .single();

    if (!error) {
      setOrders([{ ...data, items: order.items }, ...orders]);
      return data;
    }
    return null;
  };

  const updateStatus = async (id: string, status: OrderRecord["status"]) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (!error) {
      setOrders(
        orders.map((o) =>
          o.id === id ? { ...o, status } : o
        )
      );
      return data;
    }
    return null;
  };

  return { orders, loading, addOrder, updateStatus, refetch: loadOrders };
}

// ============ RESELLER PURCHASES HOOK ============
export function useResellerPurchases(partnerId: string) {
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (partnerId) {
      loadPurchases();
    }
  }, [partnerId]);

  const loadPurchases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reseller_purchases")
      .select("*")
      .eq("partnerId", partnerId);

    if (!error) {
      setPurchases(data || []);
    }
    setLoading(false);
  };

  return { purchases, loading, refetch: loadPurchases };
}

// ============ SHOPPING CART HOOK ============
export function useShoppingCart(partnerId: string) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (partnerId) {
      loadCart();
    }
  }, [partnerId]);

  const loadCart = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shopping_carts")
      .select("*")
      .eq("partnerId", partnerId);

    if (!error) {
      setCart(data || []);
    }
    setLoading(false);
  };

  const saveCart = async (items: CartItem[]) => {
    // Deletar carrinho antigo
    await supabase.from("shopping_carts").delete().eq("partnerId", partnerId);

    if (items.length === 0) {
      setCart([]);
      return true;
    }

    // Inserir novos itens
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

    if (!error) {
      setCart(items);
      return true;
    }
    return false;
  };

  return { cart, loading, saveCart, refetch: loadCart };
}
