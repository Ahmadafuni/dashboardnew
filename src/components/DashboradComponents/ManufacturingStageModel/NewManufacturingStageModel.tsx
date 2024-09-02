import { Button } from "@/components/ui/button.tsx";
import { ArrowDown, ArrowUp, Loader2, Trash } from "lucide-react";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import { useSearchParams } from "react-router-dom";
import ManufacturingStageForm from "@/components/DashboradComponents/ManufacturingStages/ManufacturingStageForm.tsx";
import { useRecoilState, useResetRecoilState } from "recoil";
import { manufacturingStages } from "@/store/ManufacturingStage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UUID } from "crypto";
import { createMultipleStageModel } from "@/services/ManufacturingStageModel.services";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { manufacturingStageSchema } from "@/form_schemas/newManufacturingStageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllDepartmentList } from "@/services/Departments.services";
import { useTranslation } from "react-i18next";
import {toast} from "sonner";

interface Props {
  setNext: Dispatch<SetStateAction<any>>;
}

export default function NewManufacturingStageModel({ setNext }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const modelId = searchParams.get("model");
  const [departments, setDepartments] = useState([]);
  const [steps, setSteps] = useRecoilState(manufacturingStages);
  const resetSteps = useResetRecoilState(manufacturingStages); // Reset function to clear the steps

  const form = useForm<z.infer<typeof manufacturingStageSchema>>({
    resolver: zodResolver(manufacturingStageSchema),
    defaultValues: {
      department: "",
      stageName: "",
      workDescription: "",
      duration: "",
    },
  });

  const handleAddStage = async (data: z.infer<typeof manufacturingStageSchema>) => {
    const uid = crypto.randomUUID();
    const stageObj = {
      ...data,
      id: uid,
      model: modelId,
      stageNumber: steps.length + 1,
      // @ts-ignore
      departmentName: departments.find((d) => d.value === data.department)?.label,
    };
    setSteps([...steps, stageObj]);

    form.reset();
  };

  const createStages = async () => {
    if (steps.length === 0) {
      toast.error("You have to add stages before proceeding!");
      return;
    }
    setIsLoading(true);
    try {
      const newStages = await createMultipleStageModel({ stages: steps });
      if (newStages) {
        toast.success("All stages submitted successfully!");
        resetSteps(); // Reset steps after successful submission
      }
    } catch (error) {
      console.log("error",error);
      toast.error("An error occurred while submitting the stages.");
    } finally {
      setIsLoading(false);
      setNext("details");
    }
  };

  const goDown = (idx: number) => {
    const temp_ary = [...steps];

    const forUp = { ...temp_ary[idx + 1] };
    const forDown = { ...temp_ary[idx] };

    forUp.stageNumber--;
    forDown.stageNumber++;

    temp_ary[idx + 1] = forDown;
    temp_ary[idx] = forUp;

    setSteps(temp_ary);
  };

  const goUp = (idx: number) => {
    const temp_ary = [...steps];

    const forUp = { ...temp_ary[idx] };
    const forDown = { ...temp_ary[idx - 1] };

    forUp.stageNumber--;
    forDown.stageNumber++;

    temp_ary[idx] = forDown;
    temp_ary[idx - 1] = forUp;

    setSteps(temp_ary);
  };

  const deleteStage = (id: UUID) => {
    let temp_ary: any[] = [];
    const filtered_ary = steps.filter((s) => s.id !== id);
    filtered_ary.forEach((step, i) => {
      temp_ary.push({ ...step, stageNumber: i + 1 });
    });
    setSteps(temp_ary);
  };

  useEffect(() => {
    resetSteps(); // Clear steps state on component load
    getAllDepartmentList(setDepartments);
  }, []);

  return (
      <div className="space-y-1">
        <ManufacturingStageForm
            form={form}
            onSubmit={handleAddStage} // Change to handleAddStage
            SubmitButton={() => (
                <Button type="submit" form="stages">
                  {t("AddStage")}
                </Button>
            )}
        />
        {steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("Stages")}</CardTitle>
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
                    {steps.map((step, i) => (
                        <TableRow key={step.id}>
                          <TableCell>{step.stageNumber}</TableCell>
                          <TableCell>{step.stageName}</TableCell>
                          <TableCell>{step.departmentName}</TableCell>
                          <TableCell>{step.duration}</TableCell>
                          <TableCell>{step.workDescription}</TableCell>
                          <TableCell className="space-x-1">
                            <Button
                                variant="outline"
                                disabled={i === 0}
                                onClick={() => goUp(i)}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                disabled={i === steps.length - 1}
                                onClick={() => goDown(i)}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => deleteStage(step.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        )}
        <div className="flex justify-end">
          <Button
              disabled={isLoading || steps.length <= 0}
              onClick={() => createStages()} // Handle submission
          >
            {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("Please wait")}
                </>
            ) : (
                t("Next")
            )}
          </Button>
        </div>
      </div>
  );
}
