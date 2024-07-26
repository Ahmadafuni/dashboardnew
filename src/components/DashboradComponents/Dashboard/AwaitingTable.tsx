import BasicConfirmationDialog from "@/components/common/BasicConfirmationDialog";
import {Button} from "@/components/ui/button";
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
import {WorkType} from "@/types/Dashboard/Dashboard.types";
import ConfirmRejectAlertDialog from "./ConfirmRejectAlertDialog";
import {useRecoilValue} from "recoil";
import {userInfo} from "@/store/authentication";

interface Props {
    works: WorkType;
    setWorks: any;
}

export default function AwaitingTable({works, setWorks}: Props) {
    console.log("Works",works)
    const user = useRecoilValue(userInfo);
    console.log("AwaitingTable", works.awaiting);
    const renderQuantity = (quantity: any) => {
        if (Array.isArray(quantity)) {
            return quantity.map((q) => `${q.size}: ${q.value}`).join(", ");
        }
        return quantity;
    };

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
                                        {item.ModelVariant.Model.DemoModelNumber}
                                    </TableCell>
                                    <TableCell>{item.ModelVariant.Color.ColorName}</TableCell>
                                    <TableCell>
                                        {JSON.parse(item.ModelVariant.Sizes)
                                            .map((e: any) => e.label)
                                            .join(", ")}
                                    </TableCell>
                                    <TableCell>{item.ModelVariant.Quantity}</TableCell>
                                    {/* I check the QuantityInKg to Know that TrackingId belongs to Cutting*/}
                                    {item?.QuantityInKg != null ? (
                                        <>
                                            <TableCell>{renderQuantity(item.QuantityInNum)}</TableCell>
                                        </>
                                    ) : (
                                        <>
                                            {/* The Process: if we have QuantityDelivered from dep,
                                             this QuantityDelivered should be the QuantityReceived for current Dep. */}
                                            <TableCell>{renderQuantity(item.QuantityDelivered)}</TableCell>
                                        </>
                                    )}
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
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
