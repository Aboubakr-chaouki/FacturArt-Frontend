import { Plus, Trash2, List } from "lucide-react";
import { FieldValues, UseFormReturn, useFieldArray, FieldArrayPath, Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentLinesSectionProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  title: string;
  description: string;
}

export function DocumentLinesSection<T extends FieldValues>({ 
  form, 
  title, 
  description 
}: DocumentLinesSectionProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines" as FieldArrayPath<T>,
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <List className="size-5 text-primary" />
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={() =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              append({ description: "", quantity: 1, unitPrice: 0, tvaRate: 20 } as any)
            }
          >
            <Plus className="size-3.5" /> Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border p-3 rounded-lg bg-muted/30 transition-colors hover:bg-muted/50"
          >
            <div className="md:col-span-5">
              <FormField
                control={form.control}
                name={`lines.${index}.description` as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={index > 0 ? "sr-only" : "text-xs"}>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Description de l'article" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name={`lines.${index}.quantity` as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={index > 0 ? "sr-only" : "text-xs"}>
                      Qté
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name={`lines.${index}.unitPrice` as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={index > 0 ? "sr-only" : "text-xs"}>
                      Prix Unitaire
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name={`lines.${index}.tvaRate` as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={index > 0 ? "sr-only" : "text-xs"}>
                      TVA %
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="5.5">5.5%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-1 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive h-9 w-9"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
