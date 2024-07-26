import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import {useRecoilValue} from "recoil";
import {userInfo} from "@/store/authentication.ts";

interface Props {
  works: WorkType;
}

export default function CompletedTable({ works }: Props) {
  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
    }
    return quantity;
  };
  const user = useRecoilValue(userInfo);

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
              <TableHead>Target Quantity</TableHead>
              <TableHead>Received Quantity</TableHead>
              <TableHead>Delivered Quantity</TableHead>
              <TableHead>Damage Quantity</TableHead>

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
                  {/* item.ModelVariant.Model.ModelNumber */}
                  {item.ModelVariant.Model.DemoModelNumber}
                </TableCell>
                <TableCell>{item.ModelVariant.Color.ColorName}</TableCell>
                <TableCell>
                  {JSON.parse(item.ModelVariant.Sizes)
                    // @ts-expect-error
                    .map((e) => e.label)
                    .join(", ")}
                </TableCell>
                <TableCell>{item.ModelVariant.Quantity}</TableCell>

                {user?.category === "CUTTING" ? (
                    <>
                      <TableCell>{renderQuantity(item.QuantityInKg)} Kg</TableCell>
                    </>
                ) : (
                    <>
                      <TableCell>{renderQuantity(item.QuantityReceived)}</TableCell>
                    </>
                )}

                <TableCell>
                  {item?.QuantityInKg != null ? (
                      <>
                        <TableCell>{renderQuantity(item.QuantityInNum)}</TableCell>
                      </>
                  ) : (
                      <>
                        {/* The Process: if we have QuantityDelivered from dep,
                           this QuantityDelivered should be the QuantityReceived for current Dep. */}
                        <TableCell>{renderQuantity(item.QuantityDelivered )}</TableCell>
                      </>
                  )}
                </TableCell>
                <TableCell>{renderQuantity(item.DamagedItem)}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

