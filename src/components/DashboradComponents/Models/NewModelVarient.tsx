import ComboSelectFieldForForm from "@/components/common/ComboSelectFieldForForm";
import MultiSelectFieldForForm from "@/components/common/MultiSelectFieldForForm";
import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModelVarientSchema } from "@/form_schemas/newModelSchema";
import { colorList, newColorModal } from "@/store/Color";
import { modelVarientNew } from "@/store/Models";
import { sizeList } from "@/store/Sizes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { z } from "zod";

export default function NewModelVarient() {
  // Dropdown
  const colorsList = useRecoilValue(colorList);
  const sizesList = useRecoilValue(sizeList);
  // Color Modal
  const setNewColorModal = useSetRecoilState(newColorModal);
  // Varients
  const [varients, setVarients] = useRecoilState(modelVarientNew);
  // Form fields
  const form = useForm<z.infer<typeof ModelVarientSchema>>({
    resolver: zodResolver(ModelVarientSchema),
    defaultValues: {
      Color: "",
      Quantity: "",
      Sizes: [],
    },
  });
  // Form submit function
  const onSubmit = async (data: z.infer<typeof ModelVarientSchema>) => {
    setVarients([
      // @ts-expect-error
      ...varients,
      // @ts-expect-error
      {
        Color: data.Color,
        Quantity: data.Quantity,
        Sizes: data.Sizes,
      },
    ]);

    form.reset();
  };
  // Remove Varient
  const removeVarient = (color: string) => {
    // const tempVarients = varients.filter((e) => e.Color !== color);
    // @ts-expect-error
    setVarients(varients.filter((e) => e.Color !== color));
  };
  return (
    <div className="space-y-2">
      <div className="w-full space-y-1 flex items-center">
        <h1 className="text-3xl font-bold">Model Varient</h1>
      </div>
      <Separator />
      <div className="space-y-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-3 gap-2"
            id="model-varient"
          >
            <FormField
              control={form.control}
              name="Color"
              render={({ field }) => (
                <div className="flex gap-x-1">
                  <ComboSelectFieldForForm
                    field={field}
                    label="Color"
                    placeholder="Search Color..."
                    emptyBox="No color found"
                    form={form}
                    name="Color"
                    selectText="Select Color"
                    items={colorsList}
                  />
                  <Button
                    variant="outline"
                    className="mt-8"
                    onClick={() => setNewColorModal(true)}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="Sizes"
              render={({ field }) => (
                <MultiSelectFieldForForm
                  label="Sizes"
                  selectText="Select Color"
                  form={form}
                  name="Sizes"
                  items={sizesList}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="Quantity"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder="Enter quantity"
                  label="Quantity"
                  field={field}
                />
              )}
            />
          </form>
        </Form>
        <div className="flex justify-end">
          <Button type="submit" form="model-varient">
            Add Varient
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {varients.map((e) => (
              // @ts-expect-error
              <TableRow key={e.Color}>
                <TableCell>
                  {/* @ts-expect-error */}
                  {colorsList.find((item) => item.value === e.Color).label}
                </TableCell>
                {/* @ts-expect-error */}
                <TableCell>{e.Sizes.map((e) => e.label).join(", ")}</TableCell>
                {/* @ts-expect-error */}
                <TableCell>{e.Quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    // @ts-expect-error
                    onClick={() => removeVarient(e.Color)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
