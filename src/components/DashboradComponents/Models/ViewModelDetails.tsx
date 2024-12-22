import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getModelSummary } from "@/services/Model.services";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { BASE_URL } from "@/config";

export default function ViewModelDetails() {
  const { id } = useParams();
  const [summary, setSummary] = useState<any>({});
  const { t } = useTranslation();
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current ?? null,
    documentTitle: `Model_Summary_${summary?.modelInfo?.Barcode}`
  });

  useEffect(() => {
    getModelSummary(setSummary, id);
  }, []);

  // Fabric calculations helper function
  const calculateFabricNeeds = (quantity: number, standardWeight: number) => {
    const WASTE_PERCENTAGE = 0.20; // 20% waste
    const totalFabric = quantity * standardWeight;
    const wastage = totalFabric * WASTE_PERCENTAGE;
    const pieceWeight = standardWeight * (1 - WASTE_PERCENTAGE);

    return {
      totalFabric: Number(totalFabric.toFixed(3)),
      wastage: Number(wastage.toFixed(3)),
      pieceWeight: Number(pieceWeight.toFixed(3)),
    };
  };

  return (
    <div className="p-4" ref={printRef}>
      <div>
        <div className="border-2 grid grid-cols-4 text-right">
          <div className="border-2 p-2">{summary?.modelInfo?.OrderNumber}</div>
          <div className="border-2 p-2">{t("OrderNumber")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.ModelDate}</div>
          <div className="border-2 p-2">{t("ModelCreatedDate")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Quantity}</div>
          <div className="border-2 p-2">{t("Quantity")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.ModelNumber}</div>
          <div className="border-2 p-2">{t("ModelNumber")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Specification}</div>
          <div className="border-2 p-2">{t("Characteristics")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.ModelName}</div>
          <div className="border-2 p-2">{t("ModelName")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Barcode}</div>
          <div className="border-2 p-2">{t("Barcode")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Sizes}</div>
          <div className="border-2 p-2">{t("Sizes")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.LabelType}</div>
          <div className="border-2 p-2">{t("LabelType")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.FabricType}</div>
          <div className="border-2 p-2">{t("TextileType")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Template}</div>
          <div className="border-2 p-2">{t("Template")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Colors}</div>
          <div className="border-2 p-2">{t("Colors")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.PrintLocation}</div>
          <div className="border-2 p-2">{t("PrintLocation")}</div>
          <div className="border-2 p-2">{summary?.modelInfo?.DeliveryDate}</div>
          <div className="border-2 p-2">{t("DeadlineDate")}</div>
          <div className="border-2 p-2 col-span-3">{summary?.modelInfo?.Description}</div>
          <div className="border-2 p-2">{t("Description")}</div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 mt-2">
        {summary?.modelInfo?.Images != null && summary?.modelInfo?.Images.split(",").map((i: any) => (
          <img key={i} src={`${BASE_URL}${i}`} />
        ))}
      </div>

      {/* Fabric Calculations Table */}
      {summary?.modelInfo?.ColorQuantities && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("FabricCalculations")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Color")}</TableHead>
                    <TableHead>{t("Quantity")}</TableHead>
                    <TableHead>{t("RequiredFabric")} (كغ)</TableHead>
                    <TableHead>{t("Wastage")} (كغ)</TableHead>
                    <TableHead>{t("PieceWeight")} (كغ)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.modelInfo.ColorQuantities.map((item: { Color: string; Quantity: number }) => {
                    const calculations = calculateFabricNeeds(item.Quantity, summary.modelInfo.StandardWeight);
                    return (
                      <TableRow key={item.Color}>
                        <TableCell>{item.Color}</TableCell>
                        <TableCell>{item.Quantity}</TableCell>
                        <TableCell>{calculations.totalFabric}</TableCell>
                        <TableCell>{calculations.wastage}</TableCell>
                        <TableCell>{calculations.pieceWeight}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stages Table */}
      {summary?.stages?.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("Stages")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("StageNumber")}</TableHead>
                    <TableHead>{t("DepartmentName")}</TableHead>
                    <TableHead>{t("WorkDescription")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary?.stages.map((stage: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{stage.StageNumber}</TableCell>
                      <TableCell>{stage.DepartmentName}</TableCell>
                      <TableCell>{stage.WorkDescription}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {summary?.cutting?.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("Cutting")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("MeasurementName")}</TableHead>
                    {Object.entries(summary?.cutting[0])
                      .sort()
                      .map(([key, value]) =>
                        key !== "MeasurementName" &&
                        key !== "MeasurementUnit" ? (
                          <TableHead key={key}>{key}</TableHead>
                        ) : null
                      )}
                    <TableHead>{t("MeasurementUnit")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary?.cutting.map((item: any) => (
                    <TableRow key={item.Id}>
                      <TableCell>{item.MeasurementName}</TableCell>
                      {Object.entries(item)
                        .sort()
                        .map(([key, value]) =>
                          key !== "MeasurementName" &&
                          key !== "MeasurementUnit" ? (
                            <TableCell key={key}>{value}</TableCell>
                          ) : null
                        )}
                      <TableCell>{item.MeasurementUnit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("Dressup")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Measurement Name</TableHead>
                    {
                   // @ts-ignore
                    Object.entries(summary?.dressup[0]).sort().map(([key, value]) =>
                        key !== "MeasurementName" &&
                        key !== "MeasurementUnit" ? (
                          <TableHead key={key}>{key}</TableHead>
                        ) : null
                      )}
                    <TableHead>{t("MeasurementUnit")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary?.dressup.map((item: any) => (
                    <TableRow key={item.Id}>
                      <TableCell>{item.MeasurementName}</TableCell>
                      {Object.entries(item)
                        .sort()
                        .map(([key, value]) =>
                          key !== "MeasurementName" &&
                          key !== "MeasurementUnit" ? (
                            // @ts-ignore
                            <TableCell key={key}>{value}</TableCell>
                          ) : null
                        )}
                      <TableCell>{item.MeasurementUnit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="flex justify-end mt-4 print:hidden">
        <Button onClick={handlePrint}>{t("DownloadPDF")}</Button>
      </div>
    </div>
  );
}