import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { newProductCategoryOneModal } from "@/store/ProductCategoryOne.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import ProductCategoryOneDialog from "@/components/DashboradComponents/Entities/ProductCategoryOne/ProductCategoryOneDialog.tsx";
import {ProductCategoryOneSchema} from "@/form_schemas/newProductCategoryOneSchema.ts";
import {ProductCategoryOneType} from "@/types/Entities/ProductCategoryOne.types.ts";

type Props = {
    getProductCategoriesOne: any;
};

export default function NewProductCategoryOne({ getProductCategoriesOne }: Props) {
    const [open, setOpen] = useRecoilState(newProductCategoryOneModal);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<ProductCategoryOneType>({
        resolver: zodResolver(ProductCategoryOneSchema),
        defaultValues: {
            ProductCatalogCategoryOne: "",
            Description: "",
        },
    });

    const onSubmit = async (data: ProductCategoryOneType) => {
        setIsLoading(true);
        try {
            const newCategoryOne = await axios.post("productCategoryOne", data);
            toast.success(newCategoryOne.data.message);
            getProductCategoriesOne();
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
                    <DialogTitle>New Product Category One</DialogTitle>
                </DialogHeader>
                <ProductCategoryOneDialog form={form} onSubmit={onSubmit} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Add"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
