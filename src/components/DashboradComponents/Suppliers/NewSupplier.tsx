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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import SupplierForm from "@/components/DashboradComponents/Suppliers/SupplierForm.tsx";
import { useRecoilState } from "recoil";
import { newSupplierModal } from "@/store/Supplier.ts";
import {supplierSchema} from "@/form_schemas/newSupplierSchema.ts";

type Props = {
    getSuppliers: any;
};

export default function NewSupplier({ getSuppliers }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useRecoilState(newSupplierModal);

    // Form fields
    const form = useForm<z.infer<typeof supplierSchema>>({
        resolver: zodResolver(supplierSchema),
        defaultValues: {
            Name: "",
            Address: "",
            PhoneNumber: "",
            email: "",
            Description: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof supplierSchema>) => {
        setIsLoading(true);
        try {
            const newSupplier = await axios.post("supplier/", data, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            toast.success(newSupplier.data.message);
            getSuppliers();
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
                    <DialogTitle>{t("New Supplier")}</DialogTitle>
                </DialogHeader>
                <SupplierForm form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
                    <Button type="submit" disabled={isLoading} form="supplier-form">
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
