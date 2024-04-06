import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import OrderForm from "./OrderForm.tsx";
import {order, orderId, updateOrderModal} from "@/store/Orders.ts";
import {OrderSchema} from "@/form_schemas/newOrderSchema.ts";
import {z} from "zod";
import NewCollection from "@/components/DashboradComponents/Entities/Collections/NewCollection.tsx";
import {getAllCollections} from "@/services/Collection.services.ts";
import {CollectionList} from "@/store/Collection.ts";

type Props = {
    getAllOrders: any;
};

const UpdateOrder = ({ getAllOrders }: Props) => {
    const orderID = useRecoilValue(orderId);
    const [open, setOpen] = useRecoilState(updateOrderModal);
    const [isLoading, setIsLoading] = useState(false);
    const currentOrder = useRecoilValue(order);
    const setCollectionList = useSetRecoilState(CollectionList);
    const { t } = useTranslation();
    const form = useForm({
        resolver: zodResolver(OrderSchema),
        defaultValues: currentOrder,
    });

    const onSubmit = async (data: z.infer<typeof OrderSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.put(
                `orders/${orderID}`,
                data,
                {
                    headers: {
                        Authorization: `bearer ${Cookies.get("access_token")}`,
                    },
                }
            );
            toast.success(response.data.message);
            getAllOrders();
            setIsLoading(false);
            setOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            setIsLoading(false);
        }
    };

    // Page on load
    useEffect(() => {
        getAllCollections(setCollectionList);
    });

    return (
    <div className="w-full space-y-2">
        <NewCollection getAllCollections={setCollectionList} />
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("UpdateOrder")}</DialogTitle>
                </DialogHeader>
                <OrderForm form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {t("Close")}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        form="order"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("Please wait")}
                            </>
                        ) : (
                            t("Update")
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
    );
};

export default UpdateOrder;
