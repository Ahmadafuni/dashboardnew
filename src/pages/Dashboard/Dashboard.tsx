import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllWork } from "@/services/Dashboard.services";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();

  const [works, setWorks] = useState({});

  useEffect(() => {
    getAllWork(setWorks);
  }, []);
  console.log(works);

  return (
    <div className="w-full space-y-2">
      <div className="w-full space-y-1">
        <h1 className="text-3xl font-bold w-full">{t("Dashboard")}</h1>
        <Separator />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Awaiting</h2>
        <Table>
          {/* <TableCaption>Varients awaiting to start</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* @ts-expect-error */}
            {works?.awaiting?.length <= 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
            {/* @ts-expect-error */}
            {works?.awaiting?.length > 0 &&
              // @ts-expect-error
              works?.awaiting.map((item) => (
                <TableRow key={item.Id}>
                  <TableCell className="font-medium">
                    {item.Model.ModelNumber}
                  </TableCell>
                  <TableCell>{item.Color.ColorName}</TableCell>
                  <TableCell className="text-right">
                    <Button>Start</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Ongoing</h2>
        <Table>
          {/* <TableCaption>Varients under production</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* @ts-expect-error */}
            {works?.awaiting?.length <= 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
            {/* @ts-expect-error */}
            {works?.inProgress?.length > 0 &&
              // @ts-expect-error
              works?.inProgress.map((item) => (
                <TableRow key={item.Id}>
                  <TableCell className="font-medium">
                    {item.Model.ModelNumber}
                  </TableCell>
                  <TableCell>{item.Color.ColorName}</TableCell>
                  <TableCell className="text-right">
                    <Button>Send to Confirmation</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h2 className="text-2xl font-bold">On Confirmation</h2>
        <Table>
          {/* <TableCaption>Varients awaiting for confirmation</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
            {/* {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">
              {invoice.totalAmount}
            </TableCell>
          </TableRow>
        ))} */}
          </TableBody>
        </Table>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Completed</h2>
        <Table>
          {/* <TableCaption>Varients completed</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
            {/* {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">
              {invoice.totalAmount}
            </TableCell>
          </TableRow>
        ))} */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
