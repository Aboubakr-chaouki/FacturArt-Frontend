import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { DocumentLineRequest } from "@/lib/configs/interface/quote";

interface DocumentLinesEditorProps {
  lines: DocumentLineRequest[];
  onChange: (lines: DocumentLineRequest[]) => void;
}

const DEFAULT_LINE: DocumentLineRequest = {
  description: "",
  quantity: 1,
  unitPrice: 0,
  tvaRate: 20,
};

export const DocumentLinesEditor = ({ lines, onChange }: DocumentLinesEditorProps) => {
  const addLine = () => {
    onChange([...lines, { ...DEFAULT_LINE }]);
  };

  const removeLine = (index: number) => {
    const newLines = [...lines];
    newLines.splice(index, 1);
    onChange(newLines);
  };

  const updateLine = (index: number, field: keyof DocumentLineRequest, value: string | number) => {
    const newLines = [...lines];
    newLines[index] = {
      ...newLines[index],
      [field]: field === "description" ? value : Number(value),
    };
    onChange(newLines);
  };

  const calculateLineTotal = (line: DocumentLineRequest) => {
    return line.quantity * line.unitPrice;
  };

  const totals = lines.reduce(
    (acc, line) => {
      const ht = line.quantity * line.unitPrice;
      const tva = ht * (line.tvaRate / 100);
      return {
        ht: acc.ht + ht,
        tva: acc.tva + tva,
        ttc: acc.ttc + ht + tva,
      };
    },
    { ht: 0, tva: 0, ttc: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[45%]">Description</TableHead>
              <TableHead className="w-[10%] text-right">Qté</TableHead>
              <TableHead className="w-[15%] text-right">Prix Unitaire HT</TableHead>
              <TableHead className="w-[10%] text-right">TVA (%)</TableHead>
              <TableHead className="w-[15%] text-right">Total HT</TableHead>
              <TableHead className="w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={line.description}
                    onChange={(e) => updateLine(index, "description", e.target.value)}
                    placeholder="Désignation de la prestation ou du produit"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, "quantity", e.target.value)}
                    className="text-right"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(index, "unitPrice", e.target.value)}
                    className="text-right"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={line.tvaRate}
                    onChange={(e) => updateLine(index, "tvaRate", e.target.value)}
                    className="text-right"
                  />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {calculateLineTotal(line).toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLine(index)}
                    disabled={lines.length <= 1}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-start">
        <Button type="button" variant="outline" size="sm" onClick={addLine} className="gap-2">
          <Plus className="size-4" /> Ajouter une ligne
        </Button>

        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total HT</span>
            <span>{totals.ht.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">TVA</span>
            <span>{totals.tva.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total TTC</span>
            <span className="text-primary">
              {totals.ttc.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
