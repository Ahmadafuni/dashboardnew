// @ts-nocheck
import { manufacturingStageSchema } from "@/form_schemas/newManufacturingStageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ManufacturingStageModelForm from "./ManufacturingStageModelForm.tsx";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Loader2, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import UpdateManufacturingStageModelDialogue from "./UpdateManufacturingStageModelDialogue.tsx";
import { useSetRecoilState } from "recoil";
import {
  manufacturingStage,
  manufacturingStageId,
  updateManufacturingStageModal,
} from "@/store/ManufacturingStage";
import {useTranslation} from "react-i18next";
import {
  deleteStageModel,
  getAllStageModel, getStagesIdModel,
  toggleStageDownModel,
  toggleStageUpModel
} from "@/services/ManufacturingStageModel.services.ts";

export default function ViewManufacturingStageModel() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();


  const setUpdateStageModal = useSetRecoilState(updateManufacturingStageModal);
  const setStageId = useSetRecoilState(manufacturingStageId);
  const setStage = useSetRecoilState(manufacturingStage);

  // Stages
  const [stages, setStages] = useState<any[]>([]);
  const form = useForm<z.infer<typeof manufacturingStageSchema>>({
    resolver: zodResolver(manufacturingStageSchema),
    defaultValues: {
      department: "",
      stageName: "",
      workDescription: "",
      duration: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof manufacturingStageSchema>) => {
    setIsLoading(true);
    try {
      const newMS = await axios.post(
        "manufacturingstagemodel/",
        { ...data, model: id },
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newMS.data.message);
      getAllStageModel(setStages, id);
      form.reset();
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };
  const SubmitButton = () => {
    return (
      <Button type="submit" form="stages">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
            t("Add")
        )}
      </Button>
    );
  };

  // Toggle Up
  const toggleUp = async (ID: number) => {
    try {
      await toggleStageUpModel(ID);
      getAllStageModel(setStages, id);
    } catch (error) {}
  };
  // Toggle Down
  const toggleDown = async (ID: number) => {
    try {
      await toggleStageDownModel(ID);
      getAllStageModel(setStages, id);
    } catch (error) {}
  };

  useEffect(() => {
    getAllStageModel(setStages, id);
  }, []);
  return (
    <div className="space-y-1">
      <UpdateManufacturingStageModelDialogue
        getStages={() => getAllStageModel(setStages, id)}
      />
      <ManufacturingStageModelForm
        form={form}
        onSubmit={onSubmit}
        SubmitButton={SubmitButton}
      />
      {stages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("StageNumber")}</TableHead>
                  <TableHead>{t("StageName")}</TableHead>
                  <TableHead>{t("Department")}</TableHead>
                  <TableHead>{t("Duration")}</TableHead>
                  <TableHead>{t("WorkDescription")}</TableHead>
                  <TableHead>{t("Action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stages.map((step, i) => (
                  <TableRow key={step.Id}>
                    <TableCell>{step.StageNumber}</TableCell>
                    <TableCell>{step.StageName}</TableCell>
                    <TableCell>{step.Department.Name}</TableCell>
                    <TableCell>{step.Duration}</TableCell>
                    <TableCell>{step.WorkDescription}</TableCell>
                    <TableCell className="space-x-1">
                      <Button
                        onClick={() => {
                          setStageId(step.Id);
                          getStagesIdModel(setStage, step.Id);
                          setUpdateStageModal(true);
                        }}
                      >
                        <Pen className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        disabled={i === 0}
                        onClick={() => toggleUp(step.Id)}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        disabled={i === stages.length - 1}
                        onClick={() => toggleDown(step.Id)}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <DeleteConfirmationDialog
                        deleteRow={() =>
                          deleteStageModel(setStages, step.Id, id)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
