import { Button } from "@/components/ui/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { newMaterialMovementModal } from "@/store/MaterialMovement.ts";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { useTranslation } from "react-i18next";
import { materialMovementSchema } from "@/form_schemas/newMaterialMovementSchema.ts";
import MaterialMovementForm from "@/components/DashboradComponents/Stores/MaterialMovement/MaterialMovementForm.tsx";

type Props = {
    movementType: string;
};

export default function NewMaterialMovement({ movementType }: Props) {
    const [open, setOpen] = useRecoilState(newMaterialMovementModal);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const form = useForm<z.infer<typeof materialMovementSchema>>({
        resolver: zodResolver(materialMovementSchema),
        defaultValues: {
            MaterialId: 0,
            FromLocationType: "",
            FromLocationId: 0,
            ToLocationType: "",
            ToLocationId: 0,
            MovementType: movementType ,
            Quantity: 0,
            UnitOfMeasure: "",
            Description: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof materialMovementSchema>) => {
        setIsLoading(true);
        try {
            const newMaterialMovement = await axios.post("materialmovement", data, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            toast.success(newMaterialMovement.data.message);
            setIsLoading(false);
            setOpen(false);
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
                    <DialogTitle>{t("New Material Movement")}</DialogTitle>
                </DialogHeader>
                <MaterialMovementForm form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
                    <Button type="submit" disabled={isLoading} form="material-movement-form">
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
