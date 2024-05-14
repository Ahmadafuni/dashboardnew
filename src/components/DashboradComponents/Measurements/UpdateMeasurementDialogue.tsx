import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { measurementSchema } from "@/form_schemas/newMeasurementSchema";
import {
  measurement,
  measurementId,
  updateMeasurementModal,
} from "@/store/Measurement";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import UpdateMeasurementForm from "./UpdateMeasurementForm";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface Props {
  getMeasurements: any;
}
export default function UpdateMeasurementDialogue({ getMeasurements }: Props) {
  const MeasurementID = useRecoilValue(measurementId);
  const currentMeasurement = useRecoilValue(measurement);
  const [open, setOpen] = useRecoilState(updateMeasurementModal);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      MeasurementName: "",
      MeasurementUnit: "",
      MeasurementValue: "",
      SizeId: "",
    },
    values: currentMeasurement,
  });

  const onSubmit = async (data: z.infer<typeof measurementSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`measurements/${MeasurementID}`, data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(response.data.message);
      getMeasurements();
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
          <DialogTitle>{t("UpdateMeasurement")}</DialogTitle>
        </DialogHeader>
        <UpdateMeasurementForm form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="update-measurement">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              t("Update")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
