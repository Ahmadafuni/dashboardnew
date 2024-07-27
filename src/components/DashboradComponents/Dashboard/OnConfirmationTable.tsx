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
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { userInfo } from "@/store/authentication.ts";
import {format} from "date-fns";

interface Props {
  works: WorkType;
}

export default function OnConfirmationTable({ works }: Props) {
  const user = useRecoilValue(userInfo);
  const userRole = user?.userRole;
  const { t } = useTranslation();

  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q, index) => (
          <div key={index}>
            {q.size}: {q.value}
          </div>
      ));
    }
    return quantity;
  };

  const renderAdminRow = (item: any) => (
      <>
        <TableCell>{item.CurrentStage?.Department?.Name || "N/A"}</TableCell>
        <TableCell>{item.NextStage?.Department?.Name || "N/A"}</TableCell>
        <TableCell>{item.StartTime ? format(new Date(item.StartTime), "yyyy-MM-dd HH:mm:ss") : "N/A"}</TableCell>
        <TableCell>
          <Button
              variant="secondary"
              onClick={() =>
                  window.open(`/models/viewdetails/${item.ModelVariant.Model.Id}`, "_blank")
              }
          >
            {t("Details")}
          </Button>
        </TableCell>
      </>
  );

  return (
      <div>
        <h2 className="text-2xl font-bold">On Confirmation</h2>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Model Number</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Target Quantity</TableHead>
                <TableHead>Received Quantity</TableHead>
                <TableHead>Delivered Quantity</TableHead>
                <TableHead>Damage Quantity</TableHead>
                {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                    <>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Next Stage</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Action</TableHead>
                    </>
                ) : (
                    <TableHead>Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.givingConfirmation.length <= 0 && (
                  <TableRow>
                    <TableCell colSpan={userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? 11 : 8} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
              )}
              {works.givingConfirmation.map((item) => (
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
                    {user?.category === "CUTTING" ? (
                        <>
                          <TableCell>{renderQuantity(item.QuantityInKg)} Kg</TableCell>
                          <TableCell>{renderQuantity(item.QuantityInNum)}</TableCell>
                        </>
                    ) : (
                        <>
                          <TableCell>{renderQuantity(item.QuantityReceived)}</TableCell>
                          <TableCell>{renderQuantity(item.QuantityDelivered)}</TableCell>
                        </>
                    )}
                    <TableCell>{renderQuantity(item.DamagedItem)}</TableCell>
                    {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                        renderAdminRow(item)
                    ) : (
                        <TableCell>
                          <Button
                              variant="secondary"
                              onClick={() =>
                                  window.open(`/models/viewdetails/${item.ModelVariant.Model.Id}`, "_blank")
                              }
                          >
                            {t("Details")}
                          </Button>
                        </TableCell>
                    )}
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
