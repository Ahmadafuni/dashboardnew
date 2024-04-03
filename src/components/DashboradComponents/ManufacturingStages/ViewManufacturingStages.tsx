import { manufacturingStageSchema } from "@/form_schemas/newManufacturingStageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ManufacturingStageForm from "./ManufacturingStageForm";
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
import {
  deleteStages,
  getAllStages,
  getStagesId,
  toggleStageDown,
  toggleStageUp,
} from "@/services/ManufacturingStages.services";
import UpdateManufacturingStagesDialogue from "./UpdateManufacturingStagesDialogue";
import { useSetRecoilState } from "recoil";
import {
  manufacturingStage,
  manufacturingStageId,
  updateManufacturingStageModal,
} from "@/store/ManufacturingStage";

export default function ViewManufacturingStages() {
  const [isLoading, setIsLoading] = useState(false);
  const { templateId } = useParams();

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
        "manufacturingstage/",
        { ...data, template: templateId },
        {
          headers: {
            Authorization: `bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      toast.success(newMS.data.message);
      getAllStages(setStages, templateId);
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
          "Add"
        )}
      </Button>
    );
  };

  // Toggle Up
  const toggleUp = async (id: number) => {
    try {
      await toggleStageUp(id);
      getAllStages(setStages, templateId);
    } catch (error) {}
  };
  // Toggle Down
  const toggleDown = async (id: number) => {
    try {
      await toggleStageDown(id);
      getAllStages(setStages, templateId);
    } catch (error) {}
  };

  useEffect(() => {
    getAllStages(setStages, templateId);
  }, []);
  return (
    <div className="space-y-1">
      <UpdateManufacturingStagesDialogue
        getStages={() => getAllStages(setStages, templateId)}
      />
      <ManufacturingStageForm
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
                  <TableHead>Stage Number</TableHead>
                  <TableHead>Stage Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Work Description</TableHead>
                  <TableHead>Action</TableHead>
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
                          getStagesId(setStage, step.Id);
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
                          deleteStages(setStages, step.Id, templateId)
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
