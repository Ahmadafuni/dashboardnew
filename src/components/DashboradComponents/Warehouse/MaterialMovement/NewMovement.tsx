import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import MovementForm from "./MovementForm";
import { newMaterialMovementSchema } from "@/form_schemas/newMaterialMovementSchema";
import { z } from "zod";
import { getMaterialMovementsByMovementType } from "@/services/MaterialMovements.services.ts";
import { useSetRecoilState } from "recoil";
import { materialMovementList } from "@/store/MaterialMovement.ts";

interface Props {
    movementFromOptions: any[];
    movementToOptions: any[];
    movementType: string;
    defaultValues?: any;
    typeAction?:string;
    children?:any
    

}

export default function NewMovement({ 
    movementFromOptions, 
    movementToOptions, 
    movementType , 
    defaultValues = {}, 
    typeAction,
    children,
}: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const setMaterialMovement = useSetRecoilState(materialMovementList);

    const form = useForm<z.infer<typeof newMaterialMovementSchema>>({
        resolver: zodResolver(newMaterialMovementSchema),
        defaultValues: defaultValues,
    });

    const onSubmit = async (data: z.infer<typeof newMaterialMovementSchema>) => {
       // data.movementType = movementType;
        setIsLoading(true);
        try {

            if (typeAction === t("Add")) {
                const newMovement = await axios.post("materialmovement/", data, {
                    headers: {
                        Authorization: `bearer ${Cookies.get("access_token")}`,
                    },
                });
                toast.success(newMovement.data.message);
            } else if (typeAction === t("Edit")) {
                const updatedMovement = await axios.put(`materialmovement/${defaultValues.id}`, data, {
                    headers: {
                        Authorization: `bearer ${Cookies.get("access_token")}`,
                    },
                });
                toast.success(updatedMovement.data.message);
            }
            
            getMaterialMovementsByMovementType(setMaterialMovement, movementType);

            form.reset({
                parentMaterialId: "",
                childMaterialId: "",
                quantity: "",
                unitOfQuantity: "",
                description: "",
                modelId: "",
            });

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
            <div className="space-y-1">
                <MovementForm form={form} onSubmit={onSubmit} movementFromOptions={movementFromOptions} movementToOptions={movementToOptions} />
                <div className="flex justify-end space-x-4">
                  
                    {children}
                    <Button type="button" variant="secondary" onClick={() => form.reset()}>
                        {t("Clear")}
                    </Button>
                    <Button type="submit" disabled={isLoading} form="incoming-movement">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("PleaseWait")}
                            </>
                        ) : (
                            typeAction
                        )}
                    </Button>
                    

                </div>
            </div>
        </div>
    );
}
