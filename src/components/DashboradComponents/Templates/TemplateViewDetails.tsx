import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTemplateDetail } from "@/services/Templates.services";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useTranslation} from "react-i18next";
import { useRef } from "react";
import { useReactToPrint } from 'react-to-print';

export default function TemplateViewDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState<any>({});
  const { t } = useTranslation();
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current ?? null,
    documentTitle: `Template_Summary_${details?.template?.TemplateName}`
  });

  useEffect(() => {
    getTemplateDetail(setDetails, id);
  }, []);
  return (
    <div className="p-4"  ref={printRef}>
      <div className="space-y-2">
        <br/>
        <div className="grid grid-cols-2">
          <p>{t("TemplateName")}: {details?.template?.TemplateName}</p>
          <p>
            {t("ProductCatalogueName")}:{" "}
            {details?.template?.ProductCatalogue?.ProductCatalogName}
          </p>
          <p>{t("ProductCatalogCategoryOne")}: {details?.template?.CategoryOne?.CategoryName}</p>
          <p>{t("ProductCatalogCategoryTwo")}: {details?.template?.CategoryTwo?.CategoryName}</p>
          <p>{t("Season")}: {details?.template?.Season}</p>
          <p>
            {t("TemplatePatternName")}:{" "}
            {details?.template?.TemplatePattern?.TemplatePatternName}
          </p>
          <p>
            {t("TemplateTypeName")}: {details?.template?.TemplateType?.TemplateTypeName}
          </p>
          <p>{t("Description")}: {details?.template?.Description}</p>
        </div>
        <Separator />
      </div>
      {(details?.cutting?.length > 0 || details?.dressup?.length > 0) && (
        <div className="grid grid-cols-1 gap-2 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Cutting")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("MeasurementName")}</TableHead>
                    {Object.entries(details?.cutting[0])
                      .sort()
                      // @ts-expect-error
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
                  {
                    // @ts-expect-error
                    details.cutting.map((item) => (
                      <TableRow key={item.Id}>
                        <TableCell>{item.MeasurementName}</TableCell>
                        {Object.entries(item)
                          .sort()
                          .map(([key, value]) =>
                            key !== "MeasurementName" &&
                            key !== "MeasurementUnit" ? (
                              // @ts-expect-error
                              <TableCell key={key}>{value}</TableCell>
                            ) : null
                          )}
                        <TableCell>{item.MeasurementUnit}</TableCell>
                      </TableRow>
                    ))
                  }
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
                    <TableHead>{t("MeasurementName")}</TableHead>
                    {details?.dressup?.[0] &&
                        Object.entries(details.dressup[0])
                            .sort()
                            // @ts-expect-error
                            .map(([key, value]) =>
                                key !== "MeasurementName" && key !== "MeasurementUnit" ? (
                                    <TableHead key={key}>{key}</TableHead>
                                ) : null
                            )}
                    <TableHead>{t("MeasurementUnit")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // @ts-expect-error
                    details.dressup.map((item) => (
                      <TableRow key={item.Id}>
                        <TableCell>{item.MeasurementName}</TableCell>
                        {Object.entries(item)
                          .sort()
                          .map(([key, value]) =>
                            key !== "MeasurementName" &&
                            key !== "MeasurementUnit" ? (
                              // @ts-expect-error
                              <TableCell key={key}>{value}</TableCell>
                            ) : null
                          )}
                        <TableCell>{item.MeasurementUnit}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      {details?.stages?.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Manufacturing Stages</CardTitle>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  // @ts-expect-error
                  details?.stages?.map((step, i) => (
                    <TableRow key={step.Id}>
                      <TableCell>{step.StageNumber}</TableCell>
                      <TableCell>{step.StageName}</TableCell>
                      <TableCell>{step.Department.Name}</TableCell>
                      <TableCell>{step.Duration}</TableCell>
                      <TableCell>{step.WorkDescription}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <div className="flex justify-end mt-4 print:hidden">
        <Button onClick={handlePrint}>{t("DownloadPDF")}</Button>
      </div>
    </div>
  );
}
