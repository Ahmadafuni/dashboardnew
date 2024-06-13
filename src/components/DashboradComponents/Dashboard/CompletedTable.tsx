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

export default function CompletedTable({ works }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Completed</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          {/* <TableCaption>Varients completed</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {works.completed.length <= 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
            {works.completed.map((item) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
