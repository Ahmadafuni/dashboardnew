import NewMeasurement from "@/components/DashboradComponents/Measurements/NewMeasurement";
import UpdateMeasurement from "@/components/DashboradComponents/Measurements/MeasurementView";
import DataTable from "@/components/common/DataTable";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  deleteMeasurement,
  getAllMeasurements,
  getMeasurementById,
} from "@/services/Measurements.services";
import {
  measurement,
  measurementId,
  newMeasurementModal,
  updateMeasurementModal,
} from "@/store/Measurement";
import { MeasurementsType } from "@/types/Templates/Measurements.types";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";

export default function Measurements() {
  const { t } = useTranslation();
  const { templateSizeId } = useParams();
  const [measurements, setMeasurements] = useState<MeasurementsType[]>([]);
  // Modal State
  const setNewMeasurementModal = useSetRecoilState(newMeasurementModal);
  const setUpdateMeasurementModal = useSetRecoilState(updateMeasurementModal);

  const setMeasurementId = useSetRecoilState(measurementId);
  const setMeasurement = useSetRecoilState(measurement);

  const measurementsColumns: ColumnDef<MeasurementsType>[] = [
    {
      accessorKey: "MeasurementName",
      header: "Measurement Name",
    },
    {
      accessorKey: "MeasurementValue",
      header: "Measurement Value",
    },
    {
      accessorKey: "MeasurementUnit",
      header: "Measurement Unit",
    },
    {
      header: t("Action"),
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            onClick={() => {
              getMeasurementById(setMeasurement, row.original.Id);
              setMeasurementId(row.original.Id);
              setUpdateMeasurementModal(true);
            }}
          >
            <Pen className="h-4 w-4" />
          </Button>
          <DeleteConfirmationDialog
            deleteRow={() =>
              deleteMeasurement(
                setMeasurements,
                row.original.Id,
                templateSizeId
              )
            }
          />
        </div>
      ),
    },
  ];

  // Page on load
  useEffect(() => {
    getAllMeasurements(setMeasurements, templateSizeId);
  }, []);
  return (
    <div className="w-full space-y-2">
      <NewMeasurement
        getMeasurements={() =>
          getAllMeasurements(setMeasurements, templateSizeId)
        }
        templateSizeId={templateSizeId}
      />
      <UpdateMeasurement
        getMeasurements={() =>
          getAllMeasurements(setMeasurements, templateSizeId)
        }
      />
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">Measurements</h1>
        <Separator />
      </div>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button onClick={() => setNewMeasurementModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("Add")}
          </Button>
        </div>
        <div className="rounded-md border overflow-x-scroll">
          <DataTable columns={measurementsColumns} data={measurements} />
        </div>
      </div>
    </div>
  );
}
