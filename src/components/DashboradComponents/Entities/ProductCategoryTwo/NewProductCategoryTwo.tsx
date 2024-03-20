import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { newProductCategoryTwoModal } from "@/store/ProductCategoryTwo.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import ProductCategoryTwoDialog from "@/components/DashboradComponents/Entities/ProductCategoryTwo/ProductCategoryTwoDialog.tsx";
import {ProductCategoryTwoType} from "@/types/Entities/ProductCategoryTwo.types.ts";
import {ProductCategoryTwoSchema} from "@/form_schemas/newProductCategoryTwoSchema.ts";
import {useTranslation} from "react-i18next";

type Props = {
    getProductCategoriesTwo: any;
};

export default function NewProductCategoryTwo({ getProductCategoriesTwo }: Props) {
    const [open, setOpen] = useRecoilState(newProductCategoryTwoModal);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const form = useForm<ProductCategoryTwoType>({
        resolver: zodResolver(ProductCategoryTwoSchema),
        defaultValues: {
            ProductCatalogCategoryTwo: "",
            Description: "",
        },
    });

    const onSubmit = async (data: ProductCategoryTwoType) => {
        setIsLoading(true);
        try {
            const newCategoryTwo = await axios.post("productCategoryTwo", data);
            toast.success(newCategoryTwo.data.message);
            getProductCategoriesTwo();
            form.reset();
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
                    <DialogTitle>{t("NewProductCategoryTwo")}</DialogTitle>
                </DialogHeader>
                <ProductCategoryTwoDialog form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {t("Close")}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
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
