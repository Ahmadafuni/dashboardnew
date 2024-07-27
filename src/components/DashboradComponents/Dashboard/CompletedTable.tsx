import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication.ts";
import { differenceInDays, differenceInHours } from "date-fns";
import { Button } from "@/components/ui/button";

interface Props {
  works: WorkType;
}

export default function CompletedTable({ works }: Props) {
  const user = useRecoilValue(userInfo);
  const userRole = user?.userRole;

  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
    }
    return quantity;
  };

  const calculateDuration = (start: Date, end: Date) => {
    const days = differenceInDays(end, start);
    const hours = differenceInHours(end, start) % 24;
    return `${days}d ${hours}h`;
  };

  const renderAdminRow = (item: any) => (
      <>
        <TableCell>{item.CurrentStage?.Department?.Name || "N/A"}</TableCell>
        <TableCell>{item.StartTime && item.EndTime ? calculateDuration(new Date(item.StartTime), new Date(item.EndTime)) : "N/A"}</TableCell>
        <TableCell>
          <Button
              variant="secondary"
              onClick={() =>
                  window.open(`/models/viewdetails/${item.ModelVariant.Model.Id}`, "_blank")
              }
          >
            Details
          </Button>
        </TableCell>
      </>
  );

  const renderUserRow = (item: any) => (
      <>
        {user?.category === "CUTTING" ? (
            <TableCell>{renderQuantity(item.QuantityInKg)} Kg</TableCell>
        ) : (
            <TableCell>{renderQuantity(item.QuantityReceived)}</TableCell>
        )}
        <TableCell>
          {item?.QuantityInKg != null ? (
              <TableCell>{renderQuantity(item.QuantityInNum)}</TableCell>
          ) : (
              <TableCell>{renderQuantity(item.QuantityDelivered)}</TableCell>
          )}
        </TableCell>
        <TableCell>{renderQuantity(item.DamagedItem)}</TableCell>
        <TableCell>
          <Button
              variant="secondary"
              onClick={() =>
                  window.open(`/models/viewdetails/${item.ModelVariant.Model.Id}`, "_blank")
              }
          >
            Details
          </Button>
        </TableCell>
      </>
  );

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
                {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                    <>
                      <TableHead>Current Stage</TableHead>
                       <TableHead>Duration</TableHead>
                      <TableHead>Action</TableHead>
                    </>
                ) : (
                    <>
                      <TableHead>Received Quantity</TableHead>
                      <TableHead>Delivered Quantity</TableHead>
                      <TableHead>Damage Quantity</TableHead>
                      <TableHead>Action</TableHead>
                    </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.completed.length <= 0 && (
                  <TableRow>
                    <TableCell colSpan={userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? 12 : 8} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
              )}
              {works.completed.map((item) => (
                  <TableRow key={item.Id}>
                    <TableCell className="font-medium">
                      {item.ModelVariant.Model.DemoModelNumber}
                    </TableCell>
                    <TableCell>{item.ModelVariant.Color.ColorName}</TableCell>
                    <TableCell>
                      {JSON.parse(item.ModelVariant.Sizes)
                          .map((e: any) => e.label)
                          .join(", ")}
                    </TableCell>
                    <TableCell>{item.ModelVariant.Quantity}</TableCell>
                    {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                        renderAdminRow(item)
                    ) : (
                        renderUserRow(item)
                    )}
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
