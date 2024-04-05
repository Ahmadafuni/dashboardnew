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
        <h1 className="text-2xl">
          Template Name: {details?.template?.TemplateName}
        </h1>
        <h2 className="text-xl">
          Product Catalogue:{" "}
          {
            details?.template?.ProductCatalogDetail?.ProductCatalog
              ?.ProductCatalogName
          }
        </h2>
        <h3 className="text-lg">
          Description: {details?.template?.Description}
        </h3>
        <Separator />
      </div>
      {(details?.cutting?.length > 0 || details?.dressup?.length > 0) && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="space-y-2">
            <h2 className="text-lg">CUTTING</h2>
            {/* @ts-expect-error */}
            {details?.cutting?.map((m) => (
              <Card key={m.SizeName}>
                <CardHeader>
                  <CardTitle>{m.SizeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Measurement Name</TableHead>
                        <TableHead>Measurement Value</TableHead>
                        <TableHead>Measurement Unit</TableHead>
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
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg">DRESSUP</h2>
            {/* @ts-expect-error */}
            {details?.dressup?.map((m) => (
              <Card key={m.SizeName}>
                <CardHeader>
                  <CardTitle>{m.SizeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Measurement Name</TableHead>
                        <TableHead>Measurement Value</TableHead>
                        <TableHead>Measurement Unit</TableHead>
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
      )}
      {details?.stages?.length > 0 && (
        <div className="space-y-2 mt-4">
          <h2 className="text-lg">Manufacturing Stages</h2>
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
        </div>
      )}
      <div className="flex justify-end mt-4 print:hidden">
        <Button onClick={() => window.print()}>Download PDF</Button>
      </div>
    </div>
  );
}
