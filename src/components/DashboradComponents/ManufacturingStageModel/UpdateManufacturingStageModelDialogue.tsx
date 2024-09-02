import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { manufacturingStageSchema } from "@/form_schemas/newManufacturingStageSchema";
import {
  manufacturingStage,
  manufacturingStageId,
  updateManufacturingStageModal,
} from "@/store/ManufacturingStage";
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
import UpdateManufacturingStageModelForm from "./UpdateManufacturingStageModelForm.tsx";

interface Props {
  getStages: any;
}
export default function UpdateManufacturingStageModelDialogue({
  getStages,
}: Props) {
  const stageID = useRecoilValue(manufacturingStageId);
  const currentStage = useRecoilValue(manufacturingStage);
  const [open, setOpen] = useRecoilState(updateManufacturingStageModal);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(manufacturingStageSchema),
    defaultValues: {
      department: "",
      stageName: "",
      workDescription: "",
      duration: "",
    },
    values: currentStage,
  });
  const onSubmit = async (data: z.infer<typeof manufacturingStageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`manufacturingstage/${stageID}`, data, {
        headers: {
          Authorization: `bearer ${Cookies.get("access_token")}`,
        },
      });
      toast.success(response.data.message);
      getStages();
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
          <DialogTitle>{t("UpdateManufacturingStage")}</DialogTitle>
        </DialogHeader>
        <UpdateManufacturingStageModelForm form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Close")}
          </Button>
          <Button type="submit" disabled={isLoading} form="update-stage">
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
