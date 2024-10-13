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
import { othersSendConfirmationSchema } from "@/form_schemas/dashboardSchema";
import { currentVariantId, othersSendConfirmationModal } from "@/store/dashboard";
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
  selectedSizes: {label: string , value:  string}[];
  quantityReceived: any[];
};

export default function OthersSendForConfirmation({ getAllWorks, selectedSizes, quantityReceived }: Props) {
  const [open, setOpen] = useRecoilState(othersSendConfirmationModal);
  const [isLoading, setIsLoading] = useState(false);
  const variantId = useRecoilValue(currentVariantId);
  const { t } = useTranslation();

  const [damagedItemPairs, setDamagedItemPairs] = useState<{ label: string; value: string }[]>([]);
  const [quantityReceivedPairs, setQuantityReceivedPairs] = useState<{ label: string; value: string }[]>([]);
  const [quantityDeliveredPairs, setQuantityDeliveredPairs] = useState<{ label: string; value: string }[]>([]);

  const form = useForm<z.infer<typeof othersSendConfirmationSchema>>({
    resolver: zodResolver(othersSendConfirmationSchema),
    defaultValues: {
      QuantityReceived: [],
      QuantityDelivered: [],
      DamagedItem: [],
      Notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      setQuantityReceivedPairs(quantityReceived.map(size => ({ label: size.label, value: size.value })));
      setQuantityDeliveredPairs(selectedSizes.map(size => ({ label: size.label , value: "" })));
      setDamagedItemPairs(selectedSizes.map(size => ({ label: size.label , value: ""})));

      form.reset({
        QuantityReceived: quantityReceived.map(item => ({ label: item.label, value: item.value })),
        QuantityDelivered: [],
        DamagedItem: [],
        Notes: "",
      });
    }
  }, [open, selectedSizes, quantityReceived, form]);

  const handleSubmit = async (data: z.infer<typeof othersSendConfirmationSchema>) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        QuantityReceived: JSON.stringify(quantityReceivedPairs),
        DamagedItem: JSON.stringify(damagedItemPairs),
        QuantityDelivered: JSON.stringify(quantityDeliveredPairs)
      };


      const newNote = await axios.post(
          `trackingmodels/sent/others/checking/variant/${variantId}`,
          payload,
          {
            headers: {
              Authorization: `bearer ${Cookies.get("access_token")}`,
            },
          }
      );
      toast.success(newNote.data.message);
      form.reset();
      setQuantityReceivedPairs(selectedSizes.map(size => ({label: size.label , value: "" })));
      setQuantityDeliveredPairs(selectedSizes.map(size => ({ label: size.label , value: "" })));
      setDamagedItemPairs(selectedSizes.map(size => ({ label: size.label , value: "" })));
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

  const updatePair = (index: number, value: string, setPairs: React.Dispatch<React.SetStateAction<{ label: string; value: string }[]>>) => {
    setPairs((prev) => {
      const updatedPairs = [...prev];
      updatedPairs[index].value = value;
      return updatedPairs;
    });
  };

  const renderTable = (pairs: { label: string; value: string }[], setPairs: React.Dispatch<React.SetStateAction<{ label: string; value: string }[]>>, label: string) => (
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

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("Confirmation")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid grid-cols-1 gap-2"
                id="sent-confirmation-others"
            >
              {renderTable(quantityReceivedPairs, setQuantityReceivedPairs, t("QuantityReceived"))}
              {renderTable(quantityDeliveredPairs, setQuantityDeliveredPairs, t("QuantityDelivered"))}
              {renderTable(damagedItemPairs, setDamagedItemPairs, t("DamagedItems"))}
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
            <Button
                type="submit"
                disabled={isLoading}
                form="sent-confirmation-others"
                
            >
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
