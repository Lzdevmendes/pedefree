"use client";

import { BellIcon, ClockIcon, HistoryIcon, ListIcon, LogOutIcon, PauseCircleIcon, PlayCircleIcon, RefreshCwIcon, UtensilsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { elapsed,METHOD_LABEL, OrderCard } from "./order-card";
import { useKitchenBoard } from "./use-kitchen-board";

interface KitchenBoardProps {
  slug: string;
}

const KitchenBoard = ({ slug }: KitchenBoardProps) => {
  const {
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
  } = useKitchenBoard(slug);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Painel da Cozinha</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={`h-11 w-11 rounded-full ${isPaused ? "border-red-500 bg-red-50 text-red-600" : ""}`}
              onClick={togglePause}
              aria-label={isPaused ? "Pausado — clique para aceitar pedidos" : "Clique para pausar pedidos"}
              title={isPaused ? "Pausado — clique para aceitar pedidos" : "Clique para pausar pedidos"}
            >
              {isPaused ? <PauseCircleIcon size={18} /> : <PlayCircleIcon size={18} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-11 w-11 rounded-full ${soundEnabled ? "" : "opacity-40"}`}
              onClick={toggleSound}
              aria-label={soundEnabled ? "Silenciar alertas" : "Ativar alertas"}
              title={soundEnabled ? "Alertas sonoros: ligado" : "Alertas sonoros: desligado"}
            >
              <BellIcon size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full"
              onClick={fetchOrders}
              disabled={isPending}
              aria-label="Atualizar"
            >
              <RefreshCwIcon size={18} className={isPending ? "animate-spin" : ""} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full"
              onClick={handleLogout}
              aria-label="Sair"
            >
              <LogOutIcon size={18} />
            </Button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition ${
              activeTab === "orders"
                ? "bg-foreground text-background"
                : "bg-gray-100 text-muted-foreground"
            }`}
          >
            <ListIcon size={14} />
            Pedidos
            {pending.length + inPrep.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {pending.length + inPrep.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition ${
              activeTab === "products"
                ? "bg-foreground text-background"
                : "bg-gray-100 text-muted-foreground"
            }`}
          >
            <UtensilsIcon size={14} />
            Produtos
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition ${
              activeTab === "history"
                ? "bg-foreground text-background"
                : "bg-gray-100 text-muted-foreground"
            }`}
          >
            <HistoryIcon size={14} />
            Histórico
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            {products.length === 0 && !isPending ? (
              <div className="mt-16 text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum produto cadastrado
                </p>
              </div>
            ) : (
              Object.entries(byCategory).map(([cat, prods]) => (
                <div key={cat} className="mb-5">
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {cat}
                  </h3>
                  <div className="space-y-2">
                    {prods.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm"
                      >
                        <span className={`text-sm font-medium ${!p.isAvailable ? "text-muted-foreground line-through" : ""}`}>
                          {p.name}
                        </span>
                        <button
                          disabled={togglingProductId === p.id}
                          onClick={() => handleToggleProduct(p)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            p.isAvailable
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                        >
                          {togglingProductId === p.id
                            ? "..."
                            : p.isAvailable
                            ? "Disponível"
                            : "Esgotado"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <>
            {isPaused && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700 text-center">
                ⏸ Pedidos pausados — novos pedidos não estão sendo aceitos
              </div>
            )}
            {orders.length === 0 && !isPending ? (
              <div className="mt-16 text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum pedido pendente
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Atualiza automaticamente a cada 30 segundos
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-yellow-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold">
                      {pending.length}
                    </span>
                    Aguardando
                  </h2>
                  <div className="space-y-3">
                    {pending.length === 0 ? (
                      <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                        Sem pedidos aguardando
                      </p>
                    ) : (
                      pending.map((o) => (
                        <OrderCard
                          key={o.id}
                          order={o}
                          updatingId={updatingId}
                          cancellingId={cancellingId}
                          onAdvance={handleAdvanceStatus}
                          onCancel={handleCancel}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-blue-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold">
                      {inPrep.length}
                    </span>
                    Em preparo
                  </h2>
                  <div className="space-y-3">
                    {inPrep.length === 0 ? (
                      <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                        Nada em preparo
                      </p>
                    ) : (
                      inPrep.map((o) => (
                        <OrderCard
                          key={o.id}
                          order={o}
                          updatingId={updatingId}
                          cancellingId={cancellingId}
                          onAdvance={handleAdvanceStatus}
                          onCancel={handleCancel}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Últimas 24 horas</p>
              <button
                onClick={fetchHistory}
                disabled={isPending}
                className="text-xs text-blue-500 hover:text-blue-700 disabled:opacity-40"
              >
                Atualizar
              </button>
            </div>
            {historyOrders.length === 0 && !isPending ? (
              <div className="mt-16 text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum pedido finalizado
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pedidos concluídos ou cancelados nas últimas 24h aparecem aqui
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {historyOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`rounded-2xl border p-4 shadow-sm ${
                      order.status === "FINISHED"
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold">#{order.id}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            order.status === "FINISHED"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {order.status === "FINISHED" ? "Pronto" : "Cancelado"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ClockIcon size={13} />
                        {elapsed(order.createdAt)}
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {METHOD_LABEL[order.consumptionMethod] ?? order.consumptionMethod}
                      {order.tableNumber ? ` · Mesa ${order.tableNumber}` : ""}
                      {order.customerName ? ` · ${order.customerName}` : ""}
                    </p>
                    <ul className="space-y-1">
                      {order.orderProducts.map((op, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {op.quantity}x {op.product.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && orders.length > 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Atualiza a cada {hasActiveOrders ? "15" : "30"} segundos
          </p>
        )}
      </div>
    </div>
  );
};

export default KitchenBoard;
