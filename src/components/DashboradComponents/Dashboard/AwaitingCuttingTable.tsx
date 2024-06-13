import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  confirmVariant,
  rejectVariant,
  startVariant,
} from "@/services/Dashboard.services";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import ConfirmRejectAlertDialog from "./ConfirmRejectAlertDialog";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication";

interface Props {
  works: WorkType;
  setWorks: any;
}
export default function AwaitingCuttingTable({ works, setWorks }: Props) {
  const user = useRecoilValue(userInfo);
  return (
    <div>
      <h2 className="text-2xl font-bold">Awaiting</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          {/* <TableCaption>Varients awaiting to start</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Model Number</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              {user?.category !== "CUTTING" && (
                <TableHead>Receiving Quantity</TableHead>
              )}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {works?.awaiting?.length <= 0 && (
              <TableRow>
                <TableCell
                  colSpan={user?.category !== "CUTTING" ? 6 : 5}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            {works?.awaiting?.length > 0 &&
              works?.awaiting.map((item) => (
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
                  {user?.category !== "CUTTING" ? (
                    item.QuantityInNum !== null ? (
                      <TableCell>{item.QuantityInNum}</TableCell>
                    ) : (
                      <TableCell>{item.QuantityDelivered}</TableCell>
                    )
                  ) : null}
                  <TableCell className="space-x-1 space-y-1">
                    {item.MainStatus === "TODO" ? (
                      <BasicConfirmationDialog
                        btnText="Start"
                        takeAction={() =>
                          startVariant(setWorks, item.ModelVariant.Id)
                        }
                        className=""
                      />
                    ) : (
                      <ConfirmRejectAlertDialog
                        acceptVariant={() => confirmVariant(setWorks, item.Id)}
                        rejectVariant={() => rejectVariant(setWorks, item.Id)}
                      />
                    )}
                    <Button
                      variant="secondary"
                      onClick={() =>
                        window.open(
                          `/models/viewdetails/${item.ModelVariant.Model.Id}`,
                          "_blank"
                        )
                      }
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
