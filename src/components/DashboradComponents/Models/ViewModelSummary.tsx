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

export default function ViewModelSummary() {
  const { id } = useParams();
  // Model summary
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    getModelSummary(setSummary, id);
  }, []);
  return (
    <div className="p-4">
      <div>
        <div className="border-2 grid grid-cols-4 text-right">
          <div className="border-2 p-2">{summary?.modelInfo?.ModelNumber}</div>
          <div className="border-2 p-2">The Number</div>
          <div className="border-2 p-2">{summary?.modelInfo?.ModelDate}</div>
          <div className="border-2 p-2">Date</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Quantity}</div>
          <div className="border-2 p-2">Quantity</div>
          <div className="border-2 p-2">{summary?.modelInfo?.ModelNumber}</div>
          <div className="border-2 p-2">Model Number</div>
          <div className="border-2 p-2">
            {summary?.modelInfo?.Specification}
          </div>
          <div className="border-2 p-2">Specification</div>
          <div className="border-2 p-2">{summary?.modelInfo?.ModelName}</div>
          <div className="border-2 p-2">Model Type</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Barcode}</div>
          <div className="border-2 p-2">Barcode</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Sizes}</div>
          <div className="border-2 p-2">Measurements</div>
          <div className="border-2 p-2">{summary?.modelInfo?.LabelType}</div>
          <div className="border-2 p-2">Label Type</div>
          <div className="border-2 p-2">{summary?.modelInfo?.FabricType}</div>
          <div className="border-2 p-2">Fabric Type</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Template}</div>
          <div className="border-2 p-2">Template Number</div>
          <div className="border-2 p-2">{summary?.modelInfo?.Colors}</div>
          <div className="border-2 p-2">Fabric Color</div>
          <div className="border-2 p-2">
            {summary?.modelInfo?.PrintLocation}
          </div>
          <div className="border-2 p-2">Printing Place</div>
          <div className="border-2 p-2">{summary?.modelInfo?.DeliveryDate}</div>
          <div className="border-2 p-2">Delivery Date</div>
          <div className="border-2 p-2 col-span-3">
            {summary?.modelInfo?.Description}
          </div>
          <div className="border-2 p-2">Comments</div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 mt-2">
        {summary?.modelInfo?.Images.split(",").map((i: any) => (
          <img key={i} src={`https://dashboardbackendnew.onrender.com${i}`} />
        ))}
      </div>
      {summary?.cutting?.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Cutting</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Measurement Name</TableHead>
                    {Object.entries(summary?.cutting[0])
                      .sort()
                      // @ts-expect-error
                      .map(([key, value]) =>
                        key !== "MeasurementName" &&
                        key !== "MeasurementUnit" ? (
                          <TableHead key={key}>{key}</TableHead>
                        ) : null
                      )}
                    <TableHead>Measurement Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // @ts-expect-error
                    summary?.cutting.map((item) => (
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
              <CardTitle>Dressup</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Measurement Name</TableHead>
                    {Object.entries(summary?.dressup[0])
                      .sort()
                      // @ts-expect-error
                      .map(([key, value]) =>
                        key !== "MeasurementName" &&
                        key !== "MeasurementUnit" ? (
                          <TableHead key={key}>{key}</TableHead>
                        ) : null
                      )}
                    <TableHead>Measurement Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // @ts-expect-error
                    summary?.dressup.map((item) => (
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
      <div className="flex justify-end mt-4 print:hidden">
        <Button onClick={() => window.print()}>Download PDF</Button>
      </div>
    </div>
  );
}
