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
import { format } from "date-fns";

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
      <TableCell>{item.CurrentStage?.Department?.Name || t("NA")}</TableCell>
      <TableCell>{item.NextStage?.Department?.Name || t("NA")}</TableCell>
      <TableCell>
        {item.StartTime
          ? format(new Date(item.StartTime), "yyyy-MM-dd HH:mm:ss")
          : t("NA")}
      </TableCell>
      <TableCell>
        <Button
          variant="secondary"
          onClick={() =>
            window.open(
              `/models/viewdetails/${item.ModelVariant.Model.Id}`,
              "_blank"
            )
          }
        >
          {t("Details")}
        </Button>
      </TableCell>
    </>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold">{t("OnConfirmation")}</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>{t("ModelNumber")}</TableHead>
              <TableHead>{t("Barcode")}</TableHead>
              <TableHead>{t("Name")}</TableHead>
              <TableHead>{t("Collection")}</TableHead>
              <TableHead>{t("Order Number")}</TableHead>
              <TableHead>{t("Textile")}</TableHead>
              <TableHead>{t("Color")}</TableHead>
              <TableHead>{t("Size")}</TableHead>
              <TableHead>{t("TargetQuantity")}</TableHead>
              <TableHead>{t("ReceivedQuantity")}</TableHead>
              <TableHead>{t("DeliveredQuantity")}</TableHead>
              <TableHead>{t("DamageQuantity")}</TableHead>
              {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                <>
                  <TableHead>{t("CurrentStage")}</TableHead>
                  <TableHead>{t("NextStage")}</TableHead>
                  <TableHead>{t("StartTime")}</TableHead>
                  <TableHead>{t("Action")}</TableHead>
                </>
              ) : (
                <TableHead>{t("Action")}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {works.givingConfirmation.length <= 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    userRole === "FACTORYMANAGER" || userRole === "ENGINEERING"
                      ? 11
                      : 8
                  }
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
            {works.givingConfirmation.map((item) => {
              const isPaused = item.ModelVariant.RunningStatus === "PAUSED";
              return (
                <TableRow
                  key={item.Id}
                  style={isPaused ? { backgroundColor: "orange" } : {}}
                >
                  <TableCell className="font-medium">
                    {item.ModelVariant.Model.DemoModelNumber}
                  </TableCell>
                  <TableCell className="font-medium">{item.Barcode}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-medium">
                    {item.CollectionName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.OrderNumber}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.TextileName}
                  </TableCell>

                  <TableCell>{item.ModelVariant.Color.ColorName}</TableCell>
                  <TableCell>
                    {JSON.parse(item.ModelVariant.Sizes)
                      // .map((e: any) => e.label)
                      .join(", ")}
                  </TableCell>
                  <TableCell>{item.ModelVariant.Quantity}</TableCell>
                  {user?.category === "CUTTING" ? (
                    <>
                      <TableCell>
                        {renderQuantity(item.QuantityInKg)} Kg
                      </TableCell>
                      <TableCell>
                        {renderQuantity(item.QuantityInNum)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        {renderQuantity(item.QuantityReceived)}
                      </TableCell>
                      <TableCell>
                        {renderQuantity(item.QuantityDelivered)}
                      </TableCell>
                    </>
                  )}
                  <TableCell>{renderQuantity(item.DamagedItem)}</TableCell>
                  {userRole === "FACTORYMANAGER" ||
                  userRole === "ENGINEERING" ? (
                    renderAdminRow(item)
                  ) : (
                    <TableCell>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          window.open(
                            `/models/viewdetails/${item.ModelVariant.Model.Id}`,
                            "_blank"
                          )
                        }
                      >
                        {t("Details")}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
