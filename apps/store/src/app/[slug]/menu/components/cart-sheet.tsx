"use client";

import { ConsumptionMethod } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { CartStep } from "./cart-step";
import { CustomerStep } from "./customer-step";
import { useCheckout } from "./use-checkout";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  consumptionMethod: ConsumptionMethod;
}

const CartSheet = ({
  open,
  onOpenChange,
  restaurantId,
  consumptionMethod,
}: CartSheetProps) => {
  const checkout = useCheckout(restaurantId, consumptionMethod, () => onOpenChange(false));

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) checkout.resetStep();
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="max-h-[92dvh] overflow-y-auto rounded-t-3xl p-0 pb-safe"
      >
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="text-base font-semibold">
            {checkout.step === "cart" ? "Meu pedido" : "Seus dados"}
          </SheetTitle>
        </SheetHeader>

        {checkout.step === "cart" ? (
          <CartStep
            couponCode={checkout.couponCode}
            setCouponCode={checkout.setCouponCode}
            couponError={checkout.couponError}
            setCouponError={checkout.setCouponError}
            appliedDiscount={checkout.appliedDiscount}
            isCouponPending={checkout.isCouponPending}
            onApplyCoupon={checkout.handleApplyCoupon}
            onRemoveCoupon={checkout.handleRemoveCoupon}
            discountedTotal={checkout.discountedTotal}
            onProceed={checkout.handleProceedToCustomer}
          />
        ) : (
          <CustomerStep
            isDineIn={checkout.isDineIn}
            discountedTotal={checkout.discountedTotal}
            isPending={checkout.isPending}
            customerName={checkout.customerName}
            setCustomerName={checkout.setCustomerName}
            customerPhone={checkout.customerPhone}
            setCustomerPhone={checkout.setCustomerPhone}
            tableNumber={checkout.tableNumber}
            setTableNumber={checkout.setTableNumber}
            consentAccepted={checkout.consentAccepted}
            setConsentAccepted={checkout.setConsentAccepted}
            errors={checkout.errors}
            setErrors={checkout.setErrors}
            onBack={checkout.resetStep}
            onSubmit={checkout.handleOrder}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
