import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { cuttingSendConfirmationSchema } from "@/form_schemas/dashboardSchema";
import {
  currentVariantId,
  cuttingSendConfirmationModal,
} from "@/store/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  getAllWorks: any;
  selectedSizes: { label: string; value: string }[];
};

export default function CuttingSendForConfirmationModal({
  getAllWorks,
  selectedSizes,
}: Props) {
  const [open, setOpen] = useRecoilState(cuttingSendConfirmationModal);
  const [isLoading, setIsLoading] = useState(false);
  const variantId = useRecoilValue(currentVariantId);
  const { t } = useTranslation();

  const [damagedItemPairs, setDamagedItemPairs] = useState<
    { label: string; value: string }[]
  >([]);
  const [quantityInNumPairs, setQuantityInNumPairs] = useState<
    { label: string; value: string }[]
  >([]);

  const form = useForm<z.infer<typeof cuttingSendConfirmationSchema>>({
    resolver: zodResolver(cuttingSendConfirmationSchema),
    defaultValues: {
      ClothGroups: [
        { ClothCount: "", ClothLength: "", ClothWidth: "", ClothWeight: "" },
      ],
      QuantityInKg: "",
      ReplacedItemInKG: "",
      DamagedItem: [],
      QuantityInNum: [],
      Notes: "",
    },
  });

  useEffect(() => {
    if (selectedSizes && selectedSizes.length > 0) {
      setDamagedItemPairs(
        selectedSizes.map((size) => ({ label: size.label, value: "" }))
      );
      setQuantityInNumPairs(
        selectedSizes.map((size) => ({ label: size.label, value: "" }))
      );
    }
  }, [selectedSizes]);

  const handleSubmit = async (
    data: z.infer<typeof cuttingSendConfirmationSchema>
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        DamagedItem: JSON.stringify(damagedItemPairs),
        QuantityInNum: JSON.stringify(quantityInNumPairs),
      };

      const newNote = await axios.post(
        `trackingmodels/sent/cutting/checking/variant/${variantId}`,
        payload,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newNote.data.message);
      form.reset();
      setDamagedItemPairs(
        selectedSizes.map((size) => ({ label: size.label, value: "" }))
      );
      setQuantityInNumPairs(
        selectedSizes.map((size) => ({ label: size.label, value: "" }))
      );
      getAllWorks();
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  const updatePair = (
    index: number,
    value: string,
    setPairs: React.Dispatch<
      React.SetStateAction<{ label: string; value: string }[]>
    >
  ) => {
    setPairs((prev) => {
      const updatedPairs = [...prev];
      updatedPairs[index].value = value;
      return updatedPairs;
    });
  };

  const renderTable = (
    pairs: { label: string; value: string }[],
    setPairs: React.Dispatch<
      React.SetStateAction<{ label: string; value: string }[]>
    >,
    label: string
  ) => (
    <div className="space-y-2">
      <label className="block font-medium text-sm">{label}</label>
      {pairs.map((pair, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            type="text"
            value={pair.label}
            readOnly
            className="w-full border p-1"
            placeholder="Size"
          />
          <Input
            type="text"
            value={pair.value}
            onChange={(e) => updatePair(index, e.target.value, setPairs)}
            className="w-full border p-1"
            placeholder="Value"
          />
        </div>
      ))}
    </div>
  );

  const [clothGroups, setClothGroups] = useState([
    { ClothCount: "", ClothLength: "", ClothWidth: "", ClothWeight: "" },
  ]);

  const addClothGroup = () => {
    setClothGroups((prev) => {
      const updatedGroups = [
        ...prev,
        { ClothCount: "", ClothLength: "", ClothWidth: "", ClothWeight: "" },
      ];


      form.setValue("ClothGroups", [
        ...form.getValues("ClothGroups"),
        { ClothCount: "", ClothLength: "", ClothWidth: "", ClothWeight: "" },
      ]);

      return updatedGroups;
    });
  };

  const removeLastClothGroup = () => {
    setClothGroups((prev) => {
      if (prev.length === 0) return prev; 
      const updatedGroups = prev.slice(0, -1);
      form.setValue(
        "ClothGroups",
        form.getValues("ClothGroups").slice(0, -1) 
      );

      return updatedGroups;
    });
  };

  // Render dynamic groups
  const renderClothGroups = () =>
    // @ts-ignore
    form.watch("ClothGroups")?.map((group, index) => (
      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <FormField
          control={form.control}
          // @ts-ignore
          name={`ClothGroups.${index}.ClothCount`}
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={`${t("ClothCount")} (${t("Cloth")} #${index + 1})`}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          // @ts-ignore
          name={`ClothGroups.${index}.ClothLength`}
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={`${t("ClothLength")} (${t("Cloth")} #${index + 1})`}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          // @ts-ignore
          name={`ClothGroups.${index}.ClothWidth`}
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={`${t("ClothWidth")} (${t("Cloth")} #${index + 1})`}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          // @ts-ignore
          name={`ClothGroups.${index}.ClothWeight`}
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={`${t("ClothWeight")} (${t("Cloth")} #${index + 1})`}
              field={field}
            />
          )}
        />
      </div>
    ));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Ensure max height and scroll when necessary */}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        {" "}
        {/* Scroll if the content exceeds 90vh */}
        <DialogHeader>
          <DialogTitle>{t("CuttingConfirmation")}</DialogTitle>
        </DialogHeader>
        {/* Form structure */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-4" // Use minimal gap for better spacing
            id="sent-confirmation"
          >
            {/* Single Column for better small screen experience */}
            <FormField
              control={form.control}
              name="QuantityInKg"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("QuantityInKg")}
                  field={field}
                />
              )}
            />

            {/* Render QuantityInNumber Table */}
            {renderTable(
              quantityInNumPairs,
              setQuantityInNumPairs,
              t("QuantityInNumber")
            )}

            {/* Cloth fields in a single column on small screens */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="ClothCount"
                render={({ field }) => (
                  <TextInputFieldForForm
                    placeholder=""
                    label={t("ClothCount")}
                    field={field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="ClothLength"
                render={({ field }) => (
                  <TextInputFieldForForm
                    placeholder=""
                    label={t("ClothLength")}
                    field={field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="ClothWidth"
                render={({ field }) => (
                  <TextInputFieldForForm
                    placeholder=""
                    label={t("ClothWidth")}
                    field={field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="ClothWeight"
                render={({ field }) => (
                  <TextInputFieldForForm
                    placeholder=""
                    label={t("ClothWeight")}
                    field={field}
                  />
                )}
              />
            </div> */}
            {renderClothGroups()}
            <div className="flex space-x-2">
              <Button type="button" onClick={addClothGroup} variant="default">
                {t("AddCloth")}
              </Button>
              {clothGroups.length > 1 && (
                <Button
                  type="button"
                  onClick={removeLastClothGroup}
                  variant="destructive"
                >
                  {t("RemoveLastCloth")}
                </Button>
              )}
            </div>

            {/* Render Damaged Item Table */}
            {renderTable(
              damagedItemPairs,
              setDamagedItemPairs,
              t("DamagedItem")
            )}

            <FormField
              control={form.control}
              name="ReplacedItemInKG"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("ReplacedItemInKg")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="Notes"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Notes")}
                  field={field}
                />
              )}
            />
          </form>
        </Form>
        {/* Footer with Buttons */}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="sent-confirmation">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("PleaseWait")}
              </>
            ) : (
              t("Send")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
