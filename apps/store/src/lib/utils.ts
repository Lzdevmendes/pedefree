export { cn } from "@pedefree/shared";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatCurrency = (value: number): string => currencyFormatter.format(value);

export const normalizePhone = (phone: string): string =>
  phone.replace(/\D/g, "");
