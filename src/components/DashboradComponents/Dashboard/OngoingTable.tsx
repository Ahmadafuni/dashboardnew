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
import { completeVariant } from "@/services/Dashboard.services";
import { userInfo } from "@/store/authentication";
import {
  currentVariantId,
  cuttingSendConfirmationModal,
  othersSendConfirmationModal,
  pauseUnpauseModal,
} from "@/store/dashboard";
import { WorkType } from "@/types/Dashboard/Dashboard.types";
import { format } from "date-fns";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface Props {
  works: WorkType;
  setWorks: any;
  setSelectedSizes: (sizes: string[]) => void;
  setQuantityReceived: (quantity: any[]) => void; // Add the new prop
}

export default function OngoingTable({ works, setWorks, setSelectedSizes, setQuantityReceived }: Props) {
  const renderQuantity = (quantity: any) => {
    if (Array.isArray(quantity)) {
      return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
    }
    return quantity;
  };
  const setCurrentVariant = useSetRecoilState(currentVariantId);
  const setPauseUnpause = useSetRecoilState(pauseUnpauseModal);
  const setCuttingConfirmation = useSetRecoilState(cuttingSendConfirmationModal);
  const setConfirmationOthers = useSetRecoilState(othersSendConfirmationModal);
  const user = useRecoilValue(userInfo);

  const handleSendConfirmation = (item: any) => {
    const sizes = item.ModelVariant.Sizes ? JSON.parse(item.ModelVariant.Sizes).map((e: any) => e.label) : [];
    const quantityReceived = item.QuantityReceived || [];
    setSelectedSizes(sizes);
    setQuantityReceived(quantityReceived);
    setCurrentVariant(item.ModelVariant.Id);
    setConfirmationOthers(true);
  };

  const handleSendCuttingConfirmation = (item: any) => {
    const sizes = item.ModelVariant.Sizes ? JSON.parse(item.ModelVariant.Sizes).map((e: any) => e.label) : [];
    setSelectedSizes(sizes);
    setCurrentVariant(item.ModelVariant.Id);
    setCuttingConfirmation(true);
  };

  return (
      <div>
        <h2 className="text-2xl font-bold">Ongoing</h2>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Model Number</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Target Quantity</TableHead>
                <TableHead>Received Quantity</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.inProgress.length <= 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No results.
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
                              .map((e:any) => e.label)
                              .join(", ")}
                        </TableCell>
                        <TableCell>{item.ModelVariant.Quantity}</TableCell>
                        <TableCell>{renderQuantity(item.QuantityReceived)}</TableCell>
                        <TableCell>
                          {item.StartTime && format(new Date(item.StartTime), "dd/mm/yyyy HH:mm")}
                        </TableCell>
                        <TableCell className="space-x-1 space-y-1">
                          {item.RunningStatus === "RUNNING" ? (
                              <Button
                                  variant="destructive"
                                  onClick={() => {
                                    setCurrentVariant(item.ModelVariant.Id);
                                    setPauseUnpause(true);
                                  }}
                              >
                                Stop
                              </Button>
                          ) : (
                              <Button
                                  variant="secondary"
                                  onClick={() => {
                                    setCurrentVariant(item.ModelVariant.Id);
                                    setPauseUnpause(true);
                                  }}
                              >
                                Continue
                              </Button>
                          )}
                          {user?.category === "CUTTING" ? (
                              <Button
                                  onClick={() => {
                                    handleSendCuttingConfirmation(item)
                                  }}
                              >
                                Send for Confirmation
                              </Button>
                          ) : user?.category !== "QUALITYASSURANCE" ? (
                              <Button onClick={() => handleSendConfirmation(item)}>
                                Send for Confirmation
                              </Button>
                          ) : (
                              <BasicConfirmationDialog
                                  btnText="Complete"
                                  takeAction={() => {
                                    completeVariant(setWorks, item.Id);
                                  }}
                                  className=""
                              />
                          )}
                        </TableCell>
                      </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
