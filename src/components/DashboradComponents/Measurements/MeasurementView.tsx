import { useEffect, useState } from "react";

import NewMeasurementSingleForm from "./NewMeasurementSingleForm";
import {
  deleteMeasurement,
  getAllMeasurements,
  getMeasurementById,
} from "@/services/Measurements.services";
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
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import UpdateMeasurementDialogue from "./UpdateMeasurementDialogue";
import { useSetRecoilState } from "recoil";
import {
  measurement,
  measurementId,
  updateMeasurementModal,
} from "@/store/Measurement";
import {useTranslation} from "react-i18next";

interface Props {
  type: string;
}
export default function MeasurementView({ type }: Props) {
  const { templateId } = useParams();
  const [measurements, setMeasurements] = useState([]);
  const { t } = useTranslation();

  const setUpdateMeasurementModal = useSetRecoilState(updateMeasurementModal);
  const setMeasurementId = useSetRecoilState(measurementId);
  const setMeasurement = useSetRecoilState(measurement);

  useEffect(() => {
    getAllMeasurements(setMeasurements, templateId, type);
  }, []);

  return (
    <div className="space-y-1">
      <UpdateMeasurementDialogue
        getMeasurements={() =>
          getAllMeasurements(setMeasurements, templateId, type)
        }
      />
      <NewMeasurementSingleForm
        type={type}
        getMeasurements={() =>
          getAllMeasurements(setMeasurements, templateId, type)
        }
      />
      <div className="space-y-2">
        {measurements.map((m) => (
          // @ts-expect-error
          <Card key={m.SizeName}>
            <CardHeader>
              {/* @ts-expect-error */}
              <CardTitle>{m.SizeName}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("MeasurementName")}</TableHead>
                    <TableHead>{t("MeasurementValue")}</TableHead>
                    <TableHead>{t("MeasurementUnit")}</TableHead>
                    <TableHead>{t("Action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // @ts-expect-error
                    m.Measurements.map((item) => (
                      <TableRow key={item.Id}>
                        <TableCell>{item.MeasurementName}</TableCell>
                        <TableCell>{item.MeasurementValue}</TableCell>
                        <TableCell>{item.MeasurementUnit}</TableCell>
                        <TableCell className="space-x-1">
                          <Button
                            onClick={() => {
                              setMeasurementId(item.Id);
                              getMeasurementById(setMeasurement, item.Id);
                              setUpdateMeasurementModal(true);
                            }}
                          >
                            <Pen className="w-4 h-4" />
                          </Button>
                          <DeleteConfirmationDialog
                            deleteRow={() =>
                              deleteMeasurement(
                                setMeasurements,
                                item.Id,
                                templateId,
                                type
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
