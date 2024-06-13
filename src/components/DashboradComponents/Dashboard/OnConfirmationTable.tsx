import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkType } from "@/types/Dashboard/Dashboard.types";

interface Props {
  works: WorkType;
}
export default function OnConfirmationTable({ works }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">On Confirmation</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          {/* <TableCaption>Varients awaiting for confirmation</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Delivered Quantity</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {works.givingConfirmation.length <= 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
            {works.givingConfirmation.map((item) => (
              <TableRow key={item.Id}>
                <TableCell className="font-medium">
                  {item.ModelVariant.Model.ModelNumber}
                </TableCell>
                <TableCell>{item.ModelVariant.Color.ColorName}</TableCell>
                <TableCell>
                  {JSON.parse(item.ModelVariant.Sizes)
                    // @ts-expect-error
                    .map((e) => e.label)
                    .join(", ")}
                </TableCell>
                <TableCell>{item.ModelVariant.Quantity}</TableCell>
                <TableCell>{item.QuantityInNum}</TableCell>
                <TableCell>
                  <Button>Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
