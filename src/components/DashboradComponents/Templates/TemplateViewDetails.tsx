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

export default function TemplateViewDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    getTemplateDetail(setDetails, id);
  }, []);
  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="grid grid-cols-2">
          <p>Template Name: {details?.template?.TemplateName}</p>
          <p>
            Product Catalogue:{" "}
            {details?.template?.ProductCatalogue?.ProductCatalogName}
          </p>
          <p>Category One: {details?.template?.CategoryOne?.CategoryName}</p>
          <p>Category Two: {details?.template?.CategoryTwo?.CategoryName}</p>
          <p>Season: {details?.template?.Season}</p>
          <p>
            Template Pattern:{" "}
            {details?.template?.TemplatePattern?.TemplatePatternName}
          </p>
          <p>
            Template Type: {details?.template?.TemplateType?.TemplateTypeName}
          </p>
          <p>Description: {details?.template?.Description}</p>
        </div>
        <Separator />
      </div>
      {(details?.cutting?.length > 0 || details?.dressup?.length > 0) && (
        <div className="grid grid-cols-1 gap-2 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cutting</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Measurement Name</TableHead>
                    {/* @ts-expect-error */}
                    {Object.entries(details?.cutting[0]).map(([key, value]) =>
                      key !== "MeasurementName" && key !== "MeasurementUnit" ? (
                        <TableHead key={key}>{key}</TableHead>
                      ) : null
                    )}
                    <TableHead>Measurement Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // @ts-expect-error
                    details.cutting.map((item) => (
                      <TableRow key={item.Id}>
                        <TableCell>{item.MeasurementName}</TableCell>
                        {Object.entries(item).map(([key, value]) =>
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
              <CardTitle>Dressup</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Measurement Name</TableHead>
                    {/* @ts-expect-error */}
                    {Object.entries(details?.dressup[0]).map(([key, value]) =>
                      key !== "MeasurementName" && key !== "MeasurementUnit" ? (
                        <TableHead key={key}>{key}</TableHead>
                      ) : null
                    )}
                    <TableHead>Measurement Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // @ts-expect-error
                    details.dressup.map((item) => (
                      <TableRow key={item.Id}>
                        <TableCell>{item.MeasurementName}</TableCell>
                        {Object.entries(item).map(([key, value]) =>
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
                  <TableHead>Stage Number</TableHead>
                  <TableHead>Stage Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Work Description</TableHead>
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
        <Button onClick={() => window.print()}>Download PDF</Button>
      </div>
    </div>
  );
}
