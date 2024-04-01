import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { warehouseSchema } from "@/form_schemas/newWarehouseSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import WarehouseForm from "@/components/DashboradComponents/Warehouses/WarehouseForm.tsx";
import {useRecoilState} from "recoil";
import {newWarehouseModal} from "@/store/Warehouse.ts";

type Props = {
    getWarehouse: any;
};
export default function NewWarehouse({ getWarehouse }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useRecoilState(newWarehouseModal);

    // Form fields
    const form = useForm<z.infer<typeof warehouseSchema>>({
        resolver: zodResolver(warehouseSchema),
        defaultValues: {
            WarehouseName: "",
            CategoryName: "",
            Location: "",
            Capacity: 0,
        },
    });

    const onSubmit = async (data: z.infer<typeof warehouseSchema>) => {
        setIsLoading(true);
        try {
            const newWarehouse = await axios.post("warehouse/", data, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            toast.success(newWarehouse.data.message);
            getWarehouse();
            form.reset();
            setIsLoading(false);
            setOpen(false); // Close dialog after successful submission
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            setIsLoading(false);
        }
    };

    return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t("New Warehouse")}</DialogTitle>
                    </DialogHeader>
                    <WarehouseForm form={form} onSubmit={onSubmit} />
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
                        <Button type="submit" disabled={isLoading} form="warehouse-form">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("Please wait")}
                                </>
                            ) : (
                                t("Add")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    );
}
