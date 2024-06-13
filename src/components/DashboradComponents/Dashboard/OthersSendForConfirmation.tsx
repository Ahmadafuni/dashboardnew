import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { othersSendConfirmationSchema } from "@/form_schemas/dashboardSchema";
import {
  currentVariantId,
  othersSendConfirmationModal,
} from "@/store/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  getAllWorks: any;
};
export default function OthersSendForConfirmation({ getAllWorks }: Props) {
  const [open, setOpen] = useRecoilState(othersSendConfirmationModal);
  const [isLoading, setIsLoading] = useState(false);
  const variantId = useRecoilValue(currentVariantId);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof othersSendConfirmationSchema>>({
    resolver: zodResolver(othersSendConfirmationSchema),
    defaultValues: {
      QuantityDelivered: "",
      QuantityReceived: "",
      DamagedItem: "0",
      Notes: "",
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof othersSendConfirmationSchema>
  ) => {
    setIsLoading(true);
    try {
      const newNote = await axios.post(
        `trackingmodels/sent/others/checking/variant/${variantId}`,
        data,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newNote.data.message);
      form.reset();
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> {t("Stop/Continue")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-2"
            id="sent-confirmation-others"
          >
            <FormField
              control={form.control}
              name="QuantityReceived"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Quantity Received")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="QuantityDelivered"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Quantity Delivered")}
                  field={field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="DamagedItem"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("Damaged Item")}
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
                Please wait
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
