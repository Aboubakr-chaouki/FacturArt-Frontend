import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalElements: number;
  pageSize: number;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalElements,
  pageSize,
}: PaginationProps) {
  const startElement = page * pageSize + 1;
  const endElement = Math.min((page + 1) * pageSize, totalElements);

  if (totalPages <= 1 && totalElements <= pageSize) return null;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        Affichage de {totalElements === 0 ? 0 : startElement} à {endElement} sur {totalElements} résultats
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(0)}
          disabled={page === 0}
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="text-sm font-medium">
          Page {page + 1} sur {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
