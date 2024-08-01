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
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface Props {
  works: WorkType;
  setWorks: any;
}

export default function AwaitingTable({ works, setWorks }: Props) {
  const user = useRecoilValue(userInfo);
  const userRole = user?.userRole;
  const { t } = useTranslation();

  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
    }
    return quantity;
  };

  const renderAdminRow = (item: any) => (
    <>
      <TableCell>{item.PrevStage?.Department?.Name || t("N/A")}</TableCell>
      <TableCell>{item.CurrentStage?.Department?.Name || t("N/A")}</TableCell>
      <TableCell>{item.NextStage?.Department?.Name || t("N/A")}</TableCell>
      <TableCell>
        {item.StartTime
          ? format(new Date(item.StartTime), "yyyy-MM-dd HH:mm:ss")
          : t("N/A")}
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

  const renderUserRow = (item: any) => (
    <TableCell className="space-x-1 space-y-1">
      {item.MainStatus === "TODO" ? (
        <BasicConfirmationDialog
          btnText={t("Start")}
          takeAction={() => startVariant(setWorks, item.ModelVariant.Id)}
          className=""
        />
      ) : (
        <ConfirmRejectAlertDialog
          acceptVariant={() => confirmVariant(setWorks, item.Id)}
          rejectVariant={() => rejectVariant(setWorks, item.Id)}
          quantityReceivedFromPreviousDep={renderQuantity(
            item.QuantityInKg !== null
              ? item.QuantityInNum
              : item.QuantityDelivered
          )}
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
        {t("Details")}
      </Button>
    </TableCell>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold">{t("Awaiting")}</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>{t("ModelNumber")}</TableHead>
              <TableHead>{t("Color")}</TableHead>
              <TableHead>{t("Size")}</TableHead>
              <TableHead>{t("TargetQuantity")}</TableHead>
              <TableHead>{t("ReceivedQuantity")}</TableHead>
              {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                <>
                  <TableHead>{t("PrevStage")}</TableHead>
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
            {works?.awaiting?.length <= 0 && (
              <TableRow>
                <TableCell
                  colSpan={user?.category !== "CUTTING" ? 6 : 5}
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
            {works?.awaiting?.length > 0 &&
              works?.awaiting.map((item) => (
                <TableRow key={item.Id}>
                  <TableCell className="font-medium">
                    {item.ModelVariant.Model.DemoModelNumber}
                  </TableCell>
                  <TableCell>{item.ModelVariant.Color.ColorName}</TableCell>
                  <TableCell>{item.ModelVariant.Sizes.slice(1, -1)}</TableCell>
                  <TableCell>{item.ModelVariant.Quantity}</TableCell>
                  {item?.QuantityInKg != null ? (
                    <TableCell>{renderQuantity(item.QuantityInNum)}</TableCell>
                  ) : (
                    <TableCell>
                      {renderQuantity(
                        item.MainStatus === "CHECKING"
                          ? item.QuantityDelivered
                          : item.QuantityReceived
                      )}
                    </TableCell>
                  )}
                  {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING"
                    ? renderAdminRow(item)
                    : renderUserRow(item)}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
