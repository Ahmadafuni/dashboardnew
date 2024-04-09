import ModelForm from "@/components/DashboradComponents/Models/ModelForm.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import {  Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import {ModelSchema} from "@/form_schemas/newModelSchema.ts";
import {getAllModels} from "@/services/Model.services.ts";
import {modelList} from "@/store/Models.ts";

export default function NewModel() {
    // Translation
    const { t } = useTranslation();

    // Loading
    const [isLoading, setIsLoading] = useState(false);

    // Recoil state
    const setModelList = useSetRecoilState(modelList);

    // Form fields
    const form = useForm<z.infer<typeof ModelSchema>>({
        resolver: zodResolver(ModelSchema),
        defaultValues: {
            OrderID: 0,
            ProductCatalogID: 0,
            CategoryOne: 0,
            CategoryTwo: 0,
            Textile: 0,
            TemplateID: 0,
            TotalQuantity: 0,
            ModelNumber: "",
            ModelName: "",
            Sizes: [],
            Colors: [],
            Characteristics: "",
            Barcode: "",
            LabelType: "",
            PrintName: "",
            PrintLocation: "",
            Images: "",
            Description: "",
        },
    });

    // Form submit function
    const onSubmit = async (data: z.infer<typeof ModelSchema>) => {
        setIsLoading(true);
        try {
            const newModel = await axios.post(
                "models/",
                {
                    ...data,
                },
                {
                    headers: {
                        Authorization: `bearer ${Cookies.get("access_token")}`,
                    },
                }
            );
            toast.success(newModel.data.message);
            form.reset();
            setIsLoading(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            setIsLoading(false);
        }
    };

    // Page on load
    useEffect(() => {
        getAllModels(setModelList);
    }, []);

    return (
        <div className="w-full space-y-2">
            <div className="w-full space-y-1 flex items-center">
                <h1 className="text-3xl font-bold">{t("NewModel")}</h1>
            </div>
            <Separator />
            <div className="space-y-1">
                <ModelForm form={form} onSubmit={onSubmit} />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} form="model">
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
