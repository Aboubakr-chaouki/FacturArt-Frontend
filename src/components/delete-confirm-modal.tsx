import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  itemName: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  description,
  itemName,
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-[340px] gap-4 rounded-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-100 dark:bg-red-950 p-2.5 mt-0.5 flex-shrink-0">
              <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
              <DialogDescription className="mt-2 text-sm">
                {description}
                <span className="font-medium text-foreground"> {itemName}</span> ?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-xs text-muted-foreground px-0">
          Cette action est irréversible.
        </p>

        <DialogFooter className="flex gap-2 justify-end pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg"
            size="sm"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg"
            size="sm"
          >
            {isLoading ? "..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
