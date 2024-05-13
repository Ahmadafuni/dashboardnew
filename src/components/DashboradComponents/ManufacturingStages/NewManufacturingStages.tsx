import { Button } from "@/components/ui/button.tsx";
import { ArrowDown, ArrowUp, Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ManufacturingStageForm from "@/components/DashboradComponents/ManufacturingStages/ManufacturingStageForm.tsx";
import { useRecoilState } from "recoil";
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
import { createMultipleStages } from "@/services/ManufacturingStages.services";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { manufacturingStageSchema } from "@/form_schemas/newManufacturingStageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllDepartmentList } from "@/services/Departments.services";
import {useTranslation} from "react-i18next";

export default function NewManufacturingStages() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  // @ts-expect-error
  const [searchParams, setSearchParams] = useSearchParams();
  // Departments
  const [departments, setDepartments] = useState([]);
  // Stages
  const [steps, setSteps] = useRecoilState(manufacturingStages);

  const SubmitButton = () => {
    return (
      <Button type="submit" form="stages">
        {t("Add")}
      </Button>
    );
  };

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
    const uid = crypto.randomUUID();
    const stageObj = {
      ...data,
      id: uid,
      template: searchParams.get("template"),
      stageNumber: steps.length + 1,
      // @ts-expect-error
      departmentName: departments.find((d) => d.value === data.department)
        .label,
    };
    setSteps([...steps, stageObj]);

    form.reset();
  };

  // Go Down
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
  // Go Up
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
  // Delete Stage
  const deleteStage = (id: UUID) => {
    let temp_ary: any[] = [];
    const filtered_ary = steps.filter((s) => s.id !== id);
    filtered_ary.forEach((step, i) => {
      temp_ary.push({ ...step, stageNumber: i + 1 });
    });
    setSteps(temp_ary);
  };

  const createStages = async () => {
    setIsLoading(true);
    try {
      const newStages = await createMultipleStages({ stages: steps });
      if (newStages) {
        setIsLoading(false);
        navigate("/dashboard/templates");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // Page on load
  useEffect(() => {
    getAllDepartmentList(setDepartments);
  }, []);
  return (
    <div className="space-y-1">
      <ManufacturingStageForm
        form={form}
        onSubmit={onSubmit}
        SubmitButton={SubmitButton}
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
          onClick={() => createStages()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            t("Done")
          )}
        </Button>
      </div>
    </div>
  );
}
