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
import { pauseUnpuaseReasoneSchema } from "@/form_schemas/dashboardSchema";
import { currentVariantId, pauseUnpauseModal } from "@/store/dashboard";
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

export default function PausingUnpausingReasoneModal({ getAllWorks }: Props) {
  const [open, setOpen] = useRecoilState(pauseUnpauseModal);
  const [isLoading, setIsLoading] = useState(false);
  const variantId = useRecoilValue(currentVariantId);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof pauseUnpuaseReasoneSchema>>({
    resolver: zodResolver(pauseUnpuaseReasoneSchema),
    defaultValues: {
      StopData: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof pauseUnpuaseReasoneSchema>) => {
    setIsLoading(true);
    try {
      const newNote = await axios.post(
          `trackingmodels/pauseunpause/variant/${variantId}`,
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
            <DialogTitle>{t("StopContinue")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid grid-cols-1 gap-2"
                id="pause-unpause"
            >
              <FormField
                  control={form.control}
                  name="StopData"
                  render={({ field }) => (
                      <TextInputFieldForForm
                          placeholder=""
                          label={t("Reason")}
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
            <Button type="submit" disabled={isLoading} form="pause-unpause">
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("PleaseWait")}
                  </>
              ) : (
                  t("Confirm")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
