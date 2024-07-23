import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import MovementForm from "./MovementForm";
import { newMaterialMovementSchema } from "@/form_schemas/newMaterialMovementSchema";
import { z } from "zod";

export default function NewMovement() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    // Form fields
    const form = useForm<z.infer<typeof newMaterialMovementSchema>>({
        resolver: zodResolver(newMaterialMovementSchema),
        defaultValues: {
            movementType: "",
            invoiceNumber: "",
            movementDate: new Date(),
            parentMaterialId: "",
            childMaterialId: "",
            quantity: "",
            unitOfQuantity: "",
            description: "",
            warehouseFromId: "",
            warehouseToId: "",
            supplierId: "",
            departmentFromId: "",
            departmentToId: "",
            modelId: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof newMaterialMovementSchema>) => {
        data.movementType ="INCOMING";
        setIsLoading(true);
        try {
            const newMovement = await axios.post("materialmovement/", data, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            toast.success(newMovement.data.message);
            setIsLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1 flex items-center">
                <h1 className="text-3xl font-bold w-full">{t("New Movement")}</h1>
            </div>
            <Separator />
            <div className="space-y-1">
                <MovementForm form={form} onSubmit={onSubmit} />
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="secondary" onClick={() => form.reset()} >
                        {t("Clear")}
                    </Button>
                    <Button type="submit" disabled={isLoading} form="incoming-movement">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("Please wait")}
                            </>
                        ) : (
                            t("Add")
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
