import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { measurementsGroup } from "@/store/Measurement";
import { newMeasurementsNext } from "@/store/templateSize";
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
import { useSearchParams } from "react-router-dom";
import { createMultipleMeasurements } from "@/services/Measurements.services";
import NewMeasurementForm from "../Measurements/NewMeasurementForm";
import {useTranslation} from "react-i18next";

interface Props {
  sizeType: string;
  setNext: any;
}
export default function NewMeasurement({ sizeType, setNext }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  // Measurement Group
  const [measurementsGroups, setMeasurementsGroups] =
    useRecoilState(measurementsGroup);
  const [measurements, setMeasurements] = useRecoilState(newMeasurementsNext);

  const deleteMeasurement = (Key: string, Id: UUID) => {
    // Remove From the list
    let temp_msmt = [...measurements];
    temp_msmt = temp_msmt.filter((m) => m.Id !== Id);
    setMeasurements(temp_msmt);
    // Remove from the display
    const temp_group = { ...measurementsGroups };
    // @ts-expect-error
    let temp_array = [...temp_group[Key]];
    temp_array = temp_array.filter((s) => s.Id !== Id);
    // @ts-expect-error
    temp_group[Key] = temp_array;
    setMeasurementsGroups(temp_group);
  };

  const createNew = async () => {
    setIsLoading(true);
    try {
      const data = {
        measurements: measurements,
        sizeType: sizeType,
        templateId: searchParams.get("template"),
      };
      const newMeasurements = await createMultipleMeasurements(data);
      if (newMeasurements) {
        setIsLoading(false);
        setMeasurements([]);
        setMeasurementsGroups({});
        // @ts-expect-error
        setSearchParams({
          template: searchParams.get("template"),
          tab: sizeType === "CUTTING" ? "dressup" : "stages",
        });
        setNext();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <NewMeasurementForm />
      <div className="space-y-2">
        {Object.entries(measurementsGroups).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{key}</CardTitle>
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
                    value.map((item) => (
                      <TableRow key={item.Id}>
                        <TableCell>{item.MeasurementName}</TableCell>
                        <TableCell>{item.MeasurementValue}</TableCell>
                        <TableCell>{item.MeasurementUnit}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => deleteMeasurement(key, item.Id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
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
      <div className="flex justify-end">
        <Button
          disabled={isLoading || measurements.length <= 0}
          onClick={() => createNew()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            t("Next")
          )}
        </Button>
      </div>
    </div>
  );
}
