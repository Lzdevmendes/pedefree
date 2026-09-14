"use client";

import { Trash2Icon } from "lucide-react";
import { useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteRestaurantButtonProps {
  restaurantId: string;
  restaurantName: string;
  onDelete: (id: string) => Promise<void>;
}

export const DeleteRestaurantButton = ({
  restaurantId,
  restaurantName,
  onDelete,
}: DeleteRestaurantButtonProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="h-8 rounded-xl text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2Icon size={13} />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir &quot;{restaurantName}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação é <strong>irreversível</strong>. Todos os produtos, categorias, cupons,
            pedidos e avaliações deste restaurante serão apagados permanentemente. Não é
            possível desfazer depois de confirmar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              startTransition(async () => {
                await onDelete(restaurantId);
              });
            }}
          >
            Sim, excluir permanentemente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
