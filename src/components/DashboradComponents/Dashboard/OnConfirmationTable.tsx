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
import {useTranslation} from "react-i18next";
import {useRecoilValue} from "recoil";
import {userInfo} from "@/store/authentication.ts";

interface Props {
  works: WorkType;
}


export default function OnConfirmationTable({ works }: Props) {
  console.log("OnConfirmationTable", works);
  const user = useRecoilValue(userInfo);
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
  const {t} = useTranslation();
  // @ts-ignore
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
              <TableHead>Target Quantity</TableHead>
              <TableHead>Received Quantity</TableHead>
              <TableHead>Delivered Quantity</TableHead>
              <TableHead>Damage Quantity</TableHead>
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
                      <TableCell>{renderQuantity(item.QuantityInNum)}</TableCell>
                    </>
                ) : (
                    <>
                      <TableCell>{renderQuantity(item.QuantityReceived)}</TableCell>
                      <TableCell>{renderQuantity(item.QuantityDelivered)}</TableCell>
                    </>
                )}
                <TableCell>{renderQuantity(item.DamagedItem)}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
