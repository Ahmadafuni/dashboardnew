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

interface Props {
    works: WorkType;
    setWorks: any;
}

export default function AwaitingTable({ works, setWorks }: Props) {
    const user = useRecoilValue(userInfo);
    const userRole = user?.userRole;

    const renderQuantity = (quantity: any) => {
        if (Array.isArray(quantity)) {
            return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
        }
        return quantity;
    };

    const renderAdminRow = (item: any) => (
        <>
            <TableCell>{item.PrevStage?.Department?.Name || "N/A"}</TableCell>
            <TableCell>{item.CurrentStage?.Department?.Name || "N/A"}</TableCell>
            <TableCell>{item.NextStage?.Department?.Name || "N/A"}</TableCell>
            <TableCell>{item.StartTime ? format(new Date(item.StartTime), "yyyy-MM-dd HH:mm:ss") : "N/A"}</TableCell>
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
                    Details
                </Button>
            </TableCell>
        </>
    );

    const renderUserRow = (item: any) => (
        <TableCell className="space-x-1 space-y-1">
            {item.MainStatus === "TODO" ? (
                <BasicConfirmationDialog
                    btnText="Start"
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
                Details
            </Button>
        </TableCell>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold">Awaiting</h2>
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Model Number</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Target Quantity</TableHead>
                            <TableHead>Received Quantity</TableHead>
                            {userRole === "FACTORYMANAGER" || userRole === "ENGINEERING" ? (
                                <>
                                    <TableHead>Prev Stage</TableHead>
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
                                        {item.ModelVariant.Model.DemoModelNumber}
                                    </TableCell>
                                    <TableCell>{item.ModelVariant.Color.ColorName}</TableCell>
                                    <TableCell>
                                        {JSON.parse(item.ModelVariant.Sizes)
                                            .map((e: any) => e.label)
                                            .join(", ")}
                                    </TableCell>
                                    <TableCell>{item.ModelVariant.Quantity}</TableCell>
                                    {item?.QuantityInKg != null ? (
                                        <TableCell>{renderQuantity(item.QuantityInNum)}</TableCell>
                                    ) : (
                                        <TableCell>{renderQuantity(item.MainStatus === "CHECKING" ? item.QuantityDelivered : item.QuantityReceived)}</TableCell>
                                    )}
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
