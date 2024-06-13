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
import { rejectVariantSchema } from "@/form_schemas/dashboardSchema";
import { currentVariantId, rejectModal } from "@/store/dashboard";
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

interface Props {
  getWorks: any;
}
export default function RejectVariantDialog({ getWorks }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useRecoilState(rejectModal);
  const variantId = useRecoilValue(currentVariantId);

  const form = useForm<z.infer<typeof rejectVariantSchema>>({
    resolver: zodResolver(rejectVariantSchema),
    defaultValues: {
      Notes: "",
      DamagedItem: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof rejectVariantSchema>) => {
    setIsLoading(true);
    try {
      const newNote = await axios.post(
        `trackingmodels/reject/variant/${variantId}`,
        data,
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newNote.data.message);
      form.reset();
      getWorks();
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
          <DialogTitle>{t("RejectVariant")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-2"
            id="reject"
          >
            <FormField
              control={form.control}
              name="DamagedItem"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder=""
                  label={t("DamagedItem")}
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="Notes"
              render={({ field }) => (
                <TextInputFieldForForm
                  placeholder="Note"
                  label={t("Note")}
                  field={field}
                />
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
          <Button
            variant="destructive"
            type="submit"
            disabled={isLoading}
            form="reject"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Please wait")}
              </>
            ) : (
              t("Reject")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
