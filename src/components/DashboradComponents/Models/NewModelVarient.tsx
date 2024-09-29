// @ts-nocheck
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
import { Loader2, Plus, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil"; // Import useResetRecoilState
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import NewColor from "../Entities/Colors/NewColor";
import { getAllColorsList } from "@/services/Colors.services.ts";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function NewModelVarient() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modelId = searchParams.get("model");

  const colorsList = useRecoilValue(colorList);
  const sizesList = useRecoilValue(sizeList);
  const setNewColorModal = useSetRecoilState(newColorModal);
  const setColor = useSetRecoilState(colorList);
  const [varients, setVarients] = useRecoilState(modelVarientNew);
  const resetVariants = useResetRecoilState(modelVarientNew); // Create reset function
  const [isLoading, setIsLoading] = useState(false);
  const [tempVarients, setTempVarients] = useState([]); // Temporary storage for variants

  const form = useForm<z.infer<typeof ModelVarientSchema>>({
    resolver: zodResolver(ModelVarientSchema),
    defaultValues: {
      Color: "",
      Quantity: "",
      Sizes: [],
    },
  });

  const handleAddVariant = (data: z.infer<typeof ModelVarientSchema>) => {
    if (tempVarients.some((v) => v.Color === data.Color)) {
      toast.error("Cannot add the same color twice!");
      return;
    }

    if (+data.Quantity % data.Sizes.length !== 0) {
      toast.error(
          "Getting a decimal value after splitting the quantity into equal parts for all sizes. Please change the quantity!"
      );
      return;
    }

    const quantityPerSize = +data.Quantity / data.Sizes.length;
    const sizesWithQuantities = data.Sizes.map((size) => ({
      label: size.label ,
      value: quantityPerSize,
    }));

    // Temporarily store the variants to be submitted later
    setTempVarients([
      ...tempVarients,
      {
        Id: crypto.randomUUID(),
        Color: data.Color,
        Quantity: data.Quantity,
        QuantityDetails: +data.Quantity / data.Sizes.length,
        Sizes: sizesWithQuantities,
      },
    ]);

    form.reset();
  };

  const handleRemoveVariant = (id: string) => {
    setTempVarients(tempVarients.filter((variant) => variant.Id !== id));
  };

  const handleFinalSubmit = async () => {
    if (tempVarients.length === 0) {
      toast.error("Please add at least one variant before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const requests = tempVarients.map((variant) => {
        return axios.post(`/model/varients/${modelId}`, variant, {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        });
      });

      // Await all API calls
      await Promise.all(requests);

      toast.success("All variants submitted successfully!");
      resetVariants();
      setTempVarients([]); // Clear the temporary variant list after submission
      navigate(`/dashboard/orders/model/varients/${modelId}`);
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
    resetVariants(); // Clear variants state on component load
    getAllColorsList(setColor);
  }, []);

  return (
      <div className="space-y-2">
        <div className="w-full space-y-1 flex items-center">
          <h1 className="text-3xl font-bold">{t("ModelDetails")}</h1>
        </div>
        <Separator />
        <div className="space-y-2">
          <NewColor getColors={() => getAllColorsList(setColor)} />

          <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleAddVariant)} // Attach handleAddVariant to form submission
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
                            label={t("Colors")}
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
                            onClick={() => setNewColorModal(true)} // Open new color modal
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
                          label={t("Sizes")}
                          selectText="Select Size"
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
                          label={t("Quantity")}
                          field={field}
                      />
                  )}
              />
              <div className="flex justify-end col-span-3">
                <Button type="submit">
                  {t("AddDetail")}
                </Button>
              </div>
            </form>
          </Form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Colors")}</TableHead>
                <TableHead>{t("Sizes")}</TableHead>
                <TableHead>{t("Quantity")}</TableHead>
                <TableHead>{t("QuantityDetails")}</TableHead>
                <TableHead>{t("Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tempVarients.map((variant) => (
                  <TableRow key={variant.Id}>
                    <TableCell>
                      {colorsList.find((item) => item.value === variant.Color)?.label}
                    </TableCell>
                    <TableCell>{variant.Sizes.map((size) => size.label).join(", ")}</TableCell>
                    <TableCell>{variant.Quantity}</TableCell>
                    <TableCell>{variant.QuantityDetails}</TableCell>
                    <TableCell>
                      <Button
                          variant="destructive"
                          onClick={() => handleRemoveVariant(variant.Id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Button
              type="button"
              disabled={isLoading}
              onClick={handleFinalSubmit} // Handle final submission for all variants
          >
            {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("Please wait")}
                </>
            ) : (
                t("Done")
            )}
          </Button>
        </div>
      </div>
  );
}
