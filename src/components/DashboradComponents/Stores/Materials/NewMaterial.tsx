import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { materialSchema } from "@/form_schemas/newMaterialSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import MaterialForm from "@/components/DashboradComponents/Stores/Materials/MaterialForm.tsx";
import Cookies from "js-cookie";
import NewMaterialCategory from "@/components/DashboradComponents/Stores/MaterialCategory/NewMaterialCategory.tsx";
import {getAllMaterialCategories} from "@/services/MaterialCategory.services.ts";
import {useSetRecoilState} from "recoil";
import {materialCategoryList} from "@/store/MaterialCategory.ts";

export default function NewMaterial ()  {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const setMaterialCategoryList = useSetRecoilState(materialCategoryList);

    // Form fields
    const form = useForm<z.infer<typeof materialSchema>>({
        resolver: zodResolver(materialSchema),
        defaultValues: {
            Name: "",
            Type: "",
            CategoryId: 0,
            Color: "",
            MinimumStockLevel: 0,
            MaximumStockLevel: 0,
            UnitOfMeasure: "",
            Location: "",
            Description: "",
        },
    });
    // Form submit function
    const onSubmit = async (data: z.infer<typeof materialSchema>) => {
        setIsLoading(true);
        try {
            const newMaterial = await axios.post("material/", data, {
                headers: {
                    Authorization: `bearer ${Cookies.get("access_token")}`,
                },
            });
            toast.success(newMaterial.data.message);
            form.reset();
            setIsLoading(false);
            navigate("/dashboard/materials");
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllMaterialCategories(setMaterialCategoryList)
    }, []);
    return (
        <div className="w-full space-y-2">
            <NewMaterialCategory getMaterialCategories={getAllMaterialCategories(setMaterialCategoryList)} />
            <div className="w-full space-y-1">
                <h1 className="text-3xl font-bold w-full">{t("New Material")}</h1>
                <Separator />
            </div>
            <div className="space-y-1">
                <MaterialForm form={form} onSubmit={onSubmit} />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} form="material">
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
};
