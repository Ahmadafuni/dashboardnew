import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userInfo } from "@/store/authentication";
import {
  completeModal, currentTrackingId,
  currentVariantId,
  cuttingSendConfirmationModal,
  othersSendConfirmationModal,
  pauseUnpauseModal,
} from "@/store/dashboard";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import { format } from "date-fns";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

interface Props {
  works: WorkType;
  setWorks: any;
  setSelectedSizes: (sizes: string[]) => void;
  setQuantityReceived: (quantity: any[]) => void;
}

export default function OngoingTable({ works, setSelectedSizes, setQuantityReceived }: Props) {
  const { t } = useTranslation();

  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
    }
    return quantity;
  };

  const setCurrentVariant = useSetRecoilState(currentVariantId);
  const setCurrentTrackingId = useSetRecoilState(currentTrackingId);
  const setPauseUnpause = useSetRecoilState(pauseUnpauseModal);
  const setCuttingConfirmation = useSetRecoilState(cuttingSendConfirmationModal);
  const setConfirmationOthers = useSetRecoilState(othersSendConfirmationModal);
  const setComplete = useSetRecoilState(completeModal);
  const user = useRecoilValue(userInfo);
  const userRole = user?.userRole;

  const handleSendConfirmation = (item: any, type: string) => {
    const sizes = item.ModelVariant.Sizes ? JSON.parse(item.ModelVariant.Sizes).map((e: any) => e.label) : [];
    const quantityReceived = item.QuantityReceived || [];
    setSelectedSizes(sizes);
    setQuantityReceived(quantityReceived);
    setCurrentVariant(item.ModelVariant.Id);
    if (type === "CONFIRMATION")
      setConfirmationOthers(true);
    else if (type === "COMPLETE") {
      setCurrentTrackingId(item.Id);
      setComplete(true);
    }
  };

  const handleSendCuttingConfirmation = (item: any) => {
    const sizes = item.ModelVariant.Sizes ? JSON.parse(item.ModelVariant.Sizes).map((e: any) => e.label) : [];
    setSelectedSizes(sizes);
    setCurrentVariant(item.ModelVariant.Id);
    setCuttingConfirmation(true);
  };

  const renderAdminRow = (item: any) => (
      <>
        <TableCell>{item.PrevStage?.Department?.Name || t('N/A')}</TableCell>
        <TableCell>{item.CurrentStage?.Department?.Name || t('N/A')}</TableCell>
        <TableCell>{item.NextStage?.Department?.Name || t('N/A')}</TableCell>
        <TableCell>{item.StartTime ? format(new Date(item.StartTime), "yyyy-MM-dd HH:mm:ss") : t('N/A')}</TableCell>
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
            {t('Details')}
          </Button>
        </TableCell>
      </>
  );

  const renderUserRow = (item: any) => (
      <>
        <TableCell>{item.StartTime && format(new Date(item.StartTime), "dd/MM/yyyy HH:mm")}</TableCell>
        <TableCell className="space-x-1 space-y-1">
          {item.RunningStatus === "RUNNING" ? (
              <Button
                  variant="destructive"
                  onClick={() => {
                    setCurrentVariant(item.ModelVariant.Id);
                    setPauseUnpause(true);
                  }}
              >
                {t('Stop')}
              </Button>
          ) : (
              <Button
                  variant="secondary"
                  onClick={() => {
                    setCurrentVariant(item.ModelVariant.Id);
                    setPauseUnpause(true);
                  }}
              >
                {t('Continue')}
              </Button>
          )}
          {user?.category === "CUTTING" ? (
              <Button
                  onClick={() => {
                    handleSendCuttingConfirmation(item)
                  }}
              >
                {t('SendForConfirmation')}
              </Button>
          ) : user?.category !== "QUALITYASSURANCE" ? (
              <Button onClick={() => handleSendConfirmation(item, "CONFIRMATION")}>
                {t('SendForConfirmation')}
              </Button>
          ) : (
              <Button onClick={() => handleSendConfirmation(item, "COMPLETE")}>
                {t('Complete')}
              </Button>
          )}
        </TableCell>
      </>
  );

  return (
      <div>
        <h2 className="text-2xl font-bold">{t('Ongoing')}</h2>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>{t('ModelNumber')}</TableHead>
                <TableHead>{t('Color')}</TableHead>
                <TableHead>{t('Size')}</TableHead>
                <TableHead>{t('TargetQuantity')}</TableHead>
                <TableHead>{t('ReceivedQuantity')}</TableHead>
                {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                    <>
                      <TableHead>{t('PrevStage')}</TableHead>
                      <TableHead>{t('CurrentStage')}</TableHead>
                      <TableHead>{t('NextStage')}</TableHead>
                      <TableHead>{t('StartTime')}</TableHead>
                      <TableHead>{t('Action')}</TableHead>
                    </>
                ) : (
                    <>
                      <TableHead>{t('StartTime')}</TableHead>
                      <TableHead>{t('Action')}</TableHead>
                    </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.inProgress.length <= 0 && (
                  <TableRow>
                    <TableCell colSpan={userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? 10 : 8} className="h-24 text-center">
                      {t('NoResults')}
                    </TableCell>
                  </TableRow>
              )}
              {works?.inProgress?.length > 0 &&
                  works?.inProgress.map((item) => (
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
                        <TableCell>{renderQuantity(item.QuantityReceived)}</TableCell>
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
