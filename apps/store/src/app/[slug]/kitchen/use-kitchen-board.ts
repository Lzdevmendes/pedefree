import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

import {
  cancelOrder,
  getKitchenOrderHistory,
  getKitchenOrders,
  getKitchenProducts,
  getRestaurantPauseStatus,
  kitchenLogout,
  kitchenToggleProduct,
  toggleRestaurantPause,
  updateOrderStatus,
} from "./actions";
import { Order, STATUS_NEXT } from "./order-card";

export type Tab = "orders" | "products" | "history";

export interface KitchenProduct {
  id: string;
  name: string;
  isAvailable: boolean;
  menuCategory: { name: string };
}

function playNotificationSound() {
  try {
    const ctx = new window.AudioContext();
    const beep = (delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.35);
    };
    beep(0);
    beep(0.45);
    setTimeout(() => ctx.close(), 3000);
  } catch {
    // Web Audio não disponível
  }
}

export function useKitchenBoard(slug: string) {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<KitchenProduct[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [togglingProductId, setTogglingProductId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [, setTick] = useState(0);

  const knownOrderIds = useRef<Set<number>>(new Set());
  const isFirstFetch = useRef(true);

  const fetchOrders = useCallback(() => {
    startTransition(async () => {
      const data = await getKitchenOrders(slug);
      const incoming = data as Order[];

      if (!isFirstFetch.current && soundEnabled) {
        const newOrders = incoming.filter((o) => !knownOrderIds.current.has(o.id));
        if (newOrders.length > 0) {
          playNotificationSound();
        }
      }
      isFirstFetch.current = false;
      knownOrderIds.current = new Set(incoming.map((o) => o.id));
      setOrders(incoming);
    });
  }, [slug, soundEnabled]);

  const hasActiveOrders = orders.some(
    (o) => o.status === "PENDING" || o.status === "IN_PREPARATION"
  );

  useEffect(() => {
    fetchOrders();
    let interval = setInterval(fetchOrders, hasActiveOrders ? 15_000 : 30_000);

    const handleVisibility = () => {
      clearInterval(interval);
      if (document.visibilityState === "visible") {
        fetchOrders();
        interval = setInterval(fetchOrders, hasActiveOrders ? 15_000 : 30_000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchOrders, hasActiveOrders]);

  useEffect(() => {
    getRestaurantPauseStatus(slug).then(setIsPaused);
  }, [slug]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const msUntilNextMinute =
      (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds();

    const timeoutId = setTimeout(() => {
      setTick((t) => t + 1);
      intervalId = setInterval(() => setTick((t) => t + 1), 60_000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleAdvanceStatus = useCallback(async (order: Order) => {
    const next = STATUS_NEXT[order.status];
    if (!next) return;
    setUpdatingId(order.id);
    await updateOrderStatus(order.id, next, slug);
    fetchOrders();
    setUpdatingId(null);
  }, [fetchOrders, slug]);

  const handleCancel = useCallback(async (order: Order) => {
    if (!window.confirm(`Cancelar pedido #${order.id}?`)) return;
    setCancellingId(order.id);
    await cancelOrder(order.id, slug);
    fetchOrders();
    setCancellingId(null);
  }, [fetchOrders, slug]);

  const handleLogout = useCallback(async () => {
    await kitchenLogout(slug);
    window.location.reload();
  }, [slug]);

  const fetchProducts = useCallback(() => {
    startTransition(async () => {
      const data = await getKitchenProducts(slug);
      setProducts(data as KitchenProduct[]);
    });
  }, [slug]);

  const fetchHistory = useCallback(() => {
    startTransition(async () => {
      const data = await getKitchenOrderHistory(slug);
      setHistoryOrders(data as Order[]);
    });
  }, [slug]);

  useEffect(() => {
    if (activeTab === "products") fetchProducts();
    if (activeTab === "history") fetchHistory();
  }, [activeTab, fetchProducts, fetchHistory]);

  const handleToggleProduct = useCallback(async (product: KitchenProduct) => {
    setTogglingProductId(product.id);
    await kitchenToggleProduct(product.id, !product.isAvailable, slug);
    fetchProducts();
    setTogglingProductId(null);
  }, [fetchProducts, slug]);

  const togglePause = useCallback(async () => {
    await toggleRestaurantPause(slug);
    setIsPaused((v) => !v);
  }, [slug]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((v) => !v);
  }, []);

  const pending = useMemo(() => orders.filter((o) => o.status === "PENDING"), [orders]);
  const inPrep = useMemo(() => orders.filter((o) => o.status === "IN_PREPARATION"), [orders]);

  const byCategory = useMemo(() => {
    const result: Record<string, KitchenProduct[]> = {};
    for (const p of products) {
      const cat = p.menuCategory.name;
      if (!result[cat]) result[cat] = [];
      result[cat].push(p);
    }
    return result;
  }, [products]);

  return {
    activeTab,
    setActiveTab,
    orders,
    products,
    historyOrders,
    isPending,
    updatingId,
    cancellingId,
    togglingProductId,
    soundEnabled,
    isPaused,
    hasActiveOrders,
    pending,
    inPrep,
    byCategory,
    handleAdvanceStatus,
    handleCancel,
    handleLogout,
    handleToggleProduct,
    fetchOrders,
    fetchHistory,
    togglePause,
    toggleSound,
  };
}
