import { Button } from "@/components/ui/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRecoilState, useRecoilValue } from "recoil";
import { materialCategory, materialCategoryId } from "@/store/MaterialCategory.ts";
import { updateMaterialCategoryModal } from "@/store/MaterialCategory.ts";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { useTranslation } from "react-i18next";
import MaterialCategoryForm from "@/components/DashboradComponents/Stores/MaterialCategory/MaterialCategoryForm.tsx";
import {materialCategorySchema} from "@/form_schemas/newMaterialCategorySchema.ts";

type Props = {
    getMaterialCategories: any;
};

export default function UpdateMaterialCategory({ getMaterialCategories }: Props) {
    const categoryId = useRecoilValue(materialCategoryId);
    const [open, setOpen] = useRecoilState(updateMaterialCategoryModal);
    const [isLoading, setIsLoading] = useState(false);
    const currentMaterialCategory = useRecoilValue(materialCategory);
    const { t } = useTranslation();

    const form = useForm<z.infer<typeof materialCategorySchema>>({
        resolver: zodResolver(materialCategorySchema),
        defaultValues: {
            CategoryName: "",
            Description: "",
        },
        values: currentMaterialCategory,
    });

    const onSubmit = async (data: z.infer<typeof materialCategorySchema>) => {
        setIsLoading(true);
        try {
            const updateMaterialCategory = await axios.put(
                `materialcategory/${categoryId}`,
                data,
                {
                    headers: {
                        Authorization: `bearer ${Cookies.get("access_token")}`,
                    },
                }
            );
            toast.success(updateMaterialCategory.data.message);
            getMaterialCategories();
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
                    <DialogTitle>{t("Update Material Category")}</DialogTitle>
                </DialogHeader>
                <MaterialCategoryForm form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>{t("Cancel")}</Button>
                    <Button type="submit" disabled={isLoading} form="material-category-form">
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
    );
}
