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
import { Loader2, Minus, Plus } from "lucide-react";
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

type ClothGroup = {
  ClothCount: string;
  ClothLength: string;
  ClothWidth: string;
  ClothWeight: string;
  QuantityInKg: string;
  ReplacedItemInKG: string;
  ClothPiecesPerPeriod: string; 

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
        { 
          ClothCount: "", 
          ClothLength: "", 
          ClothWidth: "", 
          ClothWeight: "",
          QuantityInKg: "",
          ReplacedItemInKG: "",
          ClothPiecesPerPeriod: ""
        },
      ],
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
      const errors = data.ClothGroups.map(validateClothGroup).filter(Boolean);

      if (errors.length > 0) {
        toast.error(errors[0]);
        setIsLoading(false);
        return;
      }
      
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

  const [clothGroups, setClothGroups] = useState<ClothGroup[]>([
    { 
      ClothCount: "", 
      ClothLength: "", 
      ClothWidth: "", 
      ClothWeight: "",
      QuantityInKg: "",
      ReplacedItemInKG: "",
      ClothPiecesPerPeriod: ""
    },
  ]);

  const addClothGroup = () => {
    setClothGroups((prev) => {
      const newGroup: ClothGroup = {
        ClothCount: "",
        ClothLength: "",
        ClothWidth: "",
        ClothWeight: "",
        QuantityInKg: "",
        ReplacedItemInKG: "",
        ClothPiecesPerPeriod: ""
      };
      const updatedGroups = [...prev, newGroup];

      form.setValue("ClothGroups", updatedGroups);

      return updatedGroups;
    });
  };

  const removeLastClothGroup = () => {
    setClothGroups((prev) => {
      if (prev.length <= 1) return prev;
      const updatedGroups = prev.slice(0, -1);
      form.setValue("ClothGroups", updatedGroups);
      return updatedGroups;
    });
  };

  const renderClothGroups = () =>
    form.watch("ClothGroups")?.map((group, index) => (
      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 p-4 border rounded-lg">
         <FormField
        control={form.control}
        name={`ClothGroups.${index}.QuantityInKg`}
        render={({ field }) => (
          <TextInputFieldForForm
            placeholder="أدخل الكمية بالكيلو"
            label={`${t("QuantityInKg")} (#${index + 1})`}
            field={field}
          />
        )}
      />
        <FormField
        control={form.control}
        name={`ClothGroups.${index}.ClothCount`}
        render={({ field }) => (
          <TextInputFieldForForm
            placeholder="أدخل عدد المدد"
            label={`${t("ClothCount")} (#${index + 1})`}
            field={{
              ...field,
              onChange: (e:any) => {
                field.onChange(e);
                // Add immediate validation if needed
                const value = e.target.value;
                if (!/^\d*$/.test(value)) {
                  form.setError(`ClothGroups.${index}.ClothCount`, {
                    type: 'manual',
                    message: 'يجب إدخال أرقام فقط'
                  });
                }
              }
            }}
          />
        )}
      />
        <FormField
          control={form.control}
          name={`ClothGroups.${index}.ClothLength`}
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={`${t("ClothLength")} (#${index + 1})`}
              field={field}
            />
          )}
        />
        <FormField
          control={form.control}
          name={`ClothGroups.${index}.ClothWidth`}
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={`${t("ClothWidth")} (#${index + 1})`}
              field={field}
            />
          )}
        />
         <FormField
        control={form.control}
        name={`ClothGroups.${index}.ClothWeight`}
        render={({ field }) => (
          <TextInputFieldForForm
            placeholder="أدخل الوزن بالكيلو (أقل من 5)"
            label={`${t("ClothWeight")} (#${index + 1})`}
            field={{
              ...field,
              onChange: (e: any) => {
                const value = e.target.value;
                if (!/^\d*(\.\d*)?$/.test(value)) {
                  form.setError(`ClothGroups.${index}.ClothWeight`, {
                    type: "manual",
                    message: "الوزن يجب أن يكون رقمًا فقط.",
                  });
                } else if (parseFloat(value) > 5) {
                  form.setError(`ClothGroups.${index}.ClothWeight`, {
                    type: "manual",
                    message: "الوزن يجب أن يكون أقل من 5 كيلوغرامات.",
                  });
                } else {
                  form.clearErrors(`ClothGroups.${index}.ClothWeight`);
                }
                field.onChange(e);
              },
            }}
          />
        )}
      />
        <FormField
          control={form.control}
          name={`ClothGroups.${index}.ReplacedItemInKG`}
          render={({ field }) => (
            <TextInputFieldForForm
              placeholder=""
              label={`${t("ReplacedItemInKg")} (#${index + 1})`}
              field={field}
            />
          )}
        />
        <FormField
        control={form.control}
        name={`ClothGroups.${index}.ClothPiecesPerPeriod`}
        render={({ field }) => (
          <TextInputFieldForForm
            placeholder=""
            label={`${t("ClothPiecesPerPeriod")} (#${index + 1})`}
            field={field}
          />
        )}
      />
      </div>
    ));

    const validateClothGroup = (group: ClothGroup) => {
      const { ClothCount, ClothWeight, QuantityInKg, ReplacedItemInKG } = group;
    
      if (!/^\d+(\.\d+)?$/.test(ClothWeight) || parseFloat(ClothWeight) > 5) {
        return "وزن المدة يجب أن يكون رقمًا وأقل من 5 كيلوغرامات.";
      }
    
      const totalWeight =
        (parseInt(ClothCount) || 0) * (parseFloat(ClothWeight) || 0) +
        (parseFloat(ReplacedItemInKG) || 0);
    
      if (totalWeight > parseFloat(QuantityInKg || "0")) {
        return `الوزن الكلي (${totalWeight}) يجب أن يكون أقل أو يساوي كمية الكيلو المدخلة (${QuantityInKg}).`;
      }
    
      return null;
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("CuttingConfirmation")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-4"
            id="sent-confirmation"
          >
            {renderTable(
              quantityInNumPairs,
              setQuantityInNumPairs,
              t("QuantityInNumber")
            )}

            {renderClothGroups()}
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={addClothGroup}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md flex items-center justify-center"
              >
                <Plus size={20} />
              </button>

              {clothGroups.length > 1 && (
                <button
                  type="button"
                  onClick={removeLastClothGroup}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md flex items-center justify-center"
                >
                  <Minus size={20} />
                </button>
              )}
            </div>

            {renderTable(
              damagedItemPairs,
              setDamagedItemPairs,
              t("DamagedItem")
            )}

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