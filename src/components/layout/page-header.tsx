import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  addButtonLabel?: string;
  onAddClick?: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  addButtonLabel,
  onAddClick,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {Icon && <Icon className="size-6 text-primary" />}
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {onAddClick && addButtonLabel && (
          <Button onClick={onAddClick} className="rounded-full">
            <Plus className="size-4 mr-2" />
            {addButtonLabel}
          </Button>
        )}
      </div>

      {onSearchChange !== undefined && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
